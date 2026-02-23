import mongoose from 'mongoose';

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL!);
        console.log("Database connected successfully");

        const connection = mongoose.connection;
         
         connection.on('connected', () => {
            console.log("Database connected successfully");
        });


        connection.on('error', (err) => {
            console.log("Database connection error:", err);
        });

    } catch (error) {
        console.log("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export { connect };