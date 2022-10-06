import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';

import Manga from '../models/mangaModel.js';
import Host from '../models/hostModel.js';

// @desc	Search for new mangas
// @route	GET /search
export const searchManga = asyncHandler(async (req, res) => {
	const { query } = req.query;

	const hosts = await Host.find();

	let returnData = [];

	for (const host of hosts) {
		const { search } = host;

		const url = search.url.replace('%query', query);

		const raw = await fetch(url, { method: host.search.method });
		const html = await raw.text();
		const document = HTMLParser.parse(html);

		const mangas = document.querySelectorAll(host.search.container);
		const results = [];

		for (const manga of mangas) {
			const posterEl = manga.querySelector(search.poster);
			const poster = posterEl.getAttribute('data-src') || posterEl.getAttribute('data-srcset') || posterEl.getAttribute('srcset') || posterEl.getAttribute('src');
			const title = manga.querySelector(search.title).textContent.trim();
			const latestChapter = manga.querySelector(search.latestChapter).textContent.trim();
			const latestUpdate = manga.querySelector(search.latestUpdate).textContent.trim();
			const detailsPage = manga.querySelector(search.detailsPage).getAttribute('href');

			const detailsPageSplit = detailsPage.split('/');
			const urlNameIndex = host.detailsPage.url.split('/').indexOf('%name');
			const urlName = detailsPageSplit[urlNameIndex];

			results.push({
				poster,
				title,
				latestChapter,
				latestUpdate,
				detailsPage,
				urlName,
			});
		}

		returnData.push({
			hostName: host.name,
			results,
		});
	}

	res.status(200).json(returnData);
});


