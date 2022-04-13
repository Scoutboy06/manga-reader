import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';

import Manga from '../models/mangaModel.js';
import Host from '../models/hostModel.js';
import User from '../models/userModel.js';

import chapterNameToChapter from '../functions/chapterNameToChapter.js';

// @desc	Create a new manga
// @route	POST /api/mangas
export const createManga = asyncHandler(async (req, res) => {
	const {
		hostName,
		mangaUrlName,
		subscribed,
		userId,
	} = req.body;

	const user = await User.findById(userId);
	if (!user) throw new Error(404);

	const host = await Host.findOne({ hostName });
	if (!host) throw new Error(404);

	const raw = await fetch(host.detailsPage.replace('%name%', mangaUrlName));
	const html = await raw.text();
	const document = HTMLParser.parse(html);

	const name = document.querySelector('.post-title h1').textContent;
	const coverEl = document.querySelector('.summary_image a img');
	const coverUrl = coverEl.getAttribute('data-src')
		|| coverEl.getAttribute('data-srcset')
		|| coverEl.getAttribute('src');

	const manga = new Manga({
		name,
		urlName: mangaUrlName,
		chapter: 'chapter-1',
		subscribed,
		hostId: host._id,
		coverUrl,
		ownerId: user._id,
	});

	const createdManga = await manga.save();

	res.status(201).json(createdManga);
});

// @desc	Delete a manga
// @route	DELETE /api/mangas/:_id
export const deleteManga = asyncHandler(async (req, res) => {
	const manga = await Manga.findById(req.params._id);
	if (!manga) throw new Error(404);

	await manga.remove();
	res.json({ message: 'Manga removed from library' });
});

// @desc	Update if the manga is finished (reading) or not
// @route PUT /api/mangas/:_id/finished
export const updateFinished = asyncHandler(async (req, res) => {
	const { isFinished } = req.body;
	if (isFinished === undefined) throw new Error(400);

	const manga = await Manga.findById(req.params._id);
	if (!manga) throw new Error(404);

	manga.finished = isFinished;
	if (!isFinished) manga.subscribed = false;
	await manga.save();

	res.status(200).json({ _id: manga._id, isFinished });
});

// @desc	Get info about a manga
// @route	GET /api/mangas/:urlName?userId=...
export const getMangaByUrlName = asyncHandler(async (req, res) => {
	const { urlName } = req.params;
	const { userId } = req.query;

	const manga = await Manga.findOne({ urlName, ownerId: userId });
	if (!manga) throw new Error(404);

	res.status(200).json(manga);
});

// @desc	Get images from a chapter
// @route	GET /api/mangas/:urlName/:chapter
export const getImageUrls = asyncHandler(async (req, res) => {
	const { urlName, chapter } = req.params;

	const manga = await Manga.findOne({ urlName });
	if (!manga) throw new Error(404);
	const host = await Host.findById(manga.hostId);
	if (!host) throw new Error(404);

	let url = host.path.replace('%name%', urlName).replace('%chapter%', chapter);

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
		// 	src = 'http://127.0.0.1:5000/api/image/' + src;
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
			path.replace('%name%', urlName).replace('%chapter%', '([a-z0-9:/.-]+)')
		);
		const match = url.match(reg);

		return match[1];
	};

	const prevPath = getPrevAndNextLinks(prevBtn);
	const nextPath = getPrevAndNextLinks(nextBtn);

	const chapterTitle = chapterNameToChapter(document.querySelector('#chapter-heading').textContent.trim());

	res.json({
		prevPath,
		nextPath,
		originalUrl: url,
		images: srcs,
		chapterTitle,
	});
});
