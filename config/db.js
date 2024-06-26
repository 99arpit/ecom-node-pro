// import mongoose from "mongoose";
// import colors from 'colors'
// import dotenv from 'dotenv';

// // Load environment variables from .env file
// dotenv.config();

// const connect = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URL)
//         console.log(`mongodb connected ${mongoose.connection.host}`);
//     } catch (error) {
//         console.log(`mongodb error ${error}`.bgRed.white)
//     }

// };

// export default connect;

import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000 // Optional: Increase the timeout to 30 seconds
    });
    console.log(`MongoDB connected: ${mongoose.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`.bgRed.white);
    process.exit(1); // Exit the process with failure
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB'.green);
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connection error: ${err}`.bgRed.white);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected'.yellow);
});

export default connectDB;
