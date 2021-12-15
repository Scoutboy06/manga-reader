import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';

import Manga from '../models/mangaModel.js';
import Host from '../models/hostModel.js';

const getSubscribedUpdates = asyncHandler(async (req, res) => {
	const cache = req.query.cache === 'false' ? false : true;

	const subscribed = await Manga.find({ subscribed: true });

	if (!(subscribed.length > 0)) {
		return res.status(404).send('No subscribed mangas');
	}

	if (lastCached && Date.now() - lastCached > cacheKeepTime) updatesCache = {};

	if (cache && Object.keys(updatesCache).length > 0)
		return res.json(updatesCache);

	const updates = {};

	if (cache) lastCached = Date.now();

	for (const manga of subscribed) {
		const hasUpdates = await mangaHasUpdates(manga, cache);
		updates[manga._id] = hasUpdates;
	}

	res.json(updates);
});

let updatesCache = {};
const cacheKeepTime = 1000 * 60 * 20; // 20 minutes
let lastCached = null;

async function mangaHasUpdates(manga, cache) {
	if (!manga) return null;

	const host = await Host.findOne({ hostName: manga.host.hostName });

	const url = encodeURI(
		host.path
			.replace('%name%', manga.urlName)
			.replace('%chapter%', manga.chapter)
	);

	const raw = await fetch(url);
	const html = await raw.text();
	const document = HTMLParser.parse(html);

	const nextBtn = document.querySelector(host.chapterNameSelectors.next);

	const hasUpdates = !!nextBtn;
	if (cache) updatesCache[manga._id] = hasUpdates;

	return hasUpdates;
}

export { getSubscribedUpdates };
