import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';

import Manga from '../models/mangaModel.js';
import Host from '../models/hostModel.js';
import User from '../models/userModel.js';

// @desc	Create a new manga
// @route	POST /api/mangas?userId=...
export const createManga = asyncHandler(async (req, res) => {
	const { userId } = req.query;

	const user = await User.findById(userId);
	if (!user) throw new Error(404);

	const {
		name,
		urlName,
		chapter,
		subscribed,
		host,
		coverUrl,
	} = req.body;

	const manga = new Manga({
		name,
		urlName,
		chapter,
		subscribed,
		host,
		coverUrl,
		ownerId: userId,
	});

	const createdManga = await manga.save();

	user.mangas.push(createdManga._id);
	await user.save();

	res.status(201).json(createdManga);
});

// @desc	Delete a manga
// @route	DELETE /api/mangas/:_id
export const deleteManga = asyncHandler(async (req, res) => {
	const manga = await Manga.findById(req.params._id);
	if (!manga) throw new Error(404);

	const user = await User.findById(manga.ownerId);
	if (!user) throw new Error(500);

	user.mangas.splice(user.mangas.indexOf(manga._id), 1);

	await user.save();
	await manga.remove();
	res.json({ message: 'Manga removed from library' });
});

// @desc	Get info about a manga
// @route	GET /api/mangas/:urlName
export const getMangaByUrlName = asyncHandler(async (req, res) => {
	const { urlName } = req.params;

	const manga = await Manga.findOne({ urlName });
	if (!manga) throw new Error(404);

	res.status(200).json(manga);
});

// @desc	Get images from a chapter
// @route	GET /api/mangas/:urlName/:chapter
export const getImageUrls = asyncHandler(async (req, res) => {
	const { urlName, chapter } = req.params;

	const manga = await Manga.findOne({ urlName });

	const host = await Host.findById(manga.hostId);

	let url = host.path.replace('%name%', urlName).replace('%chapter%', chapter);

	const raw = await fetch(url);
	const html = await raw.text();

	const document = HTMLParser.parse(html);

	const images = document.querySelectorAll(host.imgSelector.querySelector);
	let srcs = [];

	for (const img of images) {
		// let src = img.getAttribute(host.imgSelector.attrSelector).trim();
		let src = img.getAttribute(host.imgSelector.attrSelector);

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

	const data = {
		prevPath,
		nextPath,
		originalUrl: url,
		images: srcs,
	};

	res.json(data);
});
