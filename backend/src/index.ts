import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import chalk from 'chalk';

import connectDB from './lib/mongoDB.js';
// import updatesChecker from './lib/updatesChecker.js';
import router from './router.js';

const { PORT = 8000, NODE_ENV = 'development' } = process.env;

const app = express();
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '.env.local') });

if (NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use(router);

app.listen(PORT, async () => {
  console.clear();
  console.log(chalk.green(`API running in ${NODE_ENV} mode on port ${PORT}`));

  // connectDB();

  // If "--no-updates" is NOT specified in the command arguments
  // if (!process.argv.find(arg => arg === '--no-updates')) updatesChecker();
});
