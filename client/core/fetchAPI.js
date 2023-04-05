import cache from 'memory-cache';

export default async function fetchAPI(url, options = {}, useCache = false) {
	if (useCache && cache.get(url)) return cache.get(url);

	let fetchOptions = {
		...options,
		headers: {
			...options.headers,
			'Content-Type': 'application/json',
		},
	};

	try {
		const res = await fetch(new URL(url, process.env.NEXT_PUBLIC_API_URI), fetchOptions);
		const json = await res.json();

		if (useCache) cache.put(url, json);

		return json;
	} catch (err) {
		console.error(err);
	}
}

export const fetcher = url => fetchAPI(url, {}, false);