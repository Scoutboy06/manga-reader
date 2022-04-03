import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';
import mcache from 'memory-cache';

import Manga from '../models/mangaModel.js';
import Host from '../models/hostModel.js';

const updatesCache = new mcache.Cache();


export const getMangaUpdates = asyncHandler(async (req, res) => {
	const cache = req.query.cache === 'false' ? false : true;
	const rawMangaIds = req.query.mangas.split(',');
	const mangas = await Manga.find({ _id: { $in: rawMangaIds } });

	const updates = {};

	for (let mangaIndex = 0; mangaIndex < mangas.length; mangaIndex++) {
		const manga = mangas[mangaIndex];

		if (!manga) {
			updates[rawMangaIds[mangaIndex]] = null;
			continue;
		}

		if (cache) {
			const cachedValue = updatesCache.get(manga._id);
			if (cachedValue !== null) {
				updates[manga._id] = cachedValue;
				continue;
			}
		}


		const hasUpdates = await mangaHasUpdates(manga, cache);
		updatesCache.put(manga._id, hasUpdates, 1000 * 60 * 60);
		updates[manga._id] = hasUpdates;
	}

	res.json(updates);
});

async function mangaHasUpdates(manga, cache) {
	const host = await Host.findById(manga.hostId);

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

export const updateProgress = asyncHandler(async (req, res, next) => {
	const { urlName, chapter, isLast } = req.body;

	const manga = await Manga.findOne({ urlName });
	if (!manga) return next();

	if (manga.subscribed) updatesCache.put(manga._id, !isLast);
	manga.chapter = chapter;

	await manga.save();
	res.status(200).send(chapter);
});
