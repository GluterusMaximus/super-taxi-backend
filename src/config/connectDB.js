import mongoose from 'mongoose'
import { logger } from '../server.js'

async function connectDB() {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI ?? '')
    logger.info(`MongoDB connected: ${connect.connection.host}`)
  }
  catch (error) {
    logger.error(error.message)
    process.exit(1)
  }
}
export default connectDB
