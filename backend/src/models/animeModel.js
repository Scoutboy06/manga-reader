import mongoose from 'mongoose';

const MODEL_NAME = mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	urlName: { type: String, required: true },
	tmdbId: Number,
	isAiring: { type: Boolean, required: true },
	mediaType: String, // 'tv' or 'movie'

	seasons: [{
		_id: false,
		name: { type: String, required: true },
		urlName: { type: String, required: true },
		description: { type: String, default: '' },
		tmdbId: { type: Number, required: true },
		isAiring: { type: Boolean, required: true },

		poster: {
			small: String,
			large: String,
		},

		parts: [{
			_id: false,
			number: { type: Number, required: true },
			sourceUrlName: { type: String, required: true },
			isAiring: { type: Boolean, required: true },

			episodes: [{
				_id: false,
				number: { type: Number, required: true },
				urlName: { type: String, required: true },
				sourceUrlName: { type: String, required: true },
			}],
		}],
	}],

	genres: String,
	released: String,
	otherNames: String,

	poster: {
		small: String,
		large: String,
	},
	backdrop: {
		small: String,
		large: String,
	}
});

const Anime = mongoose.model('Anime', MODEL_NAME);

export default Anime;
