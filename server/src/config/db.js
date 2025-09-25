import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      throw new Error('MongoDB connection string is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...'.yellow);
    console.log('Connection string:', process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`.red.underline.bold);
    console.error('Connection string used:', process.env.MONGO_URI);
    process.exit(1);
  }
};

export default connectDB;
