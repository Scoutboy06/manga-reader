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
	const {
		hostName,
		path,
		imgSelector,
		detailsPage,
		coverSelector,
		search,
		needProxy,
	} = req.body;

	const host = new Host({
		hostName,
		path,
		imgSelector,
		detailsPage,
		coverSelector,
		search,
		needProxy,
	});

	const createdHost = await host.save();
	res.status(201).json(createdHost);
});

// @desc	Get a host by it's id
// @route	GET /hosts/:hostId
export const getHostById = asyncHandler(async (req, res) => {
	const { hostId } = req.params;
	const host = await Host.findById(hostId);
	if (!host) return res.status(404).json({ error: 'Not found' });
	res.json(host);
});
