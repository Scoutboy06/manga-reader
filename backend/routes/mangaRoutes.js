import express from 'express';
import {
	createManga,
	updateManga,
	deleteManga,
	updateFinished,
	getMangaByUrlName,
	getImageUrls,
} from '../controllers/mangaController.js';

import { updateProgress } from '../controllers/updatesController.js';

const router = express.Router();

router.post('/', createManga);
router.delete('/:_id', deleteManga);
router.put('/:_id', updateManga);
router.put('/:_id/finished', updateFinished);
router.put('/:_id/updateProgress', updateProgress);
router.get('/:urlName', getMangaByUrlName);
router.get('/:urlName/:chapter', getImageUrls);

export default router;
