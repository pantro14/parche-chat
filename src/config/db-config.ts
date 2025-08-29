import * as mongoose from 'mongoose';

const uri = process.env.MONGODB_URI as string;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('db connected');
  } catch (error) {
    console.log('db connection fail: ', error);
  }
};

export default connectMongoDB;
