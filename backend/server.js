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


dotenv.config();

connectDB();

const app = express();
// const router = express.Router();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use('/api/manga', mangaRoutes);
app.use('/api/single', singleRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/image', imageRoutes);

app.get('/api/getUpdates', getSubscribedUpdates);


const __dirname = path.resolve();

// app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) =>
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
);

app.get('/:urlName/:chapter', (req, res) =>
  res.sendFile(path.resolve(__dirname, 'client', 'page.html'))
);


app.use(notFound);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);