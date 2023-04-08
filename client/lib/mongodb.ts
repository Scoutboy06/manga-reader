import { connect } from 'mongoose';

if (!process.env.MONGO_URI) {
	throw new Error('Please add your MongoDB URI to .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		cached.promise = await connect(process.env.MONGO_URI || '', {
			bufferCommands: false,
		});
	}

	try {
		cached.conn = await cached.promise;
	} catch (err) {
		cached.promise = null;
		throw err;
	}

	return cached.conn;
}
