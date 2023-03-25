import mongoose from 'mongoose';

const MODEL_NAME = mongoose.Schema(
	{
		name: { type: String, required: true },

		detailsPage: {
			url: { type: String, required: true },

			title: { type: String, required: true },
			poster: { type: String, required: true },
			otherNames: { type: String, required: true },
			// authors: { type: String, required: true },
			// artists: { type: String, required: true },
			authors: String,
			artists: String,
			genres: { type: String, required: true },
			// released: { type: String, required: true },
			released: String,
			status: { type: String, required: true },

			description: { type: String, required: true },
			chapters: { type: String, required: true },
		},

		chapterPage: {
			url: { type: String, required: true },

			prevPage: { type: String, required: true },
			nextPage: { type: String, required: true },
			images: { type: String, required: true },
		},

		search: {
			url: { type: String, required: true },
			method: { type: String, required: true },

			container: { type: String, required: true },
			poster: { type: String, required: true },
			title: { type: String, required: true },
			latestChapter: { type: String, required: true },
			latestUpdate: { type: String, required: true },
			detailsPage: { type: String, required: true },
		},
	},
	{
		timestamps: true,
	}
);

const Host = mongoose.model('Host', MODEL_NAME);

export default Host;
