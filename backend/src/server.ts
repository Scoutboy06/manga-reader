import path from 'path';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import fetch from 'node-fetch';
import chalk from 'chalk';

import connectDB from './config/db.js';
import { notFound, errorCatcher } from './middleware/errorMiddleware.js';
import updatesChecker from './functions/updatesChecker.js';

import router from './router.js';

const app = express();
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '.env.local') });

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use(express.json());
app.use(cors());

app.use(router);

app.use('/tmdb/*', async (req: Request, res: Response) => {
	const data = await fetch(
		`https://api.themoviedb.org/3/${req.params[0]}?` +
			new URLSearchParams({
				api_key: process.env.TMDB_V3_API_KEY,
				...req.query,
			})
	).then(res => res.json());

	res.json(data);
});

app.use(errorCatcher);
app.use(notFound);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.clear();
	console.log(
		chalk.green(`API running in ${process.env.NODE_ENV} mode on port ${PORT}`)
	);

	connectDB();

	// If "--no-updates" is NOT specified in the command input
	if (!process.argv.find(arg => arg === '--no-updates')) updatesChecker();
});
