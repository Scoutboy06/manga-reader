const $ = s => s[0] == '#' ? document.querySelector(s) : document.querySelectorAll(s);

const root = $('#root');
const title = $('#title');


let chapters = {
	prev: null,
	next: null,
};


function createElement(innerHTML) {
	const div = document.createElement('div');
	div.innerHTML = innerHTML; //.replace(/\n/g, '');
	return div.firstElementChild;
}


async function loadChapter() {
	root.innerHTML = '';
	
	let [ urlName, chapter ] = location.href.split('/').slice(-2);

	const chapterName = isNaN(Number(chapter)) ? chapter : 'Chapter ' + chapter;

	title.textContent = chapterName;
	$('title')[0].textContent = chapterName;


	const res = await fetch(`/api/manga/${urlName}/${chapter}`);
	const data = await res.json();

	if(res.status === 507) {
		console.error(data.message);
		alert('error', data.message);

		window.open(data.originalUrl, '_blank');

		const newSelector = prompt(`New attribute selector for ${data.hostName}`);

		try {
			await fetch(`/api/manga/updateAttributeSelector`, {
				method: 'PUT',
				body: JSON.stringify({ hostId: data.hostId, newSelector }),
				headers: { 'Content-Type': 'application/json' },
			});

			loadChapter();
		}	catch(err) {
			alert('error', err);
			console.error(err);
		}

		return;
	}

	chapters = {
		prev: data['prevPath'],
		next: data['nextPath'],
		originalUrl: data['originalUrl'],
	};


	for(const btn of $('.pagination.backBtn')) {
		if(chapters['prev']) btn.removeAttribute('disabled');
		else btn.setAttribute('disabled', '');
	}
	for(const btn of $('.pagination.nextBtn')) {
		if(chapters['next']) btn.removeAttribute('disabled');
		else btn.setAttribute('disabled', '');
	}

	if(chapters['originalUrl']) {
		const el = $('#originBtn');
		el.setAttribute('href', chapters['originalUrl']);
		el.removeAttribute('disabled');
	} else {
		const el = $('#originBtn');
		el.setAttribute('href', '#');
		el.setAttribute('disabled', '');
	}


	data['images'].forEach(src => {
		const img = new Image();
		img.setAttribute('loading', 'lazy');
		img.src = encodeURI(src.replace('i2.wp.com/', ''));

		img.addEventListener('error', e => {
			if(img.src.startsWith(location.origin))
				alert('error', 'Image(s) could not load');
			else
				img.src = location.origin + '/api/image/' + encodeURI(src.replace('i2.wp.com/', ''));
		});

		root.appendChild(img);
	});


	fetch(`/api/manga/updateProgress`, {
		method: 'POST',
		body: JSON.stringify({ urlName, chapter }),
		headers: { 'Content-Type': 'application/json' },
	})
		.catch(console.error);

}





function isTouchDevice() {
	try {
		document.createEvent('TouchEvent');
		return true;
	} catch(e) {
		return false;
	}
}


function isMobile() {
	return navigator.userAgent.match(/Android/i) 
		|| navigator.userAgent.match(/webOS/i) 
		|| navigator.userAgent.match(/iPhone/i)  
		|| navigator.userAgent.match(/iPad/i)  
		|| navigator.userAgent.match(/iPod/i) 
		|| navigator.userAgent.match(/BlackBerry/i) 
		|| navigator.userAgent.match(/Windows Phone/i);
}



function newChapter(dir) {
	if(dir > 0) {
		if(!chapters.next)
			return alert('error', 'Next chapter not found');

		history.pushState({}, '', chapters.next);
	}

	else {
		if(!chapters.prev)
			return alert('error', 'Previous chapter not found');

		history.pushState({}, '', chapters.prev);
	}

	loadChapter();
}




window.addEventListener('keyup', e => {
	if(e.key === 'ArrowRight') newChapter(1);
	else if(e.key === 'ArrowLeft') newChapter(-1);
});





window.addEventListener('load', () => {
	loadChapter();

	if(isTouchDevice()) {
		const script = document.createElement('script');
		script.setAttribute('src', '/js/swipedetect.min.js');
		document.body.appendChild(script);
	}

	if(!isMobile()) {
		const script = document.createElement('script');
		script.setAttribute('src', '/js/smoothscroll.min.js');
		document.body.appendChild(script);

		document.body.style['width'] = 'calc(100vw - 10px)';
	}


	for(const btn of $('.pagination.backBtn')) {
		btn.addEventListener('click', () => chapterClickHandler(btn));
	}

	for(const btn of $('.pagination.nextBtn')) {
		btn.addEventListener('click', () => chapterClickHandler(btn));
	}


	function chapterClickHandler(btn) {
		if(btn.getAttribute !== '') {
			for(const btn of $('.pagination:not(#homeBtn)')) {
				btn.setAttribute('disabled', '');
			}

			if(btn.classList.contains('backBtn'))
				newChapter(-1);
			else
				newChapter(1);
		}
	}
});


let alertTimeout;
function alert(type, message) {
	const el = $('#alert');

	el.classList.add('show');
	el.classList.add(type);
	el.textContent = message;

	setTimeout(() => {
		if(alertTimeout) clearTimeout(alertTimeout);
		el.classList.remove(type);
		alertTimeout = setTimeout(() => {
			el.classList.remove('show');
			el.textContent = '';
		}, 300);
	}, 5000);
}