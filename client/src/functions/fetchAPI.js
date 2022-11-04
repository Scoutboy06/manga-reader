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

	const { VITE_API_URI } = import.meta.env;

	let API_URI = VITE_API_URI;
	if (url[0] !== '/' && VITE_API_URI[VITE_API_URI.length - 1] !== '/') API_URI += '/';

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

export const fetcher = url => fetchAPI(url, {}, false);