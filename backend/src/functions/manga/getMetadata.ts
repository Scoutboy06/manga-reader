import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';

import { IManga } from '../../models/mangaModel.js';

interface Entries {
	title: string;
	description: string;
	otherNames: string;
	authors?: string;
	artists?: string;
	genres?: string;
	released?: string;
	airStatus: string;
}

export default async function getMangaMeta({ urlName, host }) {
	const { detailsPage } = host;

	const html = await fetch(detailsPage.url.replace('%name', urlName), {
		redirect: 'follow',
	}).then(res => res.text());
	const document = HTMLParser.parse(html);

	const entries = [
		'title',
		'description',
		'otherNames',
		'authors',
		'artists',
		'genres',
		'released',
		'airStatus',
	];
	const mangaMeta = {} as Entries;
	for (const entry of entries) {
		if (!detailsPage[entry]) continue;

		mangaMeta[entry] = document
			.querySelector(detailsPage[entry])
			?.textContent?.trim();
	}

	const posterEl = document.querySelector(detailsPage.poster);
	const poster =
		posterEl?.getAttribute('data-src') ||
		posterEl?.getAttribute('data-srcset') ||
		posterEl?.getAttribute('srcset') ||
		posterEl?.getAttribute('src');

	const chapters = [];
	const chapterEls = document.querySelectorAll(detailsPage.chapters);

	for (const chapterEl of [...chapterEls].reverse()) {
		const titleEl = chapterEl.querySelector('a');
		const title = titleEl?.textContent?.trim();

		// Some sites have a bug where ghost chapters exist
		// This removes ghost chapters
		if (!title) continue;

		const sourceUrl = (function () {
			const split = titleEl.getAttribute('href').split('/');
			return split[split.length - 2];
		})();

		const chapterNumber = title.match(/chapter (\d+\.?\d*)/i)?.[1];
		if (!chapterNumber) return;

		chapters.push({
			title,
			number: Number(chapterNumber),
			urlName: `chapter-${chapterNumber}`,
			sourceUrlName: sourceUrl,
		});
	}

	return {
		...mangaMeta,
		airStatus: mangaMeta.airStatus?.toLowerCase(),
		chapters,
		poster,
	} as IManga;
}
