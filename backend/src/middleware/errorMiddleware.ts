import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response) => {
	res.status(404);
	res.json({ message: `Not Found - ${req.originalUrl}` });
};

export const errorCatcher = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const code = res.statusCode !== 200 ? res.statusCode : 500;

	res.status(code).json({
		message: err.message,
		stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
	});
};
