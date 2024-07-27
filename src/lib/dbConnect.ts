import mongoose from "mongoose";

type ConnectionType = {
  isConnected?: number;
};
const connectionObject: ConnectionType = {};

const dbConnet = async () => {
  if (connectionObject.isConnected) {
    return console.log("DB already Connected");
  }
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI!);
    connectionObject.isConnected = connect.connections[0].readyState;
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("Error in DB Connection", error);
    // Graceful exit in case of a connection error
    process.exit(1);
  }
};
export default dbConnet;
