import mongoose from 'mongoose';
import { logger } from '../logger';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string || 'mongodb+srv://prathamsahu051:pratham051@cluster0.g2s42sz.mongodb.net/node-otel?retryWrites=true&w=majority');
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.info('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;