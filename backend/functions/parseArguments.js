import chalk from 'chalk';

import Manga from '../models/mangaModel.js';
import Host from '../models/hostModel.js';

import mangaHasUpdates from './mangaHasUpdates.js';
import sendDiscordWebhookUpdate from './sendDiscordWebhookUpdate.js';

export default function parseArguments() {
	const args = process.argv.slice(2);
	let shallCheckUpdates = false; // Default: false
	let intervalDelay = 20; // Default: 20 minutes

	for (let i = 0; i < args.length; i++) {
		const val = args[i];
		const nextVal = args[i + 1];

		switch (val) {
			case '--updates':
			case '-U':
				shallCheckUpdates = true;
				break;

			case '--delay':
			case '-D':
				if (!nextVal) {
					console.error('No argument appeared after: ' + val);
					process.exit(1);
				}
				const parsedDelay = parseInt(nextVal);

				if (isNaN(parsedDelay)) {
					if (!nextVal) {
						console.error(`Invalid argument: ${parsedDelay}, the type is not number`);
						process.exit(1);
					}
				}

				intervalDelay = parsedDelay;
				i++;
				break;

			default:
				console.error('Invalid argument: ' + val);
				process.exit(1);
		}
	}

	if (shallCheckUpdates) {
		console.log(chalk.blue(`Updates checker is activated with a delay of ${intervalDelay} minutes.`));

		checkUpdates();
		setInterval(checkUpdates, 1000 * 60 * intervalDelay); // minutes to milliseconds

		async function checkUpdates() {
			console.log(chalk.yellow('Checking updates...'));

			const subscribedMangas = await Manga.find({ subscribed: true });

			// Loop through all mangas and check if it has updates
			let updatesArray = await Promise.all(subscribedMangas.map(manga => new Promise(async (resolve, reject) => {
				try {
					const hasUpdates = await mangaHasUpdates(manga, false);
					resolve({ manga, hasUpdates });
				} catch (err) {
					reject(err);
				}
			})));

			// Remove all mangas without updates
			updatesArray = updatesArray.filter(object => object.hasUpdates);

			console.log(chalk.yellow(`Found ${updatesArray.length} updates.`));
			if (updatesArray.length === 0) return;

			// Send update messages to Discord Webhook
			await Promise.all(updatesArray.map((data, index) => new Promise(async (resolve, reject) => {
				try {
					// await sendDiscordWebhookUpdate(data.manga);
					resolve(data.manga);
				} catch (err) {
					reject(err);
				}
			})));

			console.log(chalk.yellow('Successfully sent all Discord Webhook updates'));
		}
	}
}