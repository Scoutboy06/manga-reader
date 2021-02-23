import express from 'express';
import {
	createHost,
} from '../controllers/hostController.js';


const router = express.Router();


router.route('/')
	.post(createHost);


export default router;