import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';

import Manga from '../models/mangaModel.js';
import Host from '../models/hostModel.js';




const getSubscribedUpdates = asyncHandler(async (req, res) => {
	const subscribed = await Manga.find({ subscribed: true });

	if(!subscribed.length > 0) {
		return res.status(404).send('No subscribed mangas');
	}

	const checkUpdates = subscribed.map(mangaHasUpdates);
	const hasUpdates = await Promise.all(checkUpdates);
	const filtered = hasUpdates.filter(manga => manga !== null);

	res.send(filtered);
});




async function mangaHasUpdates(manga) {
	if(!manga) return null;

	const host = await Host.findOne({ hostName: manga.host.hostName });

	const url = encodeURI(
		host.path
			.replace('%name%', manga.urlName)
			.replace('%chapter%', manga.chapter)
	);
	
	const raw = await fetch(url);
	const html = await raw.text();
	const document = HTMLParser.parse(html);

	const nextBtn = document.querySelector(host.chapterNameSelectors.next);

	return nextBtn ? manga._id : null;
}




export {
	getSubscribedUpdates,
}