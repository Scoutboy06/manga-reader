import asyncHandler from 'express-async-handler';
// import fetch from 'node-fetch';
// import HTMLParser from 'node-html-parser';

import Host from '../models/hostModel.js';

// @desc	Create add a new host
// @route	POST /api/host/createHost
const createHost = asyncHandler(async (req, res) => {
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

// @desc	Get a host by its name (domain)
// @route	GET /api/host/:hostName
const getHostByName = asyncHandler(async (req, res) => {
	const { hostName } = req.params;

	Host.findOne({ hostName }, (err, doc) => {
		if (err) {
			res.status(404);
			throw new Error("Couldn't find host : " + hostName);
		} else {
			res.status(200).json(doc);
		}
	});
});

export { createHost, getHostByName };
