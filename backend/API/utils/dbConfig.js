const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

const connectDb = async () => {
  try {
    const coon = await mongoose.connect(uri);
    console.log(`MongoDb connected to the host: ${coon.connection.host}`);
  } catch (error) {
    console.error("MongoDb connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDb;
