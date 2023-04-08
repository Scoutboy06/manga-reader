import mongoose from 'mongoose';
import chalk from 'chalk';

const connectDB = async () => {
	try {
		const { MONGO_URI } = process.env;
		if (!MONGO_URI) {
			throw new Error('Please add your MongoDB URI to .env.local');
		}

		mongoose.set('strictQuery', false);

		const conn = await mongoose.connect(MONGO_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			// useCreateIndex: true,
		} as mongoose.ConnectOptions);

		console.log(chalk.green(`MongoDB Connected: ${conn.connection.host}`));
		return conn;
	} catch (err) {
		console.error(`Error: ${err.message}`);
		process.exit(1);
	}
};

export default connectDB;
