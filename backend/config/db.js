import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// console.log(process.env.MONGO_URI);


const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://Elias:5gu!B%409SV!@cluster0.xo75c.mongodb.net/manga_reader_db?retryWrites=true&w=majority&keepAlive=true&socketTimeoutMS=360000&connectTimeoutMS=360000' , { // process.env.MONGO_URI
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