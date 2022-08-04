import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';

import Manga from '../models/mangaModel.js';
import Host from '../models/hostModel.js';
import User from '../models/userModel.js';

import { updatesCache } from '../functions/mangaHasUpdates.js';
import getChapterNumber from '../functions/getChapterNumber.js';

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

	const mangas = await Manga.find({ ownerId: user._id, ...keyword })
		.limit(limit)
		.skip(skip);

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
		hostName,
		urlName,
		subscribed,
	} = req.body;

	const user = await User.findById(userId);
	if (!user) throw new Error(404);

	const host = await Host.findOne({ hostName });
	if (!host) throw new Error(404);


	const raw = await fetch(host.detailsPage.replace('%name%', urlName));
	const html = await raw.text();
	const document = HTMLParser.parse(html);

	const name = document.querySelector('.post-title h1').textContent.trim();
	const coverEl = document.querySelector('.summary_image a img');
	const coverUrl = coverEl.getAttribute('data-src')
		|| coverEl.getAttribute('data-srcset')
		|| coverEl.getAttribute('src');

	const manga = new Manga({
		name,
		originalName: name,
		urlName: urlName,
		chapter: 'chapter-1',
		subscribed,
		hostId: host._id,
		coverUrl,
		originalCoverUrl: coverUrl,
		ownerId: user._id,
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
		if (key === '_id' || key === 'originalName' || key === 'originalCoverUrl') {
			continue;
		} else if (key === 'isLast') {
			const isLast = !req.body.isLast;
			if (manga.subscribed) updatesCache.put(manga._id, !isLast);
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

// @desc	Get images from a chapter
// @route	GET /mangas/:mangaId/:chapter
export const getImageUrls = asyncHandler(async (req, res) => {
	const { mangaId, chapter } = req.params;

	const manga = await Manga.findById(mangaId);
	if (!manga) {
		res.status(404);
		throw new Error('Manga not found')
	}
	const host = await Host.findById(manga.hostId);

	let url = host.path.replace('%name%', manga.urlName).replace('%chapter%', chapter);

	const raw = await fetch(url);
	const html = await raw.text();
	const document = HTMLParser.parse(html);

	const images = document.querySelectorAll(host.imgSelector.querySelector);
	const srcs = [];

	for (const img of images) {
		// let src = img.getAttribute(host.imgSelector.attrSelector);
		let src = img.getAttribute('data-src') || img.getAttribute('data-setsrc') || img.getAttribute('src');

		if (!src) {
			res.status(507).json({
				message: `Invalid attribute selector for host ${host.hostName}`,
				originalUrl: url,
				hostName: host.hostName,
				hostId: host._id,
			});
			return;
		}

		src = src.trim();

		// if(host.needProxy) {
		// 	src = 'http://127.0.0.1:5000/image/' + src;
		// }

		srcs.push(src);
	}

	if (srcs.length === 0) throw new Error(404);

	const parent = document.querySelector(host.chapterNameSelectors.parent);
	const prevBtn = parent.querySelector(host.chapterNameSelectors.prev);
	const nextBtn = parent.querySelector(host.chapterNameSelectors.next);

	let path = host.path;
	// if(host.path[host.path.length - 1] === '/') host.path = host.path.slice(0, host.path.length - 1);

	const getPrevAndNextLinks = btn => {
		if (!btn) return null;

		const url = btn.getAttribute('href');
		const reg = RegExp(
			path.replace('%name%', manga.urlName).replace('%chapter%', '([a-z0-9:/.-]+)')
		);
		const match = url.match(reg);

		return match[1];
	};

	const prevPath = getPrevAndNextLinks(prevBtn);
	const nextPath = getPrevAndNextLinks(nextBtn);

	const chapterTitle = getChapterNumber(document.querySelector('#chapter-heading').textContent.trim());

	res.json({
		prevPath,
		nextPath,
		originalUrl: url,
		images: srcs,
		chapterTitle,
	});
});
