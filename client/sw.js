const cacheName = 'manga-reader-cache';
const filesToCache = [
	'/page.html',
	'/css/page.css',
	// '/js/page.js',
	'/js/swipedetect.min.js',
	'/js/smoothscroll.min.js',
	'/index.html',
	'/css/index.css',
	'/js/index.js',
	'/icons/arrow_back-24dp.svg',
	'/icons/arrow_forward-24dp.svg',
	'/icons/home-white-24dp.svg',
	'/icons/search-white-24dp.svg',
	'/icons/add-white-24dp.svg',
];


self.addEventListener('install', e => {
	e.waitUntil(
		caches.open(cacheName).then(cache => {
			return cache.addAll(filesToCache);
		})
	);
});


// self.addEventListener('fetch', e => {
// 	e.respondWith(
// 		caches.match(e.request).then(r => {
// 			return r || fetch(e.request);
// 		})
// 	);
// });