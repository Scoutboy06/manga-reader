import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';

// @desc	Create add a new host
// @route	GET /api/image/*
const getImageFromUrl = asyncHandler(async (req, res) => {
	const imgUrl =
		(req.params['0'].startsWith('https://') ? '' : 'https://') +
		req.params['0'];

	const raw = await fetch(imgUrl);
	const blob = await raw.blob();
	const buf = await blob.arrayBuffer();

	res.status(200).send(Buffer.from(buf));
});

export { getImageFromUrl };
