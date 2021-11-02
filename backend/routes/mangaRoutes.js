import express from 'express';
import {
	getMangaByUrlName,
	createManga,
	deleteManga,
	getImageUrls,
	updateProgress,
	getAllMangas,
	updateAttributeSelector,
} from '../controllers/mangaController.js';

import {
	getImageUrls as getSingleImageUrls,
	updateProgress as updateSingleProgress,
} from '../controllers/singleController.js';


const router = express.Router();


router.route('/')
	.post(createManga)
	.get(getAllMangas)



router.route('/:urlName')
	.get(getMangaByUrlName)
	.delete(deleteManga);


router.post('/updateProgress', updateProgress, updateSingleProgress);


router.route('/:urlName/:chapter')
	.get(getImageUrls, getSingleImageUrls);


router.put('/updateAttributeSelector', updateAttributeSelector);


export default router;