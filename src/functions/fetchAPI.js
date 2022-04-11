export default function fetchAPI(url, options) {
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

	return fetch(url, fetchOptions).then(res => {
		if (!res.ok) throw new Error(res);
		return res.json();
	});
}