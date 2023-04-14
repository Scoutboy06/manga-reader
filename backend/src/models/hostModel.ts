import { Schema, model } from 'mongoose';
import IHost from '../types/Host.js';

const MODEL_NAME = new Schema<IHost>({
	name: { type: String, required: true },

	detailsPage: {
		urlPattern: { type: String, required: true },

		title: { type: String, required: true },
		poster: { type: String, required: true },
		otherNames: { type: String, required: true },
		authors: String,
		artists: String,
		genres: { type: String, required: true },
		released: String,
		airStatus: { type: String, required: true },

		description: { type: String, required: true },
		chapters: { type: String, required: true },
	},

	chapterPage: {
		urlPattern: { type: String, required: true },

		prevPage: { type: String, required: true },
		nextPage: { type: String, required: true },
		images: { type: String, required: true },
	},

	search: {
		urlPattern: { type: String, required: true },
		method: { type: String, required: true },

		container: { type: String, required: true },
		poster: { type: String, required: true },
		title: { type: String, required: true },
		latestChapter: { type: String, required: true },
		latestUpdate: { type: String, required: true },
		detailsPage: { type: String, required: true },
	},
});

const Host = model('Host', MODEL_NAME);

export default Host;
