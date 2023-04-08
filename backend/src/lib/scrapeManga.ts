import IHost from '@/types/Host.js';
import IManga from '@/types/Manga.js';
import { parse, HTMLElement } from 'node-html-parser';
import matchValueWithSchema from './matchValueWithSchema.js';
import getChapterNumber from './getChapterNumber.js';

export default async function scrapeManga(
	urlName: string,
	host: IHost,
	fieldsAreRequired: boolean
) {
	const url = host.detailsPage.url.replace('%name', urlName);

	const html = await fetch(url, { redirect: 'follow' }).then(res => res.text());
	const document = parse(html);

	const { detailsPage } = host;

	const title = getText(document, detailsPage.title, fieldsAreRequired);
	const description = getText(
		document,
		detailsPage.description,
		fieldsAreRequired
	);
	const otherNames = getText(document, detailsPage.otherNames, false);
	const authors = getText(document, detailsPage.authors, false);
	const artists = getText(document, detailsPage.artists, false);
	const genres = getText(document, detailsPage.genres, fieldsAreRequired);
	const released = getText(document, detailsPage.released, fieldsAreRequired);

	const airStatus = getText(
		document,
		detailsPage.airStatus,
		fieldsAreRequired
	)?.toLowerCase();

	if (airStatus !== 'ongoing' && airStatus !== 'completed') {
		throw new Error(`airStatus had invalid value: ${airStatus}`);
	}

	const poster = getImage(document, detailsPage.poster, fieldsAreRequired);
	const chapters = getChapters(document, detailsPage.chapters, host);

	const mangaMeta: Omit<IManga, '_id' | 'featured'> = {
		title,
		description,
		otherNames,
		authors,
		artists,
		genres,
		released,
		airStatus,
		sourceUrlName: urlName,
		hostId: host._id,
		poster,
		chapters,
	};

	return mangaMeta;
}

function getText(root: HTMLElement, selector: string, required: boolean) {
	const text = root.querySelector(selector)?.textContent?.trim();
	if (!text && required) {
		throw new Error(`Selector failed: ${selector}`);
	}
	return text;
}

function getImage(root: HTMLElement, selector: string, required: boolean) {
	const imgEl = root.querySelector(selector);
	const src =
		imgEl.getAttribute('data-src') ||
		imgEl.getAttribute('data-srcset') ||
		imgEl.getAttribute('srcset') ||
		imgEl.getAttribute('src');

	if (!src && required) {
		throw new Error(`Selector failed: ${selector}`);
	}

	return src;
}

function getChapters(root: HTMLElement, selector: string, host: IHost) {
	const chapters: IManga['chapters'] = [];
	const chapterEls = root.querySelectorAll(selector);

	for (const chapterEl of [...chapterEls]) {
		const chapterTitleEl = chapterEl.querySelector('a');
		const chapterTitle = chapterTitleEl?.textContent?.trim();

		// Removing ghost chapters
		if (!chapterTitle) continue;

		const sourceUrlName = matchValueWithSchema({
			source: chapterTitleEl.getAttribute('href'),
			schema: host.detailsPage.url,
			key: '%name',
		});

		const chapterNumber = getChapterNumber(chapterTitle);
		// Removing ghost chapters
		if (isNaN(chapterNumber)) continue;

		const chapter: IManga['chapters'][0] = {
			title: chapterTitle,
			number: chapterNumber,
			urlName: `chapter-${chapterNumber}`,
			sourceUrlName,
		};

		chapters.push(chapter);
	}

	if (!chapters || chapters.length === 0) {
		throw new Error(`Chapters selector failed: ${selector}`);
	}

	return chapters;
}
