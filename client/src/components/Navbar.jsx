import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiMenu, 
  FiX, 
  FiChevronDown, 
  FiChevronRight,
  FiExternalLink, 
  FiSearch, 
  FiArrowRight,
  FiUser,
  FiLogOut,
  FiSettings,
  FiHelpCircle,
  FiMessageSquare,
  FiLayers,
  FiGrid,
  FiCode,
  FiLayout,
  FiImage,
  FiShoppingCart
} from 'react-icons/fi';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

// Custom hook for hover intent
export const useHoverIntent = (ref, { onHover, onLeave, timeout = 300 }) => {
  const timerRef = useRef(null);
  
  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onHover();
  };
  
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      onLeave();
    }, timeout);
  };
  
  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener('mouseenter', handleMouseEnter);
      node.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        node.removeEventListener('mouseenter', handleMouseEnter);
        node.removeEventListener('mouseleave', handleMouseLeave);
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [ref, onHover, onLeave, timeout]);
};

const NavItem = ({ children, isActive, hasDropdown, onMouseEnter, onMouseLeave, isHighlighted }) => {
  return (
    <div 
      className="relative h-full flex  items-center group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`relative px-4 py-3 text-sm font-medium transition-all duration-300 ${
        isActive 
          ? 'text-white' 
          : isHighlighted 
            ? 'bg-blue-600 text-white hover:bg-blue-700 rounded-lg mx-1'
            : 'text-gray-300 hover:text-white'
      }`}>
        <span className="flex items-center">
          {children}
          {hasDropdown && (
            <FiChevronDown className="ml-1.5 inline-block w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
          )}
        </span>
        
        {/* Animated underline effect */}
        {!isHighlighted && (
          <motion.span 
            className="absolute bottom-2 left-1/2 w-0 h-0.5 bg-white"
            initial={{ width: 0, x: '-50%' }}
            whileHover={{ width: 'calc(100% - 2rem)', x: '-50%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        )}
      </div>
    </div>
  );
};

const Dropdown = ({ isOpen, onMouseEnter, onMouseLeave, type = 'default' }) => {
  if (!isOpen) return null;
  
  // Features Dropdown Content
  const featuresItems = [
    { icon: <FiLayers className="w-5 h-5 text-blue-500" />, title: 'Drag & Drop', description: 'Intuitive builder with real-time preview' },
    { icon: <FiGrid className="w-5 h-5 text-purple-500" />, title: 'Templates', description: '100+ responsive templates' },
    { icon: <FiCode className="w-5 h-5 text-green-500" />, title: 'Custom Code', description: 'Add your own HTML/CSS/JS' },
    { icon: <FiLayout className="w-5 h-5 text-orange-500" />, title: 'Layouts', description: 'Pre-built sections and layouts' },
  ];

  // Learn Dropdown Content
  const learnItems = [
    { icon: <FiMessageSquare className="w-5 h-5 text-blue-500" />, title: 'Documentation', description: 'Comprehensive guides and API reference' },
    { icon: <FiHelpCircle className="w-5 h-5 text-purple-500" />, title: 'Tutorials', description: 'Step-by-step video tutorials' },
    { icon: <FiLayers className="w-5 h-5 text-green-500" />, title: 'Templates', description: 'Ready-to-use website templates' },
    { icon: <FiCode className="w-5 h-5 text-orange-500" />, title: 'API Reference', description: 'Integration and customization' },
  ];

  // Resources Dropdown Content
  const resourcesItems = [
    { icon: <FiMessageSquare className="w-5 h-5 text-blue-500" />, title: 'Blog', description: 'Latest updates and articles' },
    { icon: <FiHelpCircle className="w-5 h-5 text-purple-500" />, title: 'Help Center', description: 'Find answers and support' },
    { icon: <FiLayers className="w-5 h-5 text-green-500" />, title: 'Community', description: 'Join our community forum' },
    { icon: <FiCode className="w-5 h-5 text-orange-500" />, title: 'Webinars', description: 'Live and on-demand sessions' },
  ];

  const renderDropdownContent = () => {
    switch(type) {
      case 'features':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuresItems.map((item, index) => (
              <div key={index} className="group p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors duration-200">
                  {item.icon}
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
                <div className="mt-3 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Learn more <FiChevronRight className="ml-1 w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        );
      case 'learn':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Learning Resources</h3>
              <div className="space-y-4">
                {learnItems.map((item, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="flex items-start p-3 -mx-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
                        {item.icon}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-gray-900">{item.title}</h4>
                      <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                    </div>
                    <FiChevronRight className="ml-auto w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </a>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Start Building Today</h3>
              <p className="text-gray-600 mb-6">Create your first website in minutes with our easy-to-use tools and templates.</p>
              <div className="space-y-3">
                <a 
                  href="#" 
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200"
                >
                  <span className="font-medium">Get Started Guide</span>
                  <FiArrowRight className="w-4 h-4 text-gray-400" />
                </a>
                <a 
                  href="#" 
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200"
                >
                  <span className="font-medium">Watch Tutorial</span>
                  <FiArrowRight className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Resources</h3>
              <div className="space-y-3">
                {resourcesItems.map((item, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="flex items-center p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-200">
                        {item.icon}
                      </div>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Templates</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Portfolio', 'Business', 'Blog', 'E-commerce', 'Landing Page', 'More...'].map((item, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors duration-200 group"
                  >
                    <div className="w-full h-16 bg-gray-100 rounded mb-2 group-hover:bg-white transition-colors duration-200"></div>
                    <span className="text-sm font-medium text-gray-700">{item}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Start Building</h3>
              <p className="text-blue-100 mb-6">Create your website today with our easy-to-use website builder.</p>
              <div className="space-y-3">
                <a 
                  href="#" 
                  className="block w-full text-center px-4 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-opacity-90 transition-opacity duration-200"
                >
                  Get Started - It's Free
                </a>
                <a 
                  href="#" 
                  className="block text-center text-sm font-medium text-blue-100 hover:text-white transition-colors duration-200"
                >
                  Schedule a Demo
                </a>
              </div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <motion.div 
      className="absolute left-0 right-0 top-full bg-white shadow-2xl rounded-b-2xl border-t border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.99 }}
      transition={{ 
        duration: 0.2, 
        ease: [0.16, 1, 0.3, 1],
        scale: { duration: 0.15 }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        transformOrigin: 'top center',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderDropdownContent()}
      </div>
    </motion.div>
  );
};

// Helper functions for user data
const getUserInitials = () => {
  // In a real app, get from auth context or API
  return 'U';
};

const getUserName = () => {
  // In a real app, get from auth context or API
  return 'User Name';
};

const getUserEmail = () => {
  // In a real app, get from auth context or API
  return 'user@example.com';
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const searchRef = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(navRef, { once: true });
  
  // Close dropdown when pressing Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setSearchOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Navigation items
  const navItems = [
    { 
      name: 'Features', 
      path: '/#features', 
      hasDropdown: true,
      type: 'features'
    },
    { 
      name: 'Templates', 
      path: '/templates',
      hasDropdown: true
    },
    { 
      name: 'Pricing', 
      path: '/pricing' 
    },
    { 
      name: 'Learn', 
      path: '/learn', 
      hasDropdown: true,
      type: 'learn'
    },
    { 
      name: 'Resources', 
      hasDropdown: true,
      type: 'resources'
    }
  ];

  // User authentication state is now managed by AuthContext

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Animate in on mount
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = (itemName) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <header 
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md shadow-xl border-b border-gray-800' 
          : 'bg-gradient-to-b from-gray-900 to-gray-900/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                WebCraft
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center h-full">
            <motion.div 
              className="flex h-full"
              initial="hidden"
              animate={controls}
              variants={containerVariants}
            >
              {navItems.map((item) => (
                <motion.div 
                  key={item.name}
                  variants={itemVariants}
                  className="h-full"
                >
                  <NavItem
                    isActive={location.pathname.startsWith(item.path) && !item.hasDropdown}
                    hasDropdown={item.hasDropdown}
                    onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                    onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
                  >
                    <button 
                      onClick={() => item.hasDropdown ? toggleDropdown(item.name) : navigate(item.path)}
                      className="flex items-center"
                    >
                      {item.name}
                    </button>
                  </NavItem>
                </motion.div>
              ))}
            </motion.div>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Search button */}
            <div className="relative" ref={searchRef}>
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <FiSearch className="w-5 h-5" />
              </button>
              
              {/* Search input */}
              <AnimatePresence>
                {searchOpen && (
                  <motion.div 
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-3 text-sm border-0 focus:ring-0"
                        autoFocus
                      />
                    </div>
                    {searchQuery && (
                      <div className="border-t border-gray-100 p-2 text-sm text-gray-500">
                        Search results for "{searchQuery}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              {isLoggedIn ? (
                <>
                  <NavLink
                    to="/dashboard"
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-gray-100 transition-colors"
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Log in
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all shadow-sm"
                  >
                    Get started
                  </NavLink>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <FiX className="w-5 h-5" />
                ) : (
                  <FiMenu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {activeDropdown === 'Learn' && (
          <Dropdown 
            isOpen={activeDropdown === 'Learn'}
            onMouseEnter={() => setActiveDropdown('Learn')}
            onMouseLeave={() => setActiveDropdown(null)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <div key={`mobile-${item.name}`} className="border-b border-gray-100">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `block px-3 py-3 text-base font-medium ${
                      isActive 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    } rounded-lg transition-colors`}
                  >
                    <div className="flex items-center justify-between">
                      {item.name}
                      {item.hasDropdown && (
                        <FiChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </NavLink>
                </div>
              ))}
              
              <div className="pt-4 space-y-3">
                {isLoggedIn ? (
                  <>
                    <NavLink
                      to="/dashboard"
                      className="block w-full text-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Dashboard
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className="block w-full text-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Log in
                    </NavLink>
                    <NavLink
                      to="/signup"
                      className="block w-full text-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all shadow-sm"
                    >
                      Get started
                    </NavLink>
                  </>
                )}
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-center space-x-6">
                  <a href="#" className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">GitHub</span>
                    <FiGithub className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Twitter</span>
                    <FiTwitter className="h-6 w-6" />
                  </a>
                </div>
                <p className="mt-4 text-center text-sm text-gray-500">
                  &copy; {new Date().getFullYear()} WebCraft. All rights reserved.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
