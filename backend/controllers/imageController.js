import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';

// @desc	Create add a new host
// @route	GET /image/*
const getImageFromUrl = asyncHandler(async (req, res) => {
	const imgUrl =
		(req.params['0'].startsWith('https://') ? '' : 'https://') +
		req.params['0'];

	const blob = await fetch(imgUrl).then(res => res.blob());
	const buf = await blob.arrayBuffer();

	res.status(200).send(Buffer.from(buf));
});

export { getImageFromUrl };
