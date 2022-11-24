export const notFound = (req, res, next) => {
	res.status(404);
	res.json({ message: `Not Found - ${req.originalUrl}` });
};

export const errorCatcher = (req, res, next) => {
	try {
		next();
	} catch (err) {
		res.status(res.statusCode || 500);
		res.json({
			message: err.message,
			stack: process.env.NODE_ENV === 'production' ? null : err.stack,
		});
	}
}