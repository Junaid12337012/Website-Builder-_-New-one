import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiGithub, FiPhone, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('email');
  const [showPassword, setShowPassword] = useState(false);

  const { user, login } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    }
  }, [user, navigate, location]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting login with:', { email: form.email, password: '***' });
      
      // Call the login function from AuthContext with email and password
      await login(form.email, form.password);
      
      // If login is successful, redirect to the previous page or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      console.log('Login successful, redirecting to:', from);
      navigate(from, { replace: true });
      
    } catch (err) {
      console.error('Login error in handleSubmit:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Implement social login redirection
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <motion.div 
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-blue-100 mt-1">Sign in to your account</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            className={`flex-1 py-4 px-2 text-center font-medium text-sm transition-colors ${activeTab === 'email' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('email')}
          >
            <FiMail className="inline-block mr-2" />
            Email
          </button>
          <button
            className={`flex-1 py-4 px-2 text-center font-medium text-sm transition-colors ${activeTab === 'phone' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('phone')}
          >
            <FiPhone className="inline-block mr-2" />
            Phone
          </button>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8">
          {error && (
            <motion.div 
              className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </motion.div>
          )}

          {activeTab === 'email' ? (
            <motion.form onSubmit={handleSubmit} className="space-y-5" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={onChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={form.password}
                    onChange={onChange}
                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <FiArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </motion.div>
            </motion.form>
          ) : (
            <motion.div 
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <button
                type="button"
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Send verification code
                <FiArrowRight className="ml-2 h-4 w-4" />
              </button>
            </motion.div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.28426 53.749 C -8.52496 55.059 -9.24099 56.159 -10.1301 56.859 L -10.1301 60.188 L -6.27534 60.188 C -3.94991 57.984 -3.264 55.024 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.80446 62.159 -6.72534 60.188 L -10.1301 56.859 C -11.2001 57.769 -12.624 58.309 -14.254 58.309 C -17.244 58.309 -19.784 56.349 -20.724 53.629 L -24.694 53.629 L -24.694 57.068 C -22.664 61.019 -19.004 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -20.724 53.629 C -21.104 52.519 -21.334 51.339 -21.334 50.129 C -21.334 48.909 -21.104 47.739 -20.694 46.629 L -20.694 43.199 L -24.654 43.199 C -25.894 45.629 -26.504 48.309 -26.504 51.129 C -26.504 53.949 -25.894 56.629 -24.654 59.059 L -20.724 53.629 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.514 43.989 -10.504 44.749 -8.85446 46.189 L -6.27496 43.619 C -8.24506 41.819 -11.204 40.009 -14.754 40.009 C -19.004 40.009 -22.664 42.239 -24.654 45.199 L -20.694 48.629 C -19.504 45.699 -17.224 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                  Google
                </button>
              </motion.div>
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiGithub className="w-5 h-5 mr-2" />
                  GitHub
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              state={{ from: location.state?.from }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
