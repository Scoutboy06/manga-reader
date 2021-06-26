const $ = s => s.split(' ').slice(-1)[0][0] === '#' ? document.querySelector(s) : document.querySelectorAll(s);

const root = $('#root');
const title = $('#title');
const newManga = $('#newManga');
const newMangaOverLay = $('#overlay');


function createElement(innerHTML) {
	const div = document.createElement('div');
	div.innerHTML = innerHTML;
	return div.firstElementChild;
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


window.addEventListener('load', async () => {
	let raw = await fetch('/api/manga');
	const json = await raw.json();

	console.log(json);

	json.forEach(manga => {
		const a = createElement(`
			<a href="/${manga['urlName']}/${manga['chapter']}" class="item" data-id="${manga._id}">
				<div class="updates"></div>
				<div class="img">
					<img src="${manga['coverUrl']}">
				</div>
				<div class="footer">
						<span>${manga['name']}</span>
				</div>
			</a>
		`);

		root.appendChild(a);
	});


	if(!isMobile()) {
		document.body.style['width'] = 'calc(100vw - 20px)';
	}

	raw = await fetch('/api/getUpdates');
	const hasUpdates = await raw.json();

	console.log(hasUpdates);

	for(const mangaId of hasUpdates) {
		for(const el of root.children) {
			if(el.getAttribute('data-id') === mangaId) el.classList.add('hasUpdates');
		}
	}
});


$('#overlay header input')[0].addEventListener('keypress', async e => {
	if(e.keyCode !== 13) return;

	const content = $('#overlay content')[0];
	content.innerHTML = '';

	const searchTerm = e.target.value;


	const raw = await fetch(`/api/search?mangaName=${encodeURI(searchTerm)}`);
	const json = await raw.json();

	console.log(json);


	for(const host of json) {

		const container = createElement(`
			<div class="container">
				<div class="title">${host['hostName']}</div>
			</div>
		`);
		
		for(const manga of host['mangas']) {

			const item = createElement(`
				<div class="item">
					<div class="image">
						<img src="${manga['imgUrl']}" alt="Martial Peak">
					</div>
					<div class="details">
						<span class="mangaName">${manga['mangaName']}</span>
						<span class="latestChapter">${manga['latestChapter']}</span>
						<span class="latestUpdate">${manga['latestUpdate']}</span>
						<input class="urlName" type="hidden" value="${manga['urlName']}">
					</div>
				</div>
			`);

			container.appendChild(item);
		}

		content.appendChild(container);
	}
});


$('#overlay content')[0].addEventListener('click', e => {
	const path = e.path.reverse();
	
	if(path.length >= 8 && path[7].classList.contains('item')) {

		const selected = $('#overlay .item.selected')[0];

		if(path[7].classList.contains('selected')) {
			path[7].classList.remove('selected');
			$('#overlay footer button[type="submit"]')[0].setAttribute('disabled', '');
		}

		else {
			if(selected) selected.classList.remove('selected');
			path[7].classList.add('selected');
			$('#overlay footer button[type="submit"]')[0].removeAttribute('disabled');
		}
	}
});


$('#overlay footer button[type="submit"]')[0].addEventListener('click', e => {
	const selected = $('#overlay .item.selected')[0];


	const name = selected.querySelector('.mangaName').textContent;
	const lastChapter = selected.querySelector('.latestChapter').textContent.trim();
	const urlName = selected.querySelector('.urlName').value;

	const host = {
		hostName: selected.parentElement.querySelector('.title').textContent,
		mangaName: urlName,
	};

	const coverUrl = selected.querySelector('.image img').src;

	const sendData = {
		name,
		urlName,
		chapter: "chapter-1",
		lastChapter,
		subscribed: false,
		host,
		coverUrl,
	}

	console.log(sendData);

	fetch('/api/manga', {
		method: 'POST',
		body: JSON.stringify(sendData),
		headers: { 'Content-Type': 'application/json' },
	})
		.then(() => { location.reload() })
		// .then(res => res.json())
		// .then(console.log)
		.catch(console.error);
});


$('#overlay footer button[type="reset"]')[0].addEventListener('click', () => {
	newMangaOverLay.classList.remove('show');
	setTimeout(() => {
		$('#overlay content')[0].innerHTML = '';
	}, 300);
});







newManga.addEventListener('click', () => {
	newMangaOverLay.classList.add('show');
});
