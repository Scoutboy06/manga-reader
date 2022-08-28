import { Router } from 'express';
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
import { searchManga } from './controllers/searchController.js';
import {
	createUser,
	deleteUser,
	updateUser,
	getAllUsers,
	getUserById,
} from './controllers/userController.js';
import { updateProgress } from './controllers/updatesController.js';
import {
	addAnimeToLibrary,
	getAnimeLibrary,
	getAnimeByUrlName,
	getEpisode,
} from './controllers/animeController.js';

const router = Router();

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
router.route('/users/:userId/animes')
	.get(getAnimeLibrary)
	.post(addAnimeToLibrary);
router.get('/users/:userId/animes/:urlName', getAnimeByUrlName);
router.get('/users/:userId/animes/:animeUrlName/:seasonUrlName/:episodeUrlName', getEpisode);

// Search
router.get('/search', searchManga);

// Image
router.get('/image/*', getImageFromUrl);

export default router;