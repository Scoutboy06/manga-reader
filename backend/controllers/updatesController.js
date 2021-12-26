import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';

import Performance from '../performance.js';

import Manga from '../models/mangaModel.js';
import Host from '../models/hostModel.js';

let updatesCache = {};
const cacheKeepTime = 1000 * 60 * 60; // 60 minutes
let lastCached = null;

const stats = new Performance();

const getSubscribedUpdates = asyncHandler(async (req, res) => {
	stats.start();

	const cache = req.query.cache === 'false' ? false : true;
	const subscribed = await Manga.find({ subscribed: true });
	stats.step('Find subscribed mangas');

	if (!(subscribed.length > 0))
		return res.status(404).send('No subscribed mangas');
	if (lastCached && Date.now() - lastCached > cacheKeepTime) updatesCache = {};
	if (cache && Object.keys(updatesCache).length > 0)
		return res.json(updatesCache);

	const updates = {};

	for (const manga of subscribed) {
		stats.group(manga.host.hostName + ' - ' + manga.name);
		const hasUpdates = await mangaHasUpdates(manga, cache);
		updates[manga._id] = hasUpdates;
	}

	stats.solo();

	lastCached = Date.now();
	updatesCache = updates;

	res.json([updates, stats.data]);

	stats.end();
});

async function mangaHasUpdates(manga, cache) {
	if (!manga) return null;

	const host = await Host.findOne({ hostName: manga.host.hostName });
	stats.step('--- Find host');

	const url = encodeURI(
		host.path
			.replace('%name%', manga.urlName)
			.replace('%chapter%', manga.chapter)
	);

	const raw = await fetch(url);
	stats.step('--- Fetch raw');
	const html = await raw.text();
	stats.step('--- Parse response');
	const document = HTMLParser.parse(html);
	stats.step('--- Parse HTML');

	const nextBtn = document.querySelector(host.chapterNameSelectors.next);

	const hasUpdates = !!nextBtn;
	if (cache) updatesCache[manga._id] = hasUpdates;

	return hasUpdates;
}

const updateProgress = asyncHandler(async (req, res, next) => {
	const { urlName, chapter, isLast } = req.body;

	const manga = await Manga.findOne({ urlName });

	if (!manga) return next();

	updatesCache[manga._id] = !isLast;

	manga.chapter = chapter;
	await manga.save();

	res.status(200).send(chapter);
});

export { getSubscribedUpdates, updateProgress };
