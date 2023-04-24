import IHost from '../types/Host.js';
import { Chapter } from '../types/Manga.js';
import { parse, HTMLElement } from 'node-html-parser';
import matchValueWithSchema from './matchValueWithSchema.js';
import getChapterNumber from './getChapterNumber.js';
import { HydratedDocument } from 'mongoose';
import { NewManga } from '../types/Manga.js';

export default async function scrapeManga(
	sourceUrlName: string,
	host: HydratedDocument<IHost>,
	fieldsAreRequired: boolean
) {
	const url = host.detailsPage.urlPattern.replace('%name%', sourceUrlName);

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
	const genres = getText(document, detailsPage.genres, false);
	console.log('here');
	const released = getText(document, detailsPage.released, false);

	const airStatus = getText(
		document,
		detailsPage.airStatus,
		fieldsAreRequired
	)?.toLowerCase();

	if (
		airStatus !== 'ongoing' &&
		airStatus !== 'completed' &&
		fieldsAreRequired
	) {
		throw new Error(`airStatus had invalid value: ${airStatus}`);
	}

	const poster = getImage(document, detailsPage.poster, fieldsAreRequired);
	const chapters = getChapters(
		document,
		detailsPage.chapters,
		host.chapterPage.scrapePattern
	);

	const mangaMeta: NewManga = {
		urlName: sourceUrlName,
		title,
		description,
		sourceUrlName,

		hostId: host._id,
		airStatus:
			airStatus === 'ongoing' || airStatus === 'completed'
				? airStatus
				: undefined,

		chapters,
		latestChapterAt: new Date(),

		otherNames,
		authors,
		artists,
		genres,
		released,

		poster,

		createdAt: new Date(),
	};

	return mangaMeta;
}

function getText(root: HTMLElement, selector: string, required: boolean) {
	if (!selector) return null;
	const text = root.querySelector(selector)?.textContent?.trim();
	if (!text && required) {
		throw new Error(`Text selector failed: ${selector}`);
	}
	return text;
}

function getImage(root: HTMLElement, selector: string, required: boolean) {
	const imgEl = root.querySelector(selector);
	const src =
		imgEl.getAttribute('data-src') ||
		imgEl.getAttribute('data-setsrc') ||
		imgEl.getAttribute('srcset') ||
		imgEl.getAttribute('setsrc') ||
		imgEl.getAttribute('src');

	if (!src && required) {
		throw new Error(`Image selector failed: ${selector}`);
	}

	return src;
}

function getChapters(
	root: HTMLElement,
	selector: string,
	chapterPagePattern: string
) {
	const chapters: Chapter[] = [];
	const chapterEls = root.querySelectorAll(selector);

	for (const chapterEl of [...chapterEls]) {
		const chapterTitleEl = chapterEl.querySelector('a');
		const chapterTitle = chapterTitleEl?.textContent?.trim();

		// Removing ghost chapters
		if (!chapterTitle) continue;

		const chapterNumber = getChapterNumber(chapterTitle);

		// Removing ghost chapters
		if (isNaN(chapterNumber)) continue;

		console.log(chapterTitleEl.getAttribute('href'));

		const sourceUrlName = matchValueWithSchema({
			value: chapterTitleEl.getAttribute('href'),
			schema: chapterPagePattern,
		}).get('chapter');

		const chapter: Chapter = {
			number: chapterNumber,
			urlName: `chapter-${chapterNumber}`,
			sourceUrlName,
			dateAdded: new Date(),
		};

		chapters.push(chapter);
	}

	if (!chapters || chapters.length === 0) {
		throw new Error(`Chapters selector failed: ${selector}`);
	}

	return chapters;
}
