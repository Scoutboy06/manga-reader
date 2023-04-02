import { Request, Response, NextFunction } from 'express';
import handler from 'express-async-handler';

import User from '../models/userModel.js';

export default handler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { userId } = req.params;

		const user = await User.findById(userId);

		if (!user.isAdmin) {
			res.status(403);
			throw new Error('Not authorized');
		}

		next();
	}
);
