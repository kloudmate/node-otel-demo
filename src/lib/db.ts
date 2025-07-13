import mongoose from 'mongoose';
import { logger } from '../logger';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.info('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;