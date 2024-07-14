import mongoose from "mongoose"
import constant from "./constant.js"

const { MONGO_URL } = constant

const connectDB = async () => {
  try {
    console.log("MongoDB connecting")
    const conn = await mongoose.connect(MONGO_URL)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(error)
    console.log(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
