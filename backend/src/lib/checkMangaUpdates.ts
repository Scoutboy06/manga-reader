import chalk from 'chalk';

import Host from '@/models/hostModel.js';
import Manga from '@/models/mangaModel.js';

export default async function checkMangaUpdates() {
	console.log(chalk.yellow('Checking manga updates...'));
	let updatedMangaCount = 0;
	let newChapterCount = 0;

	const [ongoingMangas, hosts] = await Promise.all([
		Manga.find({ airStatus: 'ongoing' }),
		Host.find({}, { detailsPage: 1, name: 1 }),
	]);

	// for()
}

export function mangaHasUpdates(manga: typeof Manga[], hosts: typeof Host[]) {
	return;
}
