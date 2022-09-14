import chalk from 'chalk';

import Manga from '../models/mangaModel.js';
import Host from '../models/hostModel.js';

import mangaHasUpdates from './mangaHasUpdates.js';
import sendDiscordWebhookUpdate from './sendDiscordWebhookUpdate.js';

export default async function updatesChecker() {
	const intervalDelay = 30; // minutes
	console.log(chalk.blue(`Updates checker is activated with an interval of ${intervalDelay} minutes.`));

	const checkUpdates = () => {
		console.log(chalk.yellow('Checking updates...'));
		checkMangaUpdates();
	}

	setInterval(checkUpdates, 1000 * 60 * intervalDelay);
}

export async function checkMangaUpdates() {
	const subscribedMangas = await Manga.find({ subscribed: true });




	// console.log(chalk.blue(`Found ${updates.length} mangas with updates`));
}