import { Schema, model } from 'mongoose';
import IManga from '../types/Manga.js';

const mangaModel = new Schema<IManga>({
	urlName: { type: String, required: true, unique: true, index: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	sourceUrlName: { type: String, required: true },

	hostId: { type: Schema.Types.ObjectId, ref: 'Host', required: true },

	airStatus: { type: String, enum: ['ongoing', 'completed'], required: true },

	chapters: [
		{
			_id: false,
			title: { type: String, required: true },
			number: { type: Number, required: true },
			urlName: { type: String, required: true },
			sourceUrlName: { type: String, required: true },
			dateAdded: { type: Date, required: true },
		},
	],

	otherNames: String,
	authors: String,
	artists: String,
	genres: String,
	released: String,

	poster: { type: String, required: true },
	backdrop: String,

	featured: Boolean,
	featuredIndex: Number,

	popular: Boolean,
	popularIndex: Number,

	createdAt: { type: Date, required: true },
	latestChapterAt: { type: Date, required: true },
});

const Manga = model('Manga', mangaModel);

export default Manga;
