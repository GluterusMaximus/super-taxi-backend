import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/connectDB.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import initLogger from './logger/index.js'

dotenv.config()
export const logger = initLogger()
connectDB()

const app = express()

app.use(express.json())
app.use(cors())
app.use((req, _res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`)
  next()
})

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)

if (process.env.NODE_ENV === 'development') {
  app.get('/', (_req, res) => {
    res.send('API is running...')
  })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  // @ts-expect-error works fine, ts throws an error for some reason
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
)
