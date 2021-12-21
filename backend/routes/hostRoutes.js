import express from 'express';
import { createHost, getHostByName } from '../controllers/hostController.js';

const router = express.Router();

router.post('/', createHost);

router.get('/:hostName', getHostByName);

export default router;
