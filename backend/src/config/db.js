import mongoose from 'mongoose';
import chalk from 'chalk';

const connectDB = async () => {
	try {
		mongoose.set('strictQuery', false);
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			// useCreateIndex: true,
		});

		console.log(chalk.green(`MongoDB Connected: ${conn.connection.host}`));
		return conn;
	} catch (err) {
		console.error(`Error: ${err.message}`);
		process.exit(1);
	}
};

export default connectDB;
