import asyncHandler from 'express-async-handler';
// import fetch from 'node-fetch';
// import HTMLParser from 'node-html-parser';

import Host from '../models/hostModel.js';


// @desc	Get all hosts
// @route	GET /hosts
export const getAllHosts = asyncHandler(async (req, res) => {
	const hosts = await Host.find({});
	res.json(hosts);
})

// @desc	Create add a new host
// @route	POST /hosts
export const createHost = asyncHandler(async (req, res) => {
	const host = new Host(req.body);

	const createdHost = await host.save();
	res.status(201).json(createdHost);
});

// @desc	Get a host by it's id
// @route	GET /hosts/:hostId
export const getHostById = asyncHandler(async (req, res) => {
	const { hostId } = req.params;
	const host = await Host.findById(hostId);
	if (!host) {
		res.status(404);
		throw new Error('No host found');
	}
	res.json(host);
});
