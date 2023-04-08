export interface Embed {
	title?: string;
	type?: string;
	description?: string;
	url?: string;
	timestamp?: string;
	color?: number | string;
	footer?: object;
	image?: object;
	thumbnail?: object;
	video?: object;
	provider?: object;
	author?: object;
	fields?: [object];
}

export interface WebhookMessage {
	content: string;
	username?: string;
	avatar_url?: string;
	tts?: boolean;
	embeds: [Embed];
	allowed_mensions?: object;
	components?: [object];
	files?: [];
	attachments?: [];
	flags?: number;
	thread_name?: string;
}
