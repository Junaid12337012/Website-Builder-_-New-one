import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiCheck, FiGithub } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { setToken, getToken } from '../lib/auth';

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

const PasswordRequirement = ({ meets, children }) => (
  <motion.div 
    className="flex items-center mt-2 text-sm"
    variants={itemVariants}
  >
    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-2 ${meets ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
      {meets ? <FiCheck className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
    </div>
    <span className={meets ? 'text-gray-700' : 'text-gray-500'}>{children}</span>
  </motion.div>
);

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  // Redirect if already logged in
  useEffect(() => {
    if (getToken()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  // Password validation
  const hasMinLength = form.password.length >= 8;
  const hasNumber = /\d/.test(form.password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(form.password);
  const hasUppercase = /[A-Z]/.test(form.password);
  const passwordsMatch = form.password === form.confirmPassword;

  const isFormValid = 
    form.name && 
    form.email && 
    form.password && 
    hasMinLength && 
    hasNumber && 
    hasSpecialChar && 
    hasUppercase && 
    passwordsMatch;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (error) setError('');
  };

  const onBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setLoading(true);
    setError('');
    
    try {
      const { data } = await api.post('/auth/signup', {
        name: form.name,
        email: form.email,
        password: form.password
      });
      
      setToken(data.token);
      
      // Redirect to the previous page or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    // Implement social signup redirection
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex pt-20 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <motion.div 
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-blue-100 mt-1">Join thousands of creators today</p>
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

          <motion.form onSubmit={handleSubmit} className="space-y-5" variants={containerVariants}>
            {/* Name Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={onChange}
                  onBlur={() => onBlur('name')}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    touched.name && !form.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="John Doe"
                />
              </div>
              {touched.name && !form.name && (
                <p className="mt-1 text-sm text-red-600">Name is required</p>
              )}
            </motion.div>

            {/* Email Field */}
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
                  onBlur={() => onBlur('email')}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="you@example.com"
                />
              </div>
              {touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
                <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={onChange}
                  onBlur={() => onBlur('password')}
                  className={`block w-full pl-10 pr-10 py-2.5 border ${
                    touched.password && form.password && !(hasMinLength && hasNumber && hasSpecialChar && hasUppercase) 
                      ? 'border-red-300' 
                      : 'border-gray-300'
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* Password Requirements */}
              <div className="mt-2">
                <PasswordRequirement meets={hasMinLength}>
                  At least 8 characters
                </PasswordRequirement>
                <PasswordRequirement meets={hasUppercase}>
                  At least one uppercase letter
                </PasswordRequirement>
                <PasswordRequirement meets={hasNumber}>
                  At least one number
                </PasswordRequirement>
                <PasswordRequirement meets={hasSpecialChar}>
                  At least one special character
                </PasswordRequirement>
              </div>
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={form.confirmPassword}
                  onChange={onChange}
                  onBlur={() => onBlur('confirmPassword')}
                  className={`block w-full pl-10 pr-10 py-2.5 border ${
                    touched.confirmPassword && form.confirmPassword && !passwordsMatch 
                      ? 'border-red-300' 
                      : 'border-gray-300'
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {touched.confirmPassword && form.confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </motion.div>

            {/* Terms and Conditions */}
            <motion.div variants={itemVariants} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                  isFormValid 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                    : 'bg-gray-300 cursor-not-allowed'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <FiArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </motion.div>
          </motion.form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
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
                  onClick={() => handleSocialSignup('google')}
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
                  onClick={() => handleSocialSignup('github')}
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
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              state={{ from: location.state?.from }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
