import express from 'express';
import { getAllHosts, createHost, getHostById } from './controllers/hostController.js';
import { getImageFromUrl } from './controllers/imageController.js';
import {
	getUserMangas,
	getMangaById,
	createManga,
	updateManga,
	deleteManga,
	getImageUrls,
	getMangaByName,
} from './controllers/mangaController.js';
import { search } from './controllers/searchController.js';
import {
	createUser,
	deleteUser,
	updateUser,
	getAllUsers,
	getUserById,
} from './controllers/userController.js';
import { updateProgress } from './controllers/updatesController.js';
import {
	getAnimeByUrlName,
	getAnimeById,
	getEpisode,
} from './controllers/animeController.js';

const router = express.Router();

// Hosts
router.route('/hosts')
	.get(getAllHosts)
	.post(createHost);
router.get('/hosts/:hostId', getHostById);

// Users
router.route('/users')
	.get(getAllUsers)
	.post(createUser)
	.delete(deleteUser)
	.patch(updateUser)
router.get('/users/:userId', getUserById);

// Mangas
router.route('/users/:userId/mangas')
	.get(getUserMangas)
	.post(createManga)
router.get('/users/:userId/mangas/:mangaName', getMangaByName);
router.route('/mangas/:mangaId')
	.get(getMangaById)
	.delete(deleteManga)
	.patch(updateManga);
router.patch('/mangas/:mangaId/updates', updateProgress);
router.get('/mangas/:mangaId/:chapter', getImageUrls);

// Animes
router.get('/users/:userId/animes/:urlName', getAnimeByUrlName);
router.get('/animes/:_id', getAnimeById);
router.get('/animes/:_id/episode-:episodeNumber', getEpisode);
// router.get('/episodes/:_id', getEpisode);

// Search
router.get('/search', search);

// Image
router.get('/image/*', getImageFromUrl);

export default router;