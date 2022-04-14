import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';

import Manga from '../models/mangaModel.js';
import Host from '../models/hostModel.js';

// @desc	Search for new mangas
// @route	GET /api/search
const search = asyncHandler(async (req, res) => {
	const keyword = req.query.mangaName
		? {
			name: {
				$regex: req.query.mangaName,
				$options: 'i',
			},
		}
		: {};

	const noProxyHosts = await Host.find({ needProxy: false });

	let data = [];

	for (const host of noProxyHosts) {
		if (!host['search']) continue;

		const url = host['search']['url'].replace(
			'%searchTerm%',
			req.query.mangaName
		);

		const raw = await fetch(url);
		const html = await raw.text();
		const document = HTMLParser.parse(html);

		const { selectors } = host['search'];

		let hostData = {
			hostName: host['hostName'],
			needProxy: host['needProxy'],
			mangas: [],
		};

		const mangas = document.querySelectorAll(selectors['parent']);

		for (const manga of mangas) {
			if (manga.single) continue;

			// TODO: fix .trim() error

			const mangaName = manga
				.querySelector(selectors.mangaName)
				.innerText.trim();
			const imgUrl = manga
				.querySelector(selectors.img.selector)
				.getAttribute(selectors.img.attribute)
				.trim();
			const latestChapter = manga
				.querySelector(selectors.latestChapter)
				.innerText.trim();
			const latestUpdate = manga
				.querySelector(selectors.latestUpdate)
				.innerText.trim();
			const detailsPage = manga
				.querySelector(selectors.detailsPage)
				.getAttribute('href');

			// Compare saved details page path with the one we got earlier
			const detailsPageSplit = detailsPage.split('/');
			const urlNameIndex = host.detailsPage.split('/').indexOf('%name%');

			const urlName = detailsPageSplit[urlNameIndex];

			hostData['mangas'].push({
				mangaName,
				imgUrl,
				latestChapter,
				latestUpdate,
				detailsPage,
				urlName,
			});
		}

		data.push(hostData);
	}

	res.status(200).json(data);
});

/*
{
	[
		{
			hostName: String,
			needProxy: Boolean,
			mangas: [
				{
					mangaName: String,
					imgUrl: String,
					latestChapter: String,
					latestUpdate: String,
					// urlName: 
				}
			]
		}
	]
}
*/

export { search };
