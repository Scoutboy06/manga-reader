self.addEventListener('install', e => {
	e.waitUntil(
		caches.open('sw-cache').then(cache => {
			[
				'/index.html',
				'/page.html',
				'/js/page.js',
				'/js/index.js',
				'/js/smoothscroll.min.js',
				'/js/swipedetect.min.js',
			]
				.forEach(item => cache.add(item));
		})
	);
});


self.addEventListener('fetch', e => {
	e.respondWith(
		caches.match(e.request).then(res => res || fetch(e.request))
	);
});