import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';

import Single from '../models/singleModel.js';

// @desc	Create a new single
// @route	POST /api/single
const createSingle = asyncHandler(async (req, res) => {
	const {
		name,
		urlName,
		chapter,
		path,
		imgSelector,
		chapterNameSelectors,
		needProxy,
		coverUrl,
	} = req.body;

	const single = new Single({
		name,
		urlName,
		chapter,
		path,
		imgSelector,
		chapterNameSelectors,
		needProxy,
		coverUrl,
	});

	const createdSingle = await single.save();
	res.status(201).json(createdSingle);
});

// @desc	Get info about a single
// @route	GET /api/single/:urlName
const getSingleByUrlName = asyncHandler(async (req, res) => {
	const { urlName } = req.headers;

	Single.findOne({ urlName }, (err, data) => {
		if (err) {
			res.status(500);
			throw new Error('An error occured');
		} else {
			res.json(data);
		}
	});
});

// @desc	Delete a single
// @route	DELETE /api/single/:urlName
const deleteSingle = asyncHandler(async (req, res) => {
	const { urlName } = req.headers;

	const single = await Single.findOne({ urlName });

	if (single) {
		await single.remove();
		res.json({ message: 'Single removed from library' });
	} else {
		res.status(404);
		throw new Error('Single not found');
	}
});

const getImageUrls = asyncHandler(async (req, res) => {
	const { urlName, chapter } = req.params;

	const single = await Single.findOne({ urlName });

	if (!single) {
		res.sendStatus(404);
		throw new Error("Couldn't find manga : " + urlName);
	}

	const url = single.path
		.replace('%name%', urlName)
		.replace('%chapter%', chapter);

	const raw = await fetch(url);
	const html = await raw.text();

	const document = HTMLParser.parse(html);

	const images = document.querySelectorAll(single.imgSelector.querySelector);
	const srcs = [];

	for (const img of images) {
		let src = img.getAttribute(single.imgSelector.attrSelector);

		if (!src) {
			res.status(507).json({
				message: `Invalid attribute selector for single ${single.name}`,
				originalUrl: url,
				urlName,
				_id: single._id,
			});
			return;
		}

		src = src.trim();

		// if(single.needProxy) {
		// 	src = 'http://127.0.0.1:5000/api/image/' + src;
		// }

		srcs.push(src);
	}

	const parent = document.querySelector(single.chapterNameSelectors.parent);
	const prevBtn = parent.querySelector(single.chapterNameSelectors.prev);
	const nextBtn = parent.querySelector(single.chapterNameSelectors.next);

	let path = single.path;
	// if(path[path.length - 1] === '/') path = path.slice(0, path.length - 1);
	console.log(path);

	const getPrevAndNextLinks = btn => {
		if (!btn) return null;

		const url = btn.getAttribute('href');
		const reg = RegExp(
			path.replace('%name%', urlName).replace('%chapter%', '([a-z0-9:/.-]+)')
		);
		console.log(reg);

		const match = url.match(reg);
		console.log(match);

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

// @desc	Update the progress of single
// @route	POST /api/single/updateProgress
const updateProgress = asyncHandler(async (req, res) => {
	const { urlName, chapter } = req.body;

	const single = await Single.findOne({ urlName });

	if (!single) {
		res.status(404).send('No manga found');
	}

	single.chapter = chapter;
	await single.save();

	res.status(200).send(chapter);
});

// @desc	Get a list of all singles
// @route	GET /api/single
const getAllSingles = asyncHandler(async (req, res) => {
	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: 'i',
				},
		  }
		: {};

	const singles = await Single.find({ ...keyword });

	res.json(singles);
});

export {
	createSingle,
	getSingleByUrlName,
	deleteSingle,
	getImageUrls,
	updateProgress,
	getAllSingles,
};
