import express from 'express';
import {
	createUser,
	deleteUser,
	updateUser,
	getAllUsers,
	getUserData,
	getUserMangas,
} from '../controllers/userController.js';


const router = express.Router();

router.route('/')
	.get(getAllUsers)
	.post(createUser);
router.route('/:_id')
	.get(getUserData)
	.put(updateUser)
	.delete(deleteUser);
router.get('/:_id/mangas', getUserMangas);


export default router;