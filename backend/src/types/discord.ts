export interface Embed {
	title?: string;
	type?: string;
	description?: string;
	url?: string;
	timestamp?: string;
	color?: number | string;
	footer?: {};
	image?: {};
	thumbnail?: {};
	video?: {};
	provider?: {};
	author?: {};
	fields?: [{}];
}

export interface WebhookMessage {
	content: string;
	username?: string;
	avatar_url?: string;
	tts?: boolean;
	embeds: [Embed];
	allowed_mensions?: {};
	components?: [{}];
	files?: [];
	attachments?: [];
	flags?: number;
	thread_name?: string;
}
