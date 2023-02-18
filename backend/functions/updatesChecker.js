import chalk from 'chalk';

import Manga from '../models/mangaModel.js';
import Host from '../models/hostModel.js';
import User from '../models/userModel.js';
import Anime from '../models/animeModel.js';

import getMangaMeta from './manga/getMetadata.js';
import getAnimeMeta from './anime/getAnimeMeta.js';
import sendDiscordWebhookUpdate from './sendDiscordWebhook.js';
import asyncMap from './asyncMap.js';
import updateEpisodes from './anime/updateEpisodes.js';
import { asyncSettled } from './asyncMap.js';

export default async function updatesChecker() {
	const intervalDelay = 120; // minutes
	console.log(chalk.blue(`Updates checker is activated with an interval of ${intervalDelay} minutes.`));

	const checkUpdates = async () => {
		const hosts = await Host.find({});
		const mangas = await Manga.find({ airStatus: 'ongoing' });
		// const animes = await Anime.find({});

		checkMangaUpdates({ hosts, mangas });
		// checkAnimeUpdates({ users, hosts, animes });
	}

	setInterval(checkUpdates, 1000 * 60 * intervalDelay);
	checkUpdates();
}

export async function checkMangaUpdates({ hosts, mangas }) {
	console.log(chalk.yellow('Checking manga updates...'));
	let updates = 0;

	await asyncSettled(mangas, async manga => {
		const host = hosts.find(host => host._id.toString() === manga.hostId.toString());
		const meta = await getMangaMeta({ urlName: manga.sourceUrlName, host });

		const newChapters = meta.chapters.filter(chapter =>
			!manga.chapters.find(ch => ch.sourceUrlName === chapter.sourceUrlName)
		);

		if (newChapters.length > 0) {
			updates += newChapters.length;
			manga.hasUpdates = true;
			manga.chapters = meta.chapters;
			await manga.save();

			const usersWithNotificationsOn = await User.find({
				mangas: {
					$elemMatch: {
						_id: manga._id,
						notificationsOn: true,
					}
				}
			});

			await asyncSettled(usersWithNotificationsOn, async user => {
				if (!user.discordUserId) return;

				await sendDiscordWebhookUpdate({
					username: 'Manga update',
					content: `${manga.title} - ${chapter.title}\n<@${user.discordUserId}>`,
					embeds: [{
						title: `${manga.title} - ${chapter.title}`,
						color: 0x1eaeec,
						thumbnail: {
							url: manga.poster,
							height: 150,
							width: 100,
						},
						url: `${process.env.WEBSITE_URI}/read/${manga.urlName}/${chapter.urlName}`
					}],
				});
			});
		}
	});

	console.log(chalk.blue(`Found ${updates} new chapters`));
}

export async function checkAnimeUpdates({ users, hosts, animes }) {
	console.log(chalk.yellow('Checking anime updates...'));
	const ongoingAnimes = await Anime.find({ isAiring: true });
	let newEpisodesCount = 0;

	// animes -> seasons -> parts -> episodes

	await asyncMap(ongoingAnimes, async anime => {
		let animeHasUpdated = false;
		const user = await User.findById(anime.ownerId);
		const ongoingSeasons = anime.seasons.filter(season => season.isAiring);

		await asyncMap(ongoingSeasons, async season => {
			const ongoingParts = season.parts.filter(part => part.isAiring);

			await asyncMap(ongoingParts, async part => {
				const meta = await getAnimeMeta(part.sourceUrlName, false);
				const newEpisodes = meta.episodes.filter(episode => !part.episodes.find(ep => ep.sourceUrlName === episode.sourceUrlName));

				if (newEpisodes.length > 0) {
					const newEpisodeList = updateEpisodes(part.episodes, meta.episodes);
					part.episodes = newEpisodeList;
					animeHasUpdated = true;
					anime.hasNewEpisodes = true;
					season.hasNewEpisodes = true;
				}

				await asyncMap(newEpisodes, async episode => {
					newEpisodesCount++;

					if (!anime.notificationsOn) return;
					await sendDiscordWebhookUpdate({
						username: 'Anime updates',
						content: `${anime.title} - ${season.name} - Episode ${episode.number}\n<@${user.discordUserId}>`,
						embeds: [{
							title: `${anime.title} - ${season.name} - Episode ${episode.number}`,
							color: 0x1eaeec,
							thumbnail: {
								url: anime.poster.small,
								height: 150,
								width: 100,
							},
							url: `${process.env.WEBSITE_URI}/watch/${anime.urlName}/${season.urlName}/${episode.urlName}`
						}],
					});

				});
			});
		});

		if (animeHasUpdated) {
			await anime.save();
		}
	});


	console.log(chalk.blue(`Found ${newEpisodesCount} new anime episode${newEpisodesCount === 1 ? '' : 's'}`));
}