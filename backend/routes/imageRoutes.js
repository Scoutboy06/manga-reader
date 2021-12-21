import express from 'express';
import { getImageFromUrl } from '../controllers/imageController.js';

const router = express.Router();

router.get('/*', getImageFromUrl);

export default router;
