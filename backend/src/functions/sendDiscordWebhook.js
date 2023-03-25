import fetch from 'node-fetch';

export default function sendDiscordWebhook(content) {
	return fetch(process.env.WEBHOOK_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(content)
	});
}