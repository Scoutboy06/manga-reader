import chalk from 'chalk';

import Manga from '../models/mangaModel.js';
import User from '../models/userModel.js';
import Anime from '../models/animeModel.js';

import getMangaMeta from './manga/getMetadata.js';
import getAnimeMeta from './anime/getAnimeMeta.js';
import sendDiscordWebhookUpdate from './sendDiscordWebhook.js';

export default async function updatesChecker() {
	const intervalDelay = 120; // minutes
	console.log(chalk.blue(`Updates checker is activated with an interval of ${intervalDelay} minutes.`));

	const checkUpdates = () => {
		// checkMangaUpdates();
		checkAnimeUpdates();
	}

	setInterval(checkUpdates, 1000 * 60 * intervalDelay);
	checkUpdates();
}

export async function checkMangaUpdates() {
	console.log(chalk.yellow('Checking manga updates...'));
	const subscribedMangas = await Manga.find({ isSubscribed: true });
	let updates = 0;

	await Promise.all(subscribedMangas.map(manga => new Promise(async (resolve, reject) => {
		const meta = await getMangaMeta(manga.sourceUrlName, manga.hostId);

		const newChapters = meta.chapters.filter(chapter =>
			!manga.chapters.find(ch => ch.sourceUrlName === chapter.sourceUrlName)
		);

		if (newChapters.length > 0) {
			updates++;
			manga.hasUpdates = true;
			manga.chapters = meta.chapters;
			manga.save();

			const user = await User.findById(manga.ownerId);

			await Promise.all(newChapters.map(chapter => new Promise(async (resolve, reject) => {
				const embed = {
					title: `${manga.title} - ${chapter.title}`,
					description: `<@${user.discordUserId}>`,
					color: 0x1eaeec,
					thumbnail: {
						url: manga.poster,
						height: 150,
						width: 100,
					},
					url: `${process.env.WEBSITE_URI}/read/${manga.urlName}/${chapter.urlName}`
				};

				await sendDiscordWebhookUpdate({ embeds: [embed] });
				resolve();
			})));
		}

		resolve();
	})));

	console.log(chalk.blue(`Found ${updates} mangas with updates`));
}

export async function checkAnimeUpdates() {
	console.log(chalk.yellow('Checking anime updates...'));
	const subscribedAnimes = await Anime.find({ updatesOn: true });
	let updates = 0;

	await Promise.all(subscribedAnimes.map(anime => new Promise(async (resolve, reject) => {
		const season = anime.seasons[anime.seasons.length - 1];
		const meta = await getAnimeMeta(season.gogoUrlName, false);

		const newEpisodes = meta.episodes.filter(episode => !season.episodes.find(ep => ep.gogoUrlName === episode.gogoUrlName));
		updates += newEpisodes.length;

		if (newEpisodes.length > 0) {
			anime.hasUpdates = true;
			season.episodes = meta.episodes;
			anime.save();

			const user = await User.findById(anime.ownerId);

			await Promise.all(newEpisodes.map(episode => new Promise(async (resolve, reject) => {

				const embed = {
					title: `${anime.title} - ${season.name} - Episode ${episode.number}`,
					description: `<@${user.discordUserId}>`,
					color: 0x1eaeec,
					thumbnail: {
						url: anime.poster.small,
						height: 150,
						width: 100,
					},
					url: `${process.env.WEBSITE_URI}/watch/${anime.urlName}/${season.urlName}/${episode.urlName}`
				};

				await sendDiscordWebhookUpdate({ embeds: [embed] });
				resolve();
			})));
		}

		resolve();
	})));


	console.log(chalk.blue(`Found ${updates} new episodes`));
}