import { Router, Request, Response } from 'express';
import handler from 'express-async-handler';

import User from '../models/userModel.js';

const router = Router();

// @desc	Get all users
// @route GET /users
router.get(
	'/users',
	handler(async (req: Request, res: Response) => {
		const users = await User.find({}, { mangas: 0, animes: 0 });
		res.status(200).json(users);
	})
);

// @desc	Get a user by id
// @route	GET /users/:userId
router.get(
	'/users/:userId',
	handler(async (req: Request, res: Response) => {
		const user = await User.findById(req.params.userId);
		res.status(200).json(user);
	})
);

// @desc	Create a new user
// @route	POST /users
router.post(
	'/users',
	handler(async (req: Request, res: Response) => {
		const user = new User(req.body);
		const createdUser = await user.save();
		if (createdUser) res.status(201).json(createdUser);
	})
);

// @desc	Delete a user
// @route	DELETE /users/:_id
router.delete('/users/:_id', async (req: Request, res: Response) => {
	const status = await User.deleteOne({ _id: req.params._id });
	res.status(200).json(status);
});

// @desc	Update user
// @route	PATCH /users/:userId
router.patch('/users/:userId', async (req: Request, res: Response) => {
	const user = await User.findById(req.params.userId);

	for (const key of Object.keys(req.body)) {
		user[key] = req.body[key];
	}

	await user.save();
	res.status(200).json(user);
});

export default router;
