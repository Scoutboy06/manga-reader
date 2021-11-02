import mongoose from 'mongoose';



const hostSchema = mongoose.Schema(
	{
		hostName: { type: String, required: true },
		path: { type: String, required: true },
		imgSelector: {
			querySelector: { type: String, required: true },
			attrSelector: { type: String, required: true },
		},
		detailsPage: { type: String, required: false },
		coverSelector: { type: String, required: false },
		search: {
			url: { type: String, required: false },
			method: { type: String, required: false, default: 'POST' },
			selectors: {
				parent: { type: String, required: false },
				img: {
					selector: { type: String, required: false },
					attribute: { type: String, required: false }
				},
				mangaName: { type: String, required: false },
				latestChapter: { type: String, required: false },
				latestUpdate: { type: String, required: false },
				detailsPage: { type: String, required: false }
			},	
			nextChapter: { type: String, required: false },
			required: false,
		},
		chapterNameSelectors: {
			parent: { type: String, required: false },
			prev: { type: String, required: false },
			next: { type: String, required: false },
			required: false,
		},
		needProxy: { type: Boolean, required: true },
	},
	{
		timestamps: false
	}
);


const Host = mongoose.model('Host', hostSchema);

export default Host;