import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';
import mcache from 'memory-cache';

import Host from '../models/hostModel.js';

export const updatesCache = new mcache.Cache();

export default async function mangaHasUpdates(manga, cache) {
	if (cache) {
		const cachedValue = updatesCache.get(manga._id);
		if (cachedValue !== null) {
			return cachedValue;
		}
	}

	const host = await Host.findById(manga.hostId);

	const url = encodeURI(
		host.path
			.replace('%name%', manga.urlName)
			.replace('%chapter%', manga.currentChapter)
	);

	const raw = await fetch(url);
	const html = await raw.text();
	const document = HTMLParser.parse(html);

	const nextBtn = document.querySelector(host.chapterNameSelectors.next);

	const hasUpdates = !!nextBtn;
	updatesCache.put(manga._id, hasUpdates, 1000 * 60 * 60);

	return hasUpdates;
}