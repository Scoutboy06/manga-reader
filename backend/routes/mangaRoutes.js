import express from 'express';
import {
	getMangaByUrlName,
	createManga,
	deleteManga,
	getImageUrls,
} from '../controllers/mangaController.js';

import { updateProgress } from '../controllers/updatesController.js';

const router = express.Router();

router.post('/', createManga);
router.delete('/:_id', deleteManga);
router.put('/:_id/updateProgress', updateProgress);
router.get('/:urlName', getMangaByUrlName);
router.get('/:urlName/:chapter', getImageUrls);

export default router;
