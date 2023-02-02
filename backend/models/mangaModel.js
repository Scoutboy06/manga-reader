import mongoose from 'mongoose';

const MODEL_NAME = mongoose.Schema(
	{
		ownerId: { type: mongoose.Types.ObjectId, ref: 'User', required: false },

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
			},
		],
		// currentChapter: { type: String, required: true },

		// otherNames: String,
		// authors: String,
		// artists: String,
		// genres: String,
		// released: String,
		status: { type: String, enum: ['ongoing', 'completed'] },

		// isFavorite: { type: Boolean, default: false },
		// hasRead: { type: Boolean, default: false },
		// notificationsOn: { type: Boolean, default: false },
		// lastUpdatePingedChapter: String,
		// hasUpdates: { type: Boolean, default: true },

		poster: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

const Manga = mongoose.model('Manga', MODEL_NAME);

export default Manga;
