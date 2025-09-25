// server/src/routes/auth.js
import { Router } from 'express'
import User from '../models/User.js'
import { signToken } from '../utils/jwt.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/auth/me - Get current user
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email
    })
  } catch (err) {
    console.error('Error fetching user:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', { ...req.body, password: req.body.password ? '***' : undefined });
    
    // Destructure and validate input
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      console.log('Missing fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ 
        message: 'All fields are required',
        received: {
          name: !!name,
          email: !!email,
          password: !!password
        }
      });
    }

    // Check if user exists
    const existing = await User.findOne({ email })
    if (existing) {
      console.log('Email already in use:', email)
      return res.status(409).json({ message: 'Email already in use' })
    }

    // Create user
    const passwordHash = await User.hashPassword(password)
    const user = await User.create({ name, email, passwordHash })
    
    // Generate token with user ID in the payload
    const token = signToken(user._id)
    console.log('User created successfully:', user.email)
    console.log('Generated token for new user ID:', user._id)
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      } 
    })
    
  } catch (err) {
    console.error('Signup error:', {
      message: err.message,
      stack: err.stack,
      name: err.name,
      ...(err.errors && { errors: Object.values(err.errors).map(e => e.message) })
    });
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages,
        fieldErrors: Object.keys(err.errors).reduce((acc, key) => ({
          ...acc,
          [key]: err.errors[key].message
        }), {})
      });
    }
    
    // Handle duplicate key errors (e.g., duplicate email)
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'Email already in use',
        field: 'email'
      });
    }
    
    // For all other errors
    res.status(500).json({ 
      message: 'Server error during signup',
      ...(process.env.NODE_ENV === 'development' && {
        error: err.message,
        stack: err.stack
      })
    })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    console.log('=== Login Request ===');
    console.log('Headers:', req.headers);
    
    // Log request body with password masked
    const requestBody = { ...req.body };
    if (requestBody.password) {
      requestBody.password = '***';
    }
    console.log('Request body:', requestBody);
    
    // Validate request body
    if (!req.body) {
      console.error('No request body received');
      return res.status(400).json({ 
        message: 'Request body is required',
        received: false
      });
    }
    
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      const error = 'Missing credentials';
      console.error(error, { 
        email: email ? 'present' : 'missing', 
        password: password ? 'present' : 'missing' 
      });
      return res.status(400).json({ 
        message: 'Email and password are required',
        received: {
          email: !!email,
          password: !!password
        }
      });
    }
    
    console.log('Looking for user with email:', email);
    
    // Find user
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ 
        message: 'Invalid credentials',
        error: 'User not found'
      });
    }
    
    console.log('User found, verifying password...');
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ 
        message: 'Invalid credentials',
        error: 'Incorrect password'
      });
    }
    
    console.log('Password verified, generating token...');
    
    // Generate token with user ID in the payload
    const token = signToken(user._id);
    console.log('Login successful for user:', user.email);
    
    // Prepare user data to send back (exclude sensitive information)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      // Add any other non-sensitive user fields here
    };
    console.log('Generated token for user ID:', user._id);
    
    // Send response with token and user data
    res.json({
      success: true,
      token,
      user: userResponse,
      message: 'Login successful'
    });
    
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }
})

export default router