import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';

export default async function getMangaMeta({ urlName, host }) {
	const { detailsPage } = host;

	const html = await fetch(detailsPage.url.replace('%name', urlName)).then(res => res.text());
	const document = HTMLParser.parse(html);

	const title = document.querySelector(detailsPage.title).textContent.trim();
	const description = document.querySelector(detailsPage.description).textContent.trim();

	let otherNames, authors, artists, genres, released, status;

	if (detailsPage.otherNames) otherNames = document.querySelector(detailsPage.otherNames)?.textContent?.trim();
	if (detailsPage.authors) authors = document.querySelector(detailsPage.authors)?.textContent?.trim();
	if (detailsPage.artists) artists = document.querySelector(detailsPage.artists)?.textContent?.trim();
	if (detailsPage.genres) genres = document.querySelector(detailsPage.genres)?.textContent?.trim();
	if (detailsPage.released) released = document.querySelector(detailsPage.released)?.textContent?.trim();
	if (detailsPage.status) status = document.querySelector(detailsPage.status)?.textContent?.trim()?.toLowerCase();

	const posterEl = document.querySelector(detailsPage.poster);
	const poster = posterEl.getAttribute('data-src') || posterEl.getAttribute('data-srcset') || posterEl.getAttribute('srcset') || posterEl.getAttribute('src');

	const chapters = [];
	const chapterEls = document.querySelectorAll(detailsPage.chapters);
	[...chapterEls].reverse().forEach((chapterEl, i) => {
		const titleEl = chapterEl.querySelector('a');
		const title = titleEl.textContent.trim();
		const sourceUrl = (function () {
			const split = titleEl.getAttribute('href').split('/');
			return split[split.length - 2];
		})();

		const chapterNumber = title.match(/chapter (\d+\.?\d*)/i)?.[1];
		if (!chapterNumber) return;

		for (const chapter of chapters) {
			if (chapter.urlName === `chapter-${chapterNumber}`)
				return;
		}

		chapters.push({
			title,
			number: Number(chapterNumber),
			urlName: `chapter-${chapterNumber}`,
			sourceUrlName: sourceUrl,
		});
	});


	return {
		title,
		description,
		poster,
		otherNames,
		authors,
		artists,
		genres,
		released,
		status,
		chapters,
	};
}