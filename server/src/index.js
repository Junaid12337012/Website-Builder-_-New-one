import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import errorHandler from './middleware/error.js';
import connectDB from './config/db.js';

// Import routes
import auth from './routes/auth.js';
import projects from './routes/projects.js';

// Load env vars with explicit path
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the .env file
const envPath = path.resolve(process.cwd(), '.env');
console.log('Looking for .env file at:', envPath);

// Check if .env file exists
if (fs.existsSync(envPath)) {
  console.log('.env file found, loading environment variables...');
  dotenv.config({ path: envPath });
  
  // Log all environment variables (for debugging, remove in production)
  console.log('Environment variables loaded successfully');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log('MONGO_URI:', process.env.MONGO_URI ? '*****' : 'Not set');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? '*****' : 'Not set');
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'Not set');
} else {
  console.error('ERROR: .env file not found at', envPath);
  console.error('Please make sure the .env file exists in the server root directory');
  process.exit(1);
}

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
const allowedOrigins = [
  'http://localhost:5173', // Vite default port
  'http://127.0.0.1:5173', // Vite default port (alternative)
  process.env.FRONTEND_URL
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/projects', projects);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});