import express from 'express';
import {
	createSingle,
	getSingleByUrlName,
	deleteSingle,
	getImageUrls,
	updateProgress,
	getAllSingles,
} from '../controllers/singleController.js';

const router = express.Router();

router.route('/').post(createSingle).get(getAllSingles);

router.route('/:urlName').get(getSingleByUrlName).delete(deleteSingle);

router.post('/updateProgress', updateProgress);

router.get('/:urlName/:chapter', getImageUrls);

export default router;
