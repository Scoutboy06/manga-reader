import mongoose from 'mongoose';

const MODEL_NAME = mongoose.Schema(
	{
		ownerId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
		hostId: { type: mongoose.Types.ObjectId, ref: 'Host', required: true },
		urlName: { type: String, required: true },
		sourceUrlName: { type: String, required: true },

		title: { type: String, required: true },
		description: { type: String, required: true },

		chapters: [
			{
				title: { type: String, required: true },
				number: { type: Number, required: true },
				urlName: { type: String, required: true },
				sourceUrlName: { type: String, required: true },
				_id: false
			},
		],
		currentChapter: { type: String, required: true },

		otherNames: String,
		authors: String,
		artists: String,
		genres: String,
		released: String,
		status: String,
		// otherNames: { type: String, required: true },
		// authors: { type: String, required: true },
		// artists: { type: String, required: true },
		// genres: { type: String, required: true },
		// released: { type: String, required: true },
		// status: { type: String, required: true },

		isFavorite: { type: Boolean, default: false },
		hasRead: { type: Boolean, default: false },
		isSubscribed: { type: Boolean, default: false },
		notificationsOn: { type: Boolean, default: false },
		lastUpdatePingedChapter: String,
		hasUpdates: { type: Boolean, default: true },

		poster: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

const Manga = mongoose.model('Manga', MODEL_NAME);

export default Manga;
