import { Schema, model } from 'mongoose';

export interface IHost {
	name: string;
	detailsPage: {
		url: string;
		title: string;
		poster: string;
		otherNames: string;
		authors?: string;
		artists?: string;
		genres: string;
		released?: string;
		status: string;
	};
	chapterPage: {
		url: string;
		prevPage: string;
		nextPage: string;
		images: string;
	};
	search: {
		url: string;
		method: string;
		container: string;
		poster: string;
		title: string;
		latestChapter: string;
		latestUpdate: string;
		detailsPage: string;
	};
}

const MODEL_NAME = new Schema<IHost>({
	name: { type: String, required: true },

	detailsPage: {
		url: { type: String, required: true },

		title: { type: String, required: true },
		poster: { type: String, required: true },
		otherNames: { type: String, required: true },
		authors: String,
		artists: String,
		genres: { type: String, required: true },
		released: String,
		status: { type: String, required: true },

		description: { type: String, required: true },
		chapters: { type: String, required: true },
	},

	chapterPage: {
		url: { type: String, required: true },

		prevPage: { type: String, required: true },
		nextPage: { type: String, required: true },
		images: { type: String, required: true },
	},

	search: {
		url: { type: String, required: true },
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
