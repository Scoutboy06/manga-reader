import { Router } from 'express';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

import Manga from '../models/mangaModel.js';
import Host from '../models/hostModel.js';
import User from '../models/userModel.js';

import getMangaMeta from '../functions/manga/getMetadata.js';

const router = Router();


// @desc	Get all of the user's mangas, with search functionality
// @route	GET /users/:userId/mangas
router.get('/users/:userId/mangas', async (req, res) => {
	const { userId } = req.params;

	const user = await User.findById(userId);
	if (!user) return res.status(404).json({ error: 'No user found' });

	res.json(user.mangas);
});


// @desc	Get a manga by id
// @route	GET /mangas/:mangaId
router.get('/mangas/:mangaId', async (req, res) => {
	const { mangaId } = req.params;

	const manga = await Manga.findById(mangaId);
	if (!manga) return res.status(404).json({ error: 'Not found' });

	res.json(manga);
});


// @desc	Get a manga by name
// @route	GET /users/:userId/mangas/:mangaName
router.get('/users/:userId/mangas/:mangaName', async (req, res) => {
	const { userId, mangaName } = req.params;

	const manga = await Manga.findOne({ ownerId: userId, urlName: mangaName });
	if (!manga) {
		res.status(404);
		throw new Error('No manga found');
	}

	res.json(manga);
});


// @desc	Create a new manga
// @route	POST /users/:userId/mangas
router.post('/users/:userId/mangas', async (req, res) => {
	const { userId } = req.params;

	const {
		hostName,
		urlName: sourceUrlName,
	} = req.body;

	const user = await User.findById(userId);
	if (!user) {
		res.status(401);
		throw new Error('Invalid user id');
	}

	const host = await Host.findOne({ name: hostName });
	if (!host) {
		res.status(401);
		throw new Error('No host found');
	}

	const meta = await getMangaMeta({ urlName: sourceUrlName, host });
	const urlName = encodeURI(meta.title.toLowerCase().replaceAll(/[^ a-z0-9-._~:\[\]@!$'()*+,;%=]/g, '').replaceAll(/[ ]+/g, '-'));

	const manga = new Manga({
		ownerId: userId,
		hostId: host._id,
		urlName,
		sourceUrlName,

		title: meta.title,
		description: meta.description,

		chapters: meta.chapters,
		currentChapter: meta.chapters[0].urlName,

		otherNames: meta.otherNames,
		authors: meta.authors,
		artists: meta.artists,
		genres: meta.genres,
		released: meta.released,
		status: meta.status || 'ongoing',

		poster: meta.poster,
	});

	const createdManga = await manga.save();
	res.status(201).json(createdManga);
});

// @desc	Update manga
// @route	PATCH /mangas/:mangaId
router.patch('/mangas/:mangaId', async (req, res) => {
	const { mangaId } = req.params;

	const manga = await Manga.findById(mangaId);
	if (!manga) {
		res.status(404);
		throw new Error('Manga not found');
	}

	for (const key of Object.keys(req.body)) {
		if (key === '_id' || key === 'isLast') {
			continue;
		}

		manga[key] = req.body[key];
	}

	await manga.save();
	res.status(201).json(manga);
});

// @desc	Delete a manga
// @route	DELETE /mangas/:mangaId
router.delete('/mangas/:mangaId', async (req, res) => {
	const { mangaId } = req.params;

	const manga = await Manga.findById(mangaId);
	if (!manga) res.status(404).json({ error: 'Not found' });

	await manga.remove();
	res.json({ message: `Manga '${manga.name}' was removed from library` });
});

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

	// Remove the chapter's entry in 'user.manga.$.newChapters[]'
	const chapterInNewChaptersIndex = userManga.newChapters.findIndex(chapter => chapter.urlName === chapterUrlName);
	if (chapterInNewChaptersIndex !== -1) {
		userManga.newChapters.splice(chapterInNewChaptersIndex, 1);
	}

	userManga.hasNewChapters = (userManga.newChapters.length > 0);

	const savedManga = await userManga.save().catch(err => {
		res.status(400);
		next(err);
	});
	if (savedManga) res.json(savedManga);
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