import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';
import mcache from 'memory-cache';

export const cachedResults = new mcache.Cache();

export default async function getAnimeMeta(urlName, cache = true) {
	if (cache) {
		const cachedValue = cachedResults.get(urlName);
		if (cachedValue !== null) {
			return cachedValue;
		}
	}

	const html = await fetch(`https://gogoanime.tel/category/${urlName}`, { redirect: 'follow' }).then(res => res.text());
	const document = HTMLParser.parse(html);

	const stripTitle = parent => {
		const title = parent.childNodes[0].textContent;
		const desc = parent.textContent.slice(title.length);
		return desc;
	}

	const main_body = document.querySelector('.main_body');
	const imgUrl = main_body.querySelector('.anime_info_body_bg img').getAttribute('src').trim();
	const title = main_body.querySelector('.anime_info_body_bg h1').textContent.trim();
	const description = stripTitle(main_body.querySelector('.anime_info_body_bg p.type:nth-child(5)')).trim();

	const genres = stripTitle(main_body.querySelector('.anime_info_body_bg p.type:nth-child(6)')).trim();
	const released = stripTitle(main_body.querySelector('.anime_info_body_bg p.type:nth-child(7)')).trim();
	const status = stripTitle(main_body.querySelector('.anime_info_body_bg p.type:nth-child(8)')).trim();
	const otherNames = stripTitle(main_body.querySelector('.anime_info_body_bg p.type:nth-child(9)')).trim();


	const ep_start = main_body.querySelector('#episode_page li:first-child a').getAttribute('ep_start');
	const ep_end = main_body.querySelector('#episode_page li:last-child a').getAttribute('ep_end');
	const id = main_body.querySelector('#movie_id').getAttribute('value');

	const episodesHTML = await fetch('https://ajax.gogo-load.com/ajax/load-list-episode?' + new URLSearchParams({
		ep_start,
		ep_end,
		id,
	})).then(res => res.text());
	const episodesDocument = HTMLParser.parse(episodesHTML);
	const aList = episodesDocument.querySelectorAll('a');

	let episodes = [];

	for (let i = aList.length - 1; i >= 0; i--) {
		const a = aList[i];
		const number = Number(stripTitle(a.querySelector('.name')).trim());
		const urlName = `episode-${number}`;
		const gogoUrlName = a.getAttribute('href').trim().replace('/', '');
		const status = '';
		episodes.push({ number, urlName, gogoUrlName, status });
	};

	const data = {
		// ownerId,
		urlName,
		title,
		description,
		genres,
		released,
		status,
		otherNames,
		episodes,
		// isFavorite,
		// hasWatched,
		// notificationsOn,
		poster: {
			large: imgUrl,
		},
		// backdrops,
	};

	cachedResults.put(urlName, data);
	return data;
}

// setTimeout(async () => {
// 	const data = await getAnimeMeta('mushoku-tensei-isekai-ittara-honki-dasu');
// 	console.log(data);
// })