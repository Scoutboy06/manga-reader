/const cacheName = 'manga-reader-cache';
const filesToCache = [
	'/index.html',
	'/page.html',
	'/css/index.css',
	'/css/page.css',
	'/js/page.js',
	'/js/index.js',
	'/js/smoothscroll.min.js',
	'/js/swipedetect.min.js',
];


self.addEventListener('install', e => {
	e.waitUntil(
		caches.open(cacheName).then(cache => {
			return cache.addAll(filesToCache);
		})
	);
});


self.addEventListener('fetch', e => {
	e.respondWith(
		caches.match(e.request).then(r => {
			return r || fetch(e.request);
		})
	);
});