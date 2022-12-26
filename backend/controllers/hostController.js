import { Router } from 'express';

import Host from '../models/hostModel.js';

const router = Router();


// @desc	Get all hosts
// @route	GET /hosts
router.get('/hosts', async (req, res) => {
	const hosts = await Host.find({});
	res.json(hosts);
})

// @desc	Create add a new host
// @route	POST /hosts
router.post('/hosts', async (req, res, next) => {
	const host = new Host(req.body);

	const createdHost = await host.save().catch(err => {
		res.status(400);
		next(err);
	});

	if (createdHost) res.status(201).json(createdHost);
});

// @desc	Get a host by it's id
// @route	GET /hosts/:hostId
router.get('/hosts/:hostId', async (req, res, next) => {
	const { hostId } = req.params;
	const host = await Host.findById(hostId).catch(err => {
		res.status(404);
		next(err);
	});

	if (host) res.json(host);
});


export default router;