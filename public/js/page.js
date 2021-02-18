const $ = s => s[0] == '#' ? document.querySelector(s) : document.querySelectorAll(s);

const api = 'http://127.0.0.1:3000/api';

const root = $('#root');
const title = $('#title');


async function getData(mangaName, chapter) {
	const raw = await fetch(`/api/${mangaName}/${chapter}`);
	const json = await raw.json();
	return json;
}


async function loadChapter() {
	root.innerHTML = '';
	
	const [ mangaName, chapter ] = location.href.split('/').slice(-2);

	title.textContent = 'Chapter ' + chapter;

	const links = await getData(mangaName, chapter);
	console.log(links)

	links.forEach(src => {
		const img = document.createElement('img');
		img.setAttribute('src', `/api/image/${encodeURI(src)}`);
		root.appendChild(img);
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
	}
});
