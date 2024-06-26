import mongoose from "mongoose";
import colors from 'colors'
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`mongodb connected ${mongoose.connection.host}`);
    } catch (error) {
        console.log(`mongodb error ${error}`.bgRed.white)
    }

};

export default connect;