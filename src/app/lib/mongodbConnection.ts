import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

console.log("MONGODB_URI:", MONGODB_URI ? "Found" : "Not found"); // Add this

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined.");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

async function connectMongoDB() {
  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Creating new MongoDB connection...");
    cached.promise = mongoose
      .connect(MONGODB_URI!, {
        dbName: "sifthr-database",
      })
      .then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectMongoDB;
