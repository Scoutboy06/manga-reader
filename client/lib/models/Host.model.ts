import { Model, Schema, model, models } from 'mongoose';
import IHost from '@/types/Host';

const HostSchema = new Schema<IHost>({
	name: { type: String, required: true },

	detailsPage: {
		urlPattern: { type: String, required: true },
		scrapePattern: { type: String, required: true },

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
		scrapePattern: { type: String, required: true },

		prevPage: { type: String, required: true },
		nextPage: { type: String, required: true },
		images: { type: String, required: true },
		imageUrlPrepend: { type: String, required: true },
	},
});

const Host = (models.Host ||
	model('Host', HostSchema, 'hosts')) as Model<IHost>;

export default Host;
