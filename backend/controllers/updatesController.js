import asyncHandler from 'express-async-handler';

import mangaHasUpdates, { updatesCache } from '../functions/mangaHasUpdates.js';
import Manga from '../models/mangaModel.js';


export const getMangaUpdates = asyncHandler(async (req, res) => {
	const cache = req.query.cache === 'false' ? false : true;
	const rawMangaIds = req.query.mangas.split(',');
	const mangas = await Manga.find({ _id: { $in: rawMangaIds } });

	const updates = {};

	for (let i = 0; i < mangas.length; i++) {
		const manga = mangas[i];

		if (!manga) {
			updates[rawMangaIds[i]] = null;
			continue;
		}

		const hasUpdates = await mangaHasUpdates(manga, cache);
		updates[manga._id] = hasUpdates;
	}

	res.json(updates);
});

// @desc	Update the chapter the user is currently on
// @route	POST /mangas/:mangaId/updateProgress
export const updateProgress = asyncHandler(async (req, res) => {
	const { mangaId } = req.params;
	const { chapter, isLast } = req.body;

	if (!(mangaId && chapter && isLast !== undefined)) throw new Error(400);

	const manga = await Manga.findById(mangaId);

	if (manga.subscribed) updatesCache.put(manga._id, !isLast);
	manga.chapter = chapter;
	await manga.save();

	res.status(200).send({ chapter });
});
