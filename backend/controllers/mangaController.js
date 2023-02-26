import { Router } from 'express';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import handler from 'express-async-handler';

import Manga from '../models/mangaModel.js';
import Host from '../models/hostModel.js';
import User from '../models/userModel.js';

import getMangaMeta from '../functions/manga/getMetadata.js';
import isAdmin from '../middleware/isAdmin.js';
import parseUrlName from '../functions/parseUrlName.js';

const router = Router();


// @desc	Get all of the user's mangas
// @route	GET /users/:userId/mangas
router.get('/users/:userId/mangas', async (req, res) => {
	const { userId } = req.params;

	const user = await User.findById(userId);
	if (!user) return res.status(404).json({ error: 'No user found' });

	res.json(user.mangas);
});


router.get('/mangas', handler(async (req, res) => {
	const { limit = 50, skip = 0, query = '' } = req.query;

	const mangas = await Manga.find({
		isVerified: true,
		$or: [
			{
				title: {
					$regex: query,
					$options: 'i',
				}
			},
			{
				otherNames: {
					$regex: query,
					$options: 'i',
				}
			}
		]
	}, {
		chapters: 0,
	}).limit(limit).skip(skip);

	res.json(mangas);
}));


// @desc	Get metadata from an external source
router.get('/mangas/external', handler(async (req, res) => {
	const { url } = req.query;
	const parsedUrl = new URL(url);
	const urlName = parsedUrl.pathname.split('/')[2];

	const host = await Host.findOne({ name: parsedUrl.host });
	const manga = await getMangaMeta({ urlName, host });

	res.json({
		...manga,
		sourceUrlName: urlName,
		urlName: parseUrlName(manga.title),
		hostId: host._id,
		airStatus: manga.airStatus,
	});
}));


// @desc	Get a manga by id
// @route	GET /mangas/:mangaId
router.get('/mangas/:mangaId', handler(async (req, res) => {
	const { mangaId } = req.params;

	const manga = await Manga.findById(mangaId);
	if (!manga) {
		res.status(404)
		throw new Error('Manga not found');
	}

	res.json(manga);
}));


// @desc	Get a manga by name
// @route	GET /users/:userId/mangas/:mangaName
router.get('/users/:userId/mangas/:mangaName', handler(async (req, res) => {
	const { userId, mangaName } = req.params;

	const manga = await Manga.findOne({ ownerId: userId, urlName: mangaName });

	res.json(manga);
}));


// @desc	Create a new manga
// @route	POST /mangas
router.post('/mangas', handler(async (req, res) => {
	const { title, hostId, sourceUrlName } = req.body;

	const host = await Host.findById(hostId);
	const { chapters } = await getMangaMeta({ urlName: sourceUrlName, host });

	const urlName = parseUrlName(title);

	const manga = new Manga({
		isVerified: req.body.isVerified || true,
		title: req.body.title,
		description: req.body.description,
		urlName,
		sourceUrlName: req.body.sourceUrlName,
		hostId,
		airStatus: req.body.airStatus,
		// ownerId: req.body.userId,
		chapters,
		otherNames: req.body.otherNames,
		authors: req.body.authors,
		artists: req.body.artists,
		genres: req.body.genres,
		released: req.body.released,
		poster: req.body.poster,
	});

	const createdManga = await manga.save();

	res.status(201).json(createdManga);
}));

// @desc	Update the current chapter
// @route	POST /mangas/:mangaId/currentChapter
router.post('/users/:userId/mangas/:mangaId/currentChapter', async (req, res, next) => {
	const { userId, mangaId } = req.params;
	const { urlName: chapterUrlName } = req.body;

	const user = await User.findById(userId).catch(err => {
		res.status(404);
		next(err);
	});
	if (!user) return;

	const manga = await Manga.findById(mangaId).catch(err => {
		res.status(404);
		next(err);
	});
	if (!manga) return;

	const userManga = user.mangas.find(manga => manga._id.toString() === mangaId);
	if (!userManga) {
		res.status(403);
		return next(new Error('This manga is not in the user\'s library'));
	}

	// Update the current chapter
	const currentChapter = manga.chapters.find(chapter => chapter.urlName === chapterUrlName);
	userManga.currentChapter = currentChapter;

	await user.save().catch(err => {
		res.status(400);
		next(err);
	});

	res.json({ status: 'success' });
});

// @desc	Get images from a chapter
// @route	GET /mangas/:mangaId/:chapter
router.get('/mangas/:mangaId/:chapter', async (req, res, next) => {
	const { mangaId, chapter } = req.params;

	const manga = await Manga.findById(mangaId).catch(() => {
		res.status(404);
		next(new Error('Manga not found'));
	});
	if (!manga) return;

	const currentChapter = manga.chapters.find(ch => ch.urlName === chapter);

	const host = await Host.findById(manga.hostId);
	const url = host.chapterPage.url.replace('%name', manga.sourceUrlName).replace('%chapter', currentChapter.sourceUrlName);

	const html = await fetch(url).then(res => res.text());
	const document = parse(html);

	const imageEls = document.querySelectorAll(host.chapterPage.images);
	const srcs = [];

	for (const img of imageEls) {
		let src = img.getAttribute('data-src') ||
			img.getAttribute('data-setsrc') ||
			img.getAttribute('src');

		src = src.trim();
		srcs.push(src);
	}

	if (srcs.length === 0) {
		res.status(404);
		return next(new Error('No images found'));
	}

	res.json({
		title: currentChapter.title,
		number: currentChapter.number,
		images: srcs,
		originalUrl: url,
	});
});


export default router;