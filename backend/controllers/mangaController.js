import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';

import Manga from '../models/mangaModel.js';
import Host from '../models/hostModel.js';
import User from '../models/userModel.js';

import getChapterNumber from '../functions/getChapterNumber.js';
import getMangaMeta from '../functions/manga/getMetadata.js';

// @desc	Get all of the user's mangas, with search functionality
// @route	GET /users/:userId/mangas
export const getUserMangas = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	const { limit = Infinity, skip = 0, query = '' } = req.query;

	const keyword = query
		? {
			urlName: {
				$regex: query,
				$options: 'i',
			},
		} : {};

	const user = await User.findById(userId);
	if (!user) return res.status(404).json({ error: 'No user found' });

	let mangas = await Manga.find({ ownerId: user._id, ...keyword })
		.limit(limit)
		.skip(skip);


	for (let manga of mangas) {
		manga.chapters = undefined;
	}

	res.json(mangas);
});

// @desc	Get a manga by id
// @route	GET /mangas/:mangaId
export const getMangaById = asyncHandler(async (req, res) => {
	const { mangaId } = req.params;
	const manga = await Manga.findById(mangaId);
	if (!manga) return res.status(404).json({ error: 'Not found' });
	res.json(manga);
});

// @desc	Get a manga by name
// @route	GET /users/:userId/mangas/:mangaName
export const getMangaByName = asyncHandler(async (req, res) => {
	const { userId, mangaName } = req.params;

	// const user = await User.findById(userId);
	// if (!user) return res.status(404).json({ error: 'User not found' });

	const manga = Manga.findOne({ ownerId: userId, urlName: mangaName });
	if (!manga) return res.status(404).json({ error: 'Manga not found' });

	res.json(manga);
});

// @desc	Create a new manga
// @route	POST /users/:userId/mangas
export const createManga = asyncHandler(async (req, res) => {
	const { userId } = req.params;

	const {
		hostId,
		urlName,
		sourceUrlName,
		title,
		poster,
	} = req.body;

	const user = await User.findById(userId);
	if (!user) {
		res.status(401);
		throw new Error('Invalid user id');
	}

	const meta = await getMangaMeta(sourceUrlName, hostId);

	const manga = new Manga({
		ownerId: userId,
		hostId,
		urlName,
		sourceUrlName,

		title,
		description: meta.description,

		chapters: meta.chapters,
		currentChapter: meta.chapters[0].urlName,

		otherNames: meta.otherNames,
		authors: meta.authors,
		artists: meta.artists,
		genres: meta.genres,
		released: meta.released,
		status: meta.status,

		poster,
	});

	const createdManga = await manga.save();
	res.status(201).json(createdManga);
});

// @desc	Update manga
// @route	PATCH /mangas/:mangaId
export const updateManga = asyncHandler(async (req, res) => {
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
export const deleteManga = asyncHandler(async (req, res) => {
	const { mangaId } = req.params;

	const manga = await Manga.findById(mangaId);
	if (!manga) res.status(404).json({ error: 'Not found' });

	await manga.remove();
	res.json({ message: `Manga ${manga.name} was removed from library` });
});

// @desc	Update the current chapter
// @route	PATCH /mangas/:mangaId/currentChapter
export const updateCurrentChapter = asyncHandler(async (req, res) => {
	const { mangaId } = req.params;
	const { currentChapter } = req.body;

	const manga = await Manga.findById(mangaId);
	if (!manga) {
		res.status(404);
		throw new Error('No manga found');
	}

	manga.currentChapter = currentChapter;
	if (manga.hasUpdates && manga.chapters[manga.chapters.length - 1].urlName === currentChapter) {
		manga.hasUpdates = false;
	}

	await manga.save();
	res.json({});
})

// @desc	Get images from a chapter
// @route	GET /mangas/:mangaId/:chapter
export const getImageUrls = asyncHandler(async (req, res) => {
	const { mangaId, chapter } = req.params;

	const manga = await Manga.findById(mangaId);
	if (!manga) {
		res.status(404);
		throw new Error('Manga not found');
	}

	const currentChapter = manga.chapters.find(ch => ch.urlName === chapter);

	const host = await Host.findById(manga.hostId);
	const url = host.chapterPage.url.replace('%name', manga.sourceUrlName).replace('%chapter', currentChapter.sourceUrlName);

	const html = await fetch(url).then(res => res.text());
	const document = HTMLParser.parse(html);

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
		throw new Error('No images found');
	}

	// {
	// 	"title": "Chapter 1",
	// 	"number": 1,
	// 	"urlName": "chapter-1",
	// 	"sourceUrlName": "chapter-1"
	// },

	res.json({
		title: currentChapter.title,
		number: currentChapter.number,
		images: srcs,
		originalUrl: url,
	});
});
