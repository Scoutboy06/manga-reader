import express from 'express';
import {
	getMangaByUrlName,
	createManga,
	deleteManga,
	getImageUrls,
	getAllMangas,
	updateAttributeSelector,
} from '../controllers/mangaController.js';

import { updateProgress } from '../controllers/updatesController.js';

const router = express.Router();

router.route('/').post(createManga).get(getAllMangas);
router.route('/:_id').get(getMangaByUrlName).delete(deleteManga);
router.post('/updateProgress', updateProgress);
router.route('/:urlName/:chapter').get(getImageUrls);
router.put('/updateAttributeSelector', updateAttributeSelector);

export default router;
