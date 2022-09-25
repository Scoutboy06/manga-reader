import asyncHandler from 'express-async-handler';

import Manga from '../models/mangaModel.js';



// @desc	Update the chapter the user is currently on
// @route	POST /mangas/:mangaId/updateProgress
export const updateProgress = asyncHandler(async (req, res) => {
	const { mangaId } = req.params;
	const { chapter: currentChapter, isLast } = req.body;

	if (!(mangaId && currentChapter && isLast !== undefined)) {
		res.status(400);
		throw new Error('Invalid data');
	}

	const manga = await Manga.findById(mangaId);

	manga.currentChapter = currentChapter;
	await manga.save();

	res.status(200).json({ currentChapter });
});
