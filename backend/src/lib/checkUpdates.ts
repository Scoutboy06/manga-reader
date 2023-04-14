import chalk from 'chalk';
import Manga from '../models/mangaModel.js';
import Host from '../models/hostModel.js';
import User from '../models/userModel.js';
import scrapeManga from './scrapeManga.js';
import { promiseSettled, promiseAll } from './asyncFunctions.js';
import Notification from '../types/Notification.js';

export default async function checkUpdates() {
	console.log(chalk.yellow(`Checking manga updates...`));
	let updatedMangaCount = 0;
	let newChapterCount = 0;

	const [ongoingMangas, hosts] = await Promise.all([
		Manga.find({ airStatus: 'ongoing' }),
		Host.find({}),
	]);

	await promiseAll(ongoingMangas, async manga => {
		const host = hosts.find(
			host => host._id.toString() === manga.hostId.toString()
		);

		if (!host) throw new Error('No host found');

		const mangaMeta = await scrapeManga(manga.sourceUrlName, host, true);
		const newChapters = mangaMeta.chapters.filter(
			chapter =>
				!manga.chapters.find(ch => ch.sourceUrlName === chapter.sourceUrlName)
		);

		if (newChapters.length === 0) return;

		updatedMangaCount++;
		newChapterCount += newChapters.length;
		manga.chapters = mangaMeta.chapters;

		await manga.save();

		await promiseSettled(newChapters, async chapter => {
			const notification: Notification = {
				title: manga.title,
				body: `Chapter ${chapter.number}`,
				action: `url:/mangas/${manga.urlName}/${chapter.urlName}`,
				createdAt: new Date(),
			};

			await User.updateMany(
				{ 'mangas._id': manga._id },
				{ $push: { notifications: notification } }
			);
		});
	});

	console.log(
		chalk.blue(
			`${updatedMangaCount} updated mangas, ${newChapterCount} new chapters`
		)
	);
}
