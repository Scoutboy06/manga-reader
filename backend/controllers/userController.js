import asyncHandler from 'express-async-handler';
// import fetch from 'node-fetch';

import User from '../models/userModel.js';
import Manga from '../models/mangaModel.js';


// @desc	Create a new user
// @route	POST /users
export const createUser = asyncHandler(async (req, res) => {
	const user = new User(req.body);

	const createdUser = await user.save();
	res.status(201).json(createdUser);
});


// @desc	Delete a user
// @route	DELETE /users/:_id
// TODO: Remove all mangas in the user's library
export const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params._id);
	if (!user) throw new Error(404);

	const { deletedCount } = await Manga.deleteMany({ ownerId: user._id });

	await user.remove();
	res.status(200).json({ message: `User "${user.name}" with ${deletedCount} mangas was successfully deleted` });
});


// @desc	Update user
// @route	PUT /users/:userId
export const updateUser = asyncHandler(async (req, res) => {
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
export const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find();
	res.status(200).json(users);
});


// @desc	Get a user by id
// @route	GET /users/:userId
export const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.userId);

	if (user) res.status(200).json(user);
	else throw new Error(404);
});


// @desc	Get user's manga list
// @route	GET /users/:userId/mangas
export const getUserMangas = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	const user = await User.findById(userId);
	if (!user) res.status(400).json({ error: 'Not found' });

	const mangas = await Manga.find({ ownerId: user._id });
	res.status(200).json(mangas);
});
