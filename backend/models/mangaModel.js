import mongoose from 'mongoose';





const mangaSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		urlName: {
			type: String,
			required: true,
		},
		chapter: {
			type: Number,
			required: true,
			default: 1,
		},
		lastChapter: {
			type: Number,
			required: true,
		},
		subscribed: {
			type: Boolean,
			required: true,
			default: false,
		},
		hosts: [
			{
				hostName: { type: String, required: true },
				mangaName: { type: String, required: true },
			},
		],
		coverUrl: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: false
	}
);


const Manga = mongoose.model('Manga', mangaSchema);

export default Manga;