import { Router } from 'express';
import hostRouter from './controllers/hostController.js';
import mangaRouter from './controllers/mangaController.js';
import userRouter from './controllers/userController.js';
import animeRouter from './controllers/animeController.js';

const router = Router();

router.use(hostRouter);
router.use(userRouter);
router.use(mangaRouter);
router.use(animeRouter);

export default router;
