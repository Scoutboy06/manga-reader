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

			poster: { type: String, required: true },
			title: { type: String, required: true },
			latestChapter: { type: String, required: true },
			latestUpdate: { type: String, required: true },
			detailsPage: { type: String, required: true },
		},

		// hostName: { type: String, required: true },
		// path: { type: String, required: true },
		// imgSelector: {
		// 	querySelector: { type: String, required: true },
		// 	attrSelector: { type: String, required: true },
		// },
		// detailsPage: { type: String, required: false },
		// coverSelector: { type: String, required: false },
		// search: {
		// 	url: { type: String, required: false },
		// 	method: { type: String, required: false, default: 'POST' },
		// 	selectors: {
		// 		parent: { type: String, required: false },
		// 		img: {
		// 			selector: { type: String, required: false },
		// 			attribute: { type: String, required: false },
		// 		},
		// 		mangaName: { type: String, required: false },
		// 		latestChapter: { type: String, required: false },
		// 		latestUpdate: { type: String, required: false },
		// 		detailsPage: { type: String, required: false },
		// 	},
		// 	nextChapter: { type: String, required: false },
		// 	required: false,
		// },
		// chapterNameSelectors: {
		// 	parent: { type: String, required: false },
		// 	prev: { type: String, required: false },
		// 	next: { type: String, required: false },
		// 	required: false,
		// },
		// needProxy: { type: Boolean, required: true },
	},
	{
		timestamps: true,
	}
);

const Host = mongoose.model('Host', MODEL_NAME);

export default Host;
