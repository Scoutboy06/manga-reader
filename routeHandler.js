import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

// dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const app = express();

const { ROUTER_PORT, BACKEND_PORT, FRONTEND_PORT } = process.env;

app.use('/api/', createProxyMiddleware({ target: `http://127.0.0.1:${BACKEND_PORT}`, changeOrigin: true }));
app.use('/', createProxyMiddleware({ target: `http://127.0.0.1:${FRONTEND_PORT}`, changeOrigin: true }));

app.listen(ROUTER_PORT, () => {
	console.log(`ROUTER listening on port ${ROUTER_PORT}`);
	console.log(`BACKEND listening on port ${BACKEND_PORT}`);
	console.log(`FRONTEND listening on port ${FRONTEND_PORT}`);
});