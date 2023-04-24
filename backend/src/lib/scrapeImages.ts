import { HydratedDocument } from 'mongoose';
import IHost from '../types/Host.js';
import { parse } from 'node-html-parser';

export default async function scrapeImages(
	sourceUrlName: string,
	chapterUrlName: string,
	host: HydratedDocument<IHost>
) {
	const url = host.chapterPage.urlPattern
		.replace('%name%', sourceUrlName)
		.replace('%chapter%', chapterUrlName);
	console.log(url);

	const html = await fetch(url).then(res => res.text());
	const document = parse(html);

	const imageEls = document.querySelectorAll(host.chapterPage.images);
	const srcs = [];

	for (const img of imageEls) {
		let src =
			img.getAttribute('data-src') ||
			img.getAttribute('data-setsrc') ||
			img.getAttribute('srcset') ||
			img.getAttribute('setsrc') ||
			img.getAttribute('src');

		src = host.chapterPage.imageUrlPrepend + src.trim();
		srcs.push(src);
	}

	if (srcs.length === 0) return null;
	return srcs;
}
