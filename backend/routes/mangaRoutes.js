import express from 'express';
import {
	getMangaByUrlName,
	createManga,
	deleteManga,
	getImageUrls,
	updateProgress,
	getAllMangas,
} from '../controllers/mangaController.js';


const router = express.Router();


router.route('/')
	.post(createManga)
	.get(getAllMangas)


router.route('/:urlName')
	.get(getMangaByUrlName)
	.delete(deleteManga)


router.post('/updateProgress', updateProgress);


router.route('/:urlName/:chapter')
	.get(getImageUrls)



export default router;