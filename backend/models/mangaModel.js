import mongoose from 'mongoose';





const mangaSchema = mongoose.Schema(
	{
		name: { type: String, required: true },
		urlName: { type: String, required: true },
		chapter: { type: String, required: true },
		// lastChapter: { type: String, required: false },
		subscribed: { type: Boolean, required: false, default: false },
		host: {
			hostName: { type: String, required: true },
			mangaName: { type: String, required: true },
		},
		coverUrl: { type: String, required: true },
	},
	{
		timestamps: false
	}
);


const Manga = mongoose.model('Manga', mangaSchema);

export default Manga;