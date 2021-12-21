import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';

import Manga from '../models/mangaModel.js';
import Host from '../models/hostModel.js';

// @desc	Create a new manga
// @route	POST /api/manga
const createManga = asyncHandler(async (req, res) => {
	const {
		name,
		urlName,
		chapter,
		lastChapter,
		subscribed = false,
		host,
		coverUrl,
	} = req.body;

	const manga = new Manga({
		name,
		urlName,
		chapter,
		lastChapter,
		subscribed,
		host,
		coverUrl,
	});

	const createdManga = await manga.save();
	res.status(201).json(createdManga);
});

// @desc	Get info about a manga
// @route	GET /api/manga/:urlName
const getMangaByUrlName = asyncHandler(async (req, res) => {
	const { urlName } = req.params;

	Manga.findOne({ urlName }, (err, data) => {
		if (err) {
			res.status(500);
			throw new Error('An error occured');
		} else {
			res.json(data);
		}
	});
});

// @desc	Delete a manga
// @route	DELETE /api/manga/:urlName
const deleteManga = asyncHandler(async (req, res) => {
	const { urlName } = req.headers;

	const manga = await Manga.findOne({ urlName });

	if (manga) {
		await manga.remove();
		res.json({ message: 'Manga removed from library' });
	} else {
		res.status(404);
		throw new Error('Manga not found');
	}
});

// @desc	Get images from a chapter
// @route	GET /api/manga/:urlName/:chapter
const getImageUrls = asyncHandler(async (req, res, next) => {
	const { urlName, chapter } = req.params;

	const manga = await Manga.findOne({ urlName });
	if (!manga) {
		next();
		return;
	}

	const host = await Host.findOne({
		hostName: manga.host.hostName,
	});

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

	res.send(data);
});

// @desc	Get a list of all mangas
// @route	GET /api/manga
const getAllMangas = asyncHandler(async (req, res) => {
	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: 'i',
				},
		  }
		: {};

	const mangas = await Manga.find({ ...keyword });

	res.json(mangas);
});

const updateAttributeSelector = asyncHandler(async (req, res) => {
	const { hostId, newSelector } = req.body;

	const host = await Host.findById(hostId);
	host.imgSelector.attrSelector = newSelector;
	const savedHost = await host.save();

	res.status(200).json(savedHost);
});

export {
	getMangaByUrlName,
	createManga,
	deleteManga,
	getImageUrls,
	getAllMangas,
	updateAttributeSelector,
};
