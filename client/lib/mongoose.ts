import mongoose, { connect, ConnectOptions } from 'mongoose';

interface Cached {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: Cached = global.mongoose;

if (!cached) {
	cached = { conn: null, promise: null };
	global.mongoose = cached;
}

export default async function connectDB(
	options: ConnectOptions = {
		bufferCommands: false,
	}
): Promise<typeof mongoose> {
	const uri = process.env.MONGO_URI;

	if (!uri) {
		throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
	}

	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		cached.promise = connect(uri, options);
	}

	try {
		cached.conn = await cached.promise;
		console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
	} catch (err) {
		cached.promise = null;
		throw err;
	}

	return cached.conn;
}
