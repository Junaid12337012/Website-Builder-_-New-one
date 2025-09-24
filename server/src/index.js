import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wb_mvp'

app.use(cors({ origin: ['http://localhost:5173'], credentials: false }))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)

// Connect DB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })
