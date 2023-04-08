const { SCRAPER_URI } = process.env;

if (!SCRAPER_URI) {
	throw new Error('Please add `SCRAPER_URI` to .env.local');
}

export default async function fetchScraper(
	input: RequestInfo | URL,
	init?: RequestInit | undefined
) {
	const url = new URL(input.toString(), SCRAPER_URI);

	return fetch(url.href, init).then(res => res.json());
}
