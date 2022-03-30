import asyncHandler from 'express-async-handler';
// import fetch from 'node-fetch';

import User from '../models/userModel.js';
import Manga from '../models/mangaModel.js';


// @desc	Create a new user
// @route	POST /api/users
export const createUser = asyncHandler(async (req, res) => {
	const user = new User(req.body);

	const createdUser = await user.save();
	res.status(201).json(createdUser);
});


// @desc	Delete a user
// @route	DELETE /api/users/:_id
// TODO: Remove all mangas in the user's library
export const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params._id);
	if (!user) throw new Error(404);

	const { deletedCount } = await Manga.deleteMany({ ownerId: user._id });

	await user.remove();
	res.status(200).json({ message: `User "${user.name}" with ${deletedCount} mangas was successfully deleted` });
});


// @desc	Update user
// @route	PUT /api/users/:_id
export const updateUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params._id);

	if (!user) throw new Error(404);

	for (const key of Object.keys(req.body)) {
		user[key] = req.body[key];
	}

	await user.save();
	res.status(200).json(user);
});


// @desc	Get all users
// @route GET /api/users
export const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find();
	res.status(200).json(users);
});


// @desc	Get all user's data
// @route	GET /api/users/:_id
export const getUserData = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params._id);

	if (user) res.status(200).json(user);
	else throw new Error(404);
});


// @desc	Get user's manga list
// @route	GET /api/users/:_id/mangas
export const getUserMangas = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params._id);
	if (!user) throw new Error(404);

	const mangas = await Manga.find({ ownerId: user._id });
	res.status(200).json(mangas);
});
