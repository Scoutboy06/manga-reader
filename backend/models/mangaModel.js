import mongoose from 'mongoose';

const MODEL_NAME = mongoose.Schema(
	{
		name: { type: String, required: true },
		originalName: { type: String, required: true },
		urlName: { type: String, required: true },
		chapter: { type: String, required: true },
		lastUpdatePingedChapter: { type: String, required: false },
		subscribed: { type: Boolean, required: false, default: false },
		coverUrl: { type: String, required: true },
		originalCoverUrl: { type: String, required: true },
		finished: { type: Boolean, required: false, default: false },
		ownerId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
		hostId: { type: mongoose.Types.ObjectId, ref: 'Host', required: true },
	},
	{
		timestamps: true,
	}
);

const Manga = mongoose.model('Manga', MODEL_NAME);

export default Manga;
