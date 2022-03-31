import express from 'express';
import {
	getMangaByUrlName,
	createManga,
	deleteManga,
	getImageUrls,
} from '../controllers/mangaController.js';

import { updateProgress } from '../controllers/updatesController.js';

const router = express.Router();

router.route('/').post(createManga);
router.route('/:_id').get(getMangaByUrlName).delete(deleteManga);
router.post('/updateProgress', updateProgress);
router.get('/:urlName/:chapter', getImageUrls);

export default router;
