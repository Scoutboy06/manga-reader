import { Router } from 'express';
import hostRouter from './controllers/hostController.js';
import mangaRouter from './controllers/mangaController.js';
import searchRouter from './controllers/searchController.js';
import userRouter from './controllers/userController.js';
import animeRouter from './controllers/animeController.js';

const router = Router();

router.use(hostRouter);
router.use(userRouter);
router.use(mangaRouter);
router.use(animeRouter);
router.use(searchRouter);

export default router;