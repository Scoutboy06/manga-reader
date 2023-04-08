import chalk from 'chalk';

import Manga from '../../models/mangaModel.js';
import User from '../../models/userModel.js';
import Host from '../../models/hostModel.js';

import scrapeManga from '@/lib/scrapeManga.js';
import sendDiscordWebhook from '../../lib/sendDiscordWebhook.js';

export default async function mangaUpdates() {
	// console.log(chalk.yellow(`Checking manga updates...`));
	// let updatedMangaCount = 0;
	// let newChapterCount = 0;
	// const [ongoingMangas, hosts] = await Promise.all([
	// 	Manga.find({ airStatus: 'ongoing' }),
	// 	Host.find({}, { detailsPage: 1, name: 1 }),
	// ]);
	// await asyncMap(ongoingMangas, async manga => {
	// 	const host = hosts.find(
	// 		host => host._id.toString() === manga.hostId.toString()
	// 	);
	// 	let mangaMeta;
	// 	try {
	// 		mangaMeta = await scrapeManga({ urlName: manga.sourceUrlName, host });
	// 	} catch (err) {
	// 		console.log('---------------');
	// 		console.log(
	// 			chalk.red(
	// 				[err, 'Host: ' + host.name, 'Manga: ' + manga.title].join('\n')
	// 			)
	// 		);
	// 		return;
	// 	}
	// 	const newChapters = mangaMeta.chapters.filter(
	// 		chapter =>
	// 			!manga.chapters.find(ch => ch.sourceUrlName === chapter.sourceUrlName)
	// 	);
	// 	if (newChapters.length === 0) return;
	// 	updatedMangaCount++;
	// 	newChapterCount += newChapters.length;
	// 	manga.chapters = mangaMeta.chapters;
	// 	await manga.save();
	// 	const subscribedUsers = await User.find(
	// 		{
	// 			'mangas._id': manga._id,
	// 		},
	// 		{
	// 			discordUserId: 1,
	// 		}
	// 	);
	// 	if (subscribedUsers.length === 0) return;
	// 	await asyncSettled(newChapters, async chapter => {
	// 		await sendDiscordWebhook({
	// 			username: 'Manga update',
	// 			content:
	// 				`${manga.title} - Chapter ${chapter.number}\n` +
	// 				subscribedUsers.map(user => `<@${user.discordUserId}>`).join(' '),
	// 			embeds: [
	// 				{
	// 					title: `${manga.title} - Chapter ${chapter.number}`,
	// 					color: 0x1eaeec,
	// 					thumbnail: {
	// 						url: new URL(manga.poster, process.env.WEBSITE_URI).href,
	// 						height: 150,
	// 						width: 100,
	// 					},
	// 					url: new URL(
	// 						`/mangas/${manga.urlName}/${chapter.urlName}`,
	// 						process.env.WEBSITE_URI
	// 					).href,
	// 				},
	// 			],
	// 		});
	// 	});
	// });
	// console.log(
	// 	chalk.blue(
	// 		`${updatedMangaCount} updated mangas, ${newChapterCount} new chapters`
	// 	)
	// );
}
