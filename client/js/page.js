const $ = s => s[0] == '#' ? document.querySelector(s) : document.querySelectorAll(s);

const root = $('#root');
const title = $('#title');


async function getData(mangaName, chapter) {
	const raw = await fetch(`/api/manga/${mangaName}/${chapter}`);
	const json = await raw.json();
	return json;
}


async function loadChapter() {
	root.innerHTML = '';
	
	let [ urlName, chapter ] = location.href.split('/').slice(-2);
	chapter = Number(chapter);

	title.textContent = 'Chapter ' + chapter;

	const links = await getData(urlName, chapter);

	links.forEach(src => {
		const img = document.createElement('img');
		img.setAttribute('loading', 'lazy');
		img.setAttribute('src', `${encodeURI(src)}`);
		root.appendChild(img);
	});

	fetch(`/api/manga/updateProgress`, {
		method: 'POST',
		body: JSON.stringify({ urlName, chapter }),
		headers: { 'Content-Type': 'application/json' }
	})
		.catch(console.error);


	// preloadChapter(1);
}


async function preloadChapter(dir) {
	let [ mangaName, chapter ] = location.href.split('/').slice(-2);
	chapter = Number(chapter) + dir;

	const links = await getData(mangaName, chapter);

	links.forEach(link => {
		const img = new Image();
		img.src = link;
	});
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
	const newChapter = Number(location.href.split('/').slice(-1)[0]) + dir;
	history.pushState({}, null, newChapter);
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
});
