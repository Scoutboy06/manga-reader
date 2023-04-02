import fetch from 'node-fetch';
// import HTMLParser from 'node-html-parser';
import mcache from 'memory-cache';

const cachedResults = new mcache.Cache();

export default async function getAnimeEpisode(episodeUrlName, cache = true) {
	const url = `https://gogoanime.gg/${episodeUrlName}`;

	if (cache) {
		const cachedValue = cachedResults.get(episodeUrlName);
		if (cachedValue !== null) {
			return cachedValue;
		}
	}


	const html = await fetch(url).then(res => res.text());
	// const document = HTMLParser.parse(html);

	// const iframeSrc = document.querySelector('.play-video > iframe').getAttribute('src');
	const iframeStartIndex = html.indexOf('<iframe');
	const iframeEndIndex = html.indexOf('</iframe>');

	let iframeSrc = 'https:';
	for (let i = iframeStartIndex + 13; i < iframeEndIndex; i++) {
		if (html[i] === '"' && html[i + 1] === ' ') break;
		iframeSrc += html[i];
	}

	const data = {
		urlName: episodeUrlName,
		originalUrl: url,
		iframeSrc,
	};

	cachedResults.put(episodeUrlName, data);
	return data;
}

// setTimeout(async () => {
// 	const data = await getAnimeEpisode('mushoku-tensei-isekai-ittara-honki-dasu', 4);
// 	console.log(data);
// }, 1000);