import mongoose from 'mongoose';


const hostSchema = mongoose.Schema(
	{
		hostName: {
			type: String,
			required: true,
		},
		path: {
			type: String,
			required: true,
		},
		querySelector: {
			type: String,
			required: true,
		},
		detailsPage: {
			type: String,
			required: true,
		},
		coverSelector: {
			type: String,
			required: true,
		},
		needProxy: {
			type: Boolean,
			required: true,
		},
	},
	{
		timestamps: false
	}
);


const Host = mongoose.model('Host', hostSchema);

export default Host;