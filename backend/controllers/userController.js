import { Router } from 'express';

import User from '../models/userModel.js';
import Manga from '../models/mangaModel.js';

const router = Router();


// @desc	Create a new user
// @route	POST /users
router.post('/users', async (req, res) => {
	const user = new User(req.body);

	const createdUser = await user.save();
	res.status(201).json(createdUser);
});


// @desc	Delete a user
// @route	DELETE /users/:_id
router.delete('/users/:_id', async (req, res) => {
	// TODO: Remove all mangas that the user owns
	const user = await User.findById(req.params._id);
	if (!user) throw new Error(404);

	const { deletedCount } = await Manga.deleteMany({ ownerId: user._id });

	await user.remove();
	res.status(200).json({ message: `User "${user.name}" with ${deletedCount} mangas was successfully deleted` });
});


// @desc	Update user
// @route	PATCH /users/:userId
router.patch('/users/:userId', async (req, res) => {
	const user = await User.findById(req.params.userId);

	if (!user) throw new Error(404);

	for (const key of Object.keys(req.body)) {
		user[key] = req.body[key];
	}

	await user.save();
	res.status(200).json(user);
});


// @desc	Get all users
// @route GET /users
router.get('/users', async (req, res) => {
	const users = await User.find();
	res.status(200).json(users);
});


// @desc	Get a user by id
// @route	GET /users/:userId
router.get('/users/:userId', async (req, res) => {
	const user = await User.findById(req.params.userId);

	if (user) res.status(200).json(user);
	else throw new Error(404);
});


// @desc	Get user's manga list
// @route	GET /users/:userId/mangas
router.get('/users/:userId/mangas', async (req, res) => {
	const { userId } = req.params;
	const user = await User.findById(userId);
	if (!user) res.status(400).json({ error: 'Not found' });

	const mangas = await Manga.find({ ownerId: user._id });
	res.status(200).json(mangas);
});


export default router;