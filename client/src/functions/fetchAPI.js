import cache from 'memory-cache';

export default async function fetchAPI(url, options = {}, useCache = false) {
	if (useCache && cache.get(url)) return cache.get(url);

	let fetchOptions = {
		...options,
		headers: {
			'Content-Type': 'application/json',
		},
	};

	if (options?.headers) {
		for (const key of Object.keys(options.headers)) {
			fetchOptions.headers[key] = options[key];
		}
	}

	const ENV = process.env.REACT_APP_ENV;
	let API_URI = (ENV !== 'development' ? process.env.REACT_APP_API_URI : '');
	if (url[0] !== '/') API_URI += '/';

	try {
		const res = await fetch(API_URI + url, fetchOptions);
		const json = await res.json();

		if (useCache) cache.put(url, json);

		return json;
	} catch (err) {
		console.error(err);
		window.alert(err);
	}
}