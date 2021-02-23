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
		querySelector,
		detailsPage,
		coverSelector,
	} = req.body;

	const host = new Host({
		hostName,
		path,
		querySelector,
		detailsPage,
		coverSelector,
	});

	const createdHost = await host.save();
	res.status(201).json(createdHost);
});




export {
	createHost,
}