import handler from 'express-async-handler';

import User from '../models/userModel.js';

export default handler(async (req, res, next) => {
	const { userId } = req.params;

	const user = await User.findById(userId);

	if (!user.isAdmin) {
		res.status(403);
		throw new Error('Not authorized');
	}

	next();
});