import { WebhookMessage } from '../types/discord.js';

import fetch from 'node-fetch';

export default function sendDiscordWebhook(content: WebhookMessage) {
	return fetch(process.env.WEBHOOK_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(content),
	});
}
