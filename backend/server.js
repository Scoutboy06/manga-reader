import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import mangaRoutes from './routes/mangaRoutes.js';
import hostRoutes from './routes/hostRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import singleRoutes from './routes/singleRoutes.js';
import { getSubscribedUpdates } from './controllers/updatesController.js';


const __dirname = path.resolve();
dotenv.config({ path: '.env' });

connectDB();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use('/api/manga', mangaRoutes);
app.use('/api/single', singleRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/image', imageRoutes);

app.get('/api/getUpdates', getSubscribedUpdates);


if(process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'build')));
}


app.use(notFound);

app.use(errorHandler);


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});