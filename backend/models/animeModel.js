import mongoose from 'mongoose';

const MODEL_NAME = mongoose.Schema({
	tmdbId: Number,
	urlName: { type: String, required: true },

	title: { type: String, required: true },
	description: { type: String, required: true },
	mediaType: String, // 'tv' or 'movie'

	seasons: [{
		_id: false,
		name: { type: String, required: true },
		urlName: { type: String, required: true },
		description: { type: String, default: '' },
		tmdbId: { type: Number, required: true },
		// hasWatched: { type: Boolean, default: false },
		// hasNewEpisodes: { type: Boolean, default: false },
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
				// hasWatched: { type: Boolean, default: false },
				// isFavorite: { type: Boolean, default: false },
				// isNew: { type: Boolean, default: false },
			}],
		}],
	}],


	// currentSeasonId: mongoose.Types.ObjectId,
	// currentPartIndex: Number,
	// currentEpisodeId: mongoose.Types.ObjectId,

	genres: { type: String, required: true },
	released: { type: String, required: true },
	isAiring: { type: Boolean, required: true },
	// hasWatched: { type: Boolean, default: false },
	otherNames: { type: String, required: true },

	// isFavorite: { type: Boolean, default: false },
	// notificationsOn: { type: Boolean, default: false },
	// hasNewEpisodes: { type: Boolean, default: false },

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
