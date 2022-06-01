import fetch from 'node-fetch';

import User from '../models/userModel.js';

import chapterNameToChapter from './chapterNameToChapter.js';

export default async function sendDiscordWebhookUpdate(manga) {
	const { WEBHOOK_URL } = process.env;

	const user = await User.findById(manga.ownerId);

	const embed = {
		title: `${manga.name} - Chapter ${chapterNameToChapter(manga.chapter)}`,
		description: user.discordUserId ? `<@${user.discordUserId}>` : null,
		thumbnail: {
			url: manga.coverUrl,
		},
	};

	return await fetch(WEBHOOK_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			embeds: [embed]
		})
	});
}