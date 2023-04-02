import { Router, Request, Response } from 'express';
import handler from 'express-async-handler';

import Host from '../models/hostModel.js';

const router = Router();

// @desc	Get all hosts
// @route	GET /hosts
router.get(
	'/hosts',
	handler(async (req: Request, res: Response) => {
		const { limit = 50, skip = 0, query = '' } = req.query;
		const hosts = await Host.find({
			name: {
				$regex: query,
				$options: 'i',
			},
		})
			.limit(Number(limit))
			.skip(Number(skip));
		res.json(hosts);
	})
);

// @desc	Create add a new host
// @route	POST /hosts
router.post(
	'/hosts',
	handler(async (req: Request, res: Response) => {
		const host = new Host(req.body);
		const createdHost = await host.save();
		res.status(201).json(createdHost);
	})
);

// @desc	Get a host by it's id
// @route	GET /hosts/:hostId
router.get(
	'/hosts/:hostId',
	handler(async (req: Request, res: Response) => {
		const { hostId } = req.params;
		const host = await Host.findById(hostId);
		res.json(host);
	})
);

export default router;
