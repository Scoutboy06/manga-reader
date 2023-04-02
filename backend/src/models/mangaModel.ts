import { Schema, Types, model } from 'mongoose';

export interface IManga {
	isVerified: boolean;
	title: string;
	description: string;
	urlName: string;
	sourceUrlName: string;
	hostId: Schema.Types.ObjectId;
	airStatus: 'ongoing' | 'completed';
	chapters: [
		{
			title: string;
			number: number;
			urlName: string;
			sourceUrlName: string;
		}
	];
	otherNames?: string;
	authors?: string;
	artists?: string;
	genres?: string;
	released?: string;
	poster: string;
	backdrop?: string;
}

const mangaModel = new Schema<IManga>(
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

const Manga = model('Manga', mangaModel);

export default Manga;
