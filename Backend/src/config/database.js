import mongoose from "mongoose"; // import mongoose from mongoose package

// MongoDB Atlas connection
const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error("DB connection failed!", error);
        process.exit(1);
    }
};

export default connectDB;