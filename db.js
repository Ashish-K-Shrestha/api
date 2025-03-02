import mongoose from "mongoose";
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO);

    console.log(
      `MongoDB connected to : ${conn.connection.host}`.white.underline.bold
    );
  } catch (error) {
    console.error(`MongoDB connection error: ${error}`.red.underline.bold);
  }
};

module.exports = connectDB;
