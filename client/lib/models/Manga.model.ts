import { Model, Schema, model, models } from 'mongoose';
import IManga from '@/types/Manga';

const MangaSchema = new Schema<IManga>({
	urlName: { type: String, required: true, unique: true, index: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	sourceUrlName: { type: String, required: true },

	hostId: { type: Schema.Types.ObjectId, ref: 'Host', required: true },

	airStatus: { type: String, enum: ['ongoing', 'completed'], required: true },

	chapters: [
		{
			_id: false,
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

	featuredIndex: Number,
	popularIndex: Number,
	top100Index: Number,

	createdAt: { type: Date, required: true },
	latestChapterAt: { type: Date, required: true },
});

const Manga = (models?.Manga ||
	model('Manga', MangaSchema, 'mangas')) as Model<IManga>;

export default Manga;
