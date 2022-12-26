export const notFound = (req, res, next) => {
	res.status(404);
	res.json({ message: `Not Found - ${req.originalUrl}` });
};

export const errorCatcher = (err, req, res, next) => {
	const code = res.statusCode !== 200
		? res.statusCode
		: 500;

	res.status(code).json({
		message: err.message,
		stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
	});
}