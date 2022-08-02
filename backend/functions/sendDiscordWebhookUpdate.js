import fetch from 'node-fetch';

import User from '../models/userModel.js';

import getChapterNumber from './getChapterNumber.js';

export default async function sendDiscordWebhookUpdate(manga) {
	const { WEBHOOK_URL } = process.env;

	const user = await User.findById(manga.ownerId);

	const embed = {
		title: manga.name,
		description: `Chapter ${getChapterNumber(manga.chapter)}\n\n<@${user.discordUserId}>`,
		thumbnail: {
			url: manga.coverUrl,
		},
		url: `${process.env.WEBSITE_URI}/read/${manga.urlName}`
	};

	return fetch(WEBHOOK_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			embeds: [embed]
		})
	});
}