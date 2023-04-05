import { Schema, Types, model } from 'mongoose';
import Manga from '@/types/Manga';

const schema = new Schema<Manga>(
	{
		isVerified: { type: Boolean, required: true },
		title: { type: String, required: true },
		description: { type: String, required: true },
		urlName: { type: String, required: true, unique: true },
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
			},
		],

		otherNames: String,
		authors: String,
		artists: String,
		genres: String,
		released: String,

		poster: { type: String, required: true },
		backdrop: String,
	},
	{
		timestamps: true,
	}
);

export default model('Manga', schema);
