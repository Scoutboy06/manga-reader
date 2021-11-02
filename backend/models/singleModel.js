import mongoose from 'mongoose';



const singleSchema = mongoose.Schema(
	{
		name: { type: String, required: true },
		urlName: { type: String, required: true },
		chapter: { type: String, required: true },
		path: { type: String, required: true },
		imgSelector: {
			querySelector: { type: String, required: true },
			attrSelector: { type: String, required: true},
		},
		chapterNameSelectors: {
			parent: { type: String, required: true },
			prev: { type: String, required: true },
			next: { type: String, required: true },
		},
		// subscribed: { type: Boolean, required: false, default: false },
		needProxy: { type: Boolean, required: false, default: false },
		coverUrl: { type: String, required: true },
	},
	{
		timestamps: false
	}
);


const Single = mongoose.model('Single', singleSchema);

export default Single;