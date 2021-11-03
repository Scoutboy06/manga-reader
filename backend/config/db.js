import mongoose from 'mongoose';
import dotenv from 'dotenv';

// dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// console.log(process.env.MONGO_URI);


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI , {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      // useCreateIndex: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    // console.error(err);
    process.exit(1);
  }
};

export default connectDB;