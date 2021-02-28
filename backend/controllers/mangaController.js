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
		subscribed,
		sites,
		coverUrl,
	} = req.body;

	const manga = new Manga({
		name,
		urlName,
		chapter,
		lastChapter,
		subscribed,
		sites,
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
		if(err) {
			res.status(500);
			throw new Error('An error occured');
		}
		else {
			res.json(data);
		}
	});
});




// @desc	Delete a manga
// @route	DELETE /api/manga/:urlName
const deleteManga = asyncHandler(async (req, res) => {
	const { urlName } = req.headers;

	const manga = await Manga.findOne({ urlName });

	if(manga) {
		await manga.remove();
		res.json({ message: 'Manga removed from library' });
	}
	else {
		res.status(404);
		throw new Error('Manga not found');
	}
});




// @desc	Get images from a chapter
// @route	GET /api/manga/:urlName/:chapter
const getImageUrls = asyncHandler(async (req, res) => {
	// return res.send(['https://i2.wp.com/disasterscans.com/wp-content/uploads/WP-manga/data/manga_5e42adf14224b/9da11b8733b78861c7b813edd89f8a58/0016.jpg?ssl=1'])
	const { urlName, chapter } = req.params;


	async function handler(err, docs) {
		for(const host of docs) {

			try {
				const url = host['path']
					.replace('%name%', urlName)
					.replace('%chapter%', chapter)

				const raw = await fetch(url);
				const html = await raw.text();

				const document = HTMLParser.parse(html);
				
				
				const images = document.querySelectorAll(host['querySelector']);
				let srcs = [];

				for(const img of images) {
					let src = img.getAttribute('data-src').trim();
					if(host['needProxy']) {
						src = 'http://127.0.0.1:5000/api/image/' + src;
					}

					srcs.push(src);
				}

				res.send(srcs);

				return true;

			} catch(err) {
				continue;
			}
		}
	}


	Manga.findOne({ urlName }, async (err, manga) => {
		if(err) {
			res.sendStatus(404);
			throw new Error("Couldn't find manga : " + urlName);
		}

		for(const host of manga['hosts']) {

			// Check no-proxy sites first
			await Host.find({
				hostName: host['hostName'],
				needProxy: false
			}, async (err, docs) => {
				await handler(err, docs);
			});
		}
		
		// for(const host of manga['hosts']) {
			
		// 	// Then check proxy sites
		// 	await Host.find({
		// 		hostName: host['hostName'],
		// 		needProxy: true
		// 	}, async (err, docs) => {
		// 		await handler(err, docs);
		// 	});
		// }
	});

	
});




// @desc	Update the progress of manga
// @route	POST /api/manga/updateProgress
const updateProgress = asyncHandler(async (req, res) => {
	const { urlName, chapter } = req.body;


	await Manga.findOne({ urlName }, async (err, doc) => {
		if(doc) {
			doc.chapter = chapter;
			const updatedManga = await doc.save();
			res.status(200).send(updatedManga);
		} else {
			res.status(404);
			throw new Error("Couldn't find manga : " + urlName);
		}
	});

});




// @desc	Get a list of all mangas
// @route	GET /api/manga
const getAllMangas = asyncHandler(async (req, res) => {
	const keyword = req.query.keyword
		? {
			name: {
				$regex: req.query.keyword,
				$options: 'i'
			},
		}
	: {};

	const mangas = await Manga.find({ ...keyword });

	res.json(mangas);
});




export {
	getMangaByUrlName,
	createManga,
	deleteManga,
	getImageUrls,
	updateProgress,
	getAllMangas,
}