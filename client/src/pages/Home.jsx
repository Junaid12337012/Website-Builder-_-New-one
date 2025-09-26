import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  FiArrowRight, FiCode, FiLayers, FiZap, FiCheckCircle, 
  FiGrid, FiCpu, FiGitBranch, FiGlobe, FiSmartphone, 
  FiServer, FiUsers, FiTrendingUp, FiShield, FiPieChart,
  FiStar, FiClock, FiAward, FiDownload, FiEye, FiHeart,
  FiDollarSign, FiCreditCard, FiCheck, FiX, FiZap as FiBolt,
  FiMenu, FiX as FiXIcon, FiChevronDown, FiChevronUp, FiSearch
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Custom hook for responsive design
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};

// Sample testimonial data
const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Freelance Designer',
    content: 'This website builder has completely transformed how I work. I can now deliver professional websites to my clients in half the time!',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    name: 'Michael Chen',
    role: 'Startup Founder',
    content: 'As someone with no coding experience, I was able to create a stunning website for my startup in just a few hours. The templates are amazing!',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Emma Davis',
    role: 'Small Business Owner',
    content: 'The customer support is outstanding. They helped me customize my online store exactly how I wanted it. Highly recommended!',
    rating: 4,
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
  }
];

// Pricing plans
const pricingPlans = [
  {
    name: 'Starter',
    price: 9,
    period: 'month',
    description: 'Perfect for personal projects',
    features: [
      '5 Projects',
      '1GB Storage',
      'Basic Templates',
      'Community Support',
      'Basic Analytics'
    ],
    featured: false,
    cta: 'Get Started'
  },
  {
    name: 'Pro',
    price: 29,
    period: 'month',
    description: 'For growing businesses',
    features: [
      'Unlimited Projects',
      '10GB Storage',
      'Premium Templates',
      'Priority Support',
      'Advanced Analytics',
      'E-commerce Ready',
      'Custom Domain'
    ],
    featured: true,
    cta: 'Start Free Trial'
  },
  {
    name: 'Enterprise',
    price: 99,
    period: 'month',
    description: 'For large organizations',
    features: [
      'Unlimited Projects',
      'Unlimited Storage',
      'All Templates',
      '24/7 Support',
      'Advanced Analytics',
      'E-commerce Ready',
      'Custom Domain',
      'API Access',
      'Dedicated Hosting'
    ],
    featured: false,
    cta: 'Contact Sales'
  }
];

// Templates showcase
const templates = [
  {
    id: 1,
    name: 'Portfolio Pro',
    category: 'Portfolio',
    image: 'https://via.placeholder.com/400x300/1a1a2e/ffffff?text=Portfolio+Pro',
    likes: 1243,
    downloads: 856,
    isNew: true
  },
  {
    id: 2,
    name: 'Business Plus',
    category: 'Business',
    image: 'https://via.placeholder.com/400x300/16213e/ffffff?text=Business+Plus',
    likes: 987,
    downloads: 1204,
    isNew: false
  },
  {
    id: 3,
    name: 'E-Store',
    category: 'E-commerce',
    image: 'https://via.placeholder.com/400x300/0f3460/ffffff?text=E-Store',
    likes: 1542,
    downloads: 2134,
    isNew: true
  },
  {
    id: 4,
    name: 'Blogger',
    category: 'Blog',
    image: 'https://via.placeholder.com/400x300/533483/ffffff?text=Blogger',
    likes: 876,
    downloads: 1567,
    isNew: false
  }
];

// Stats counter
const stats = [
  { value: '50,000+', label: 'Active Users', icon: <FiUsers className="w-8 h-8 text-blue-400" /> },
  { value: '5,000+', label: 'Websites Built', icon: <FiGlobe className="w-8 h-8 text-purple-400" /> },
  { value: '98%', label: 'Customer Satisfaction', icon: <FiHeart className="w-8 h-8 text-pink-400" /> },
  { value: '24/7', label: 'Support', icon: <FiClock className="w-8 h-8 text-green-400" /> }
];

// Integration partners
const integrations = [
  { name: 'Stripe', logo: 'https://via.placeholder.com/100x40/1a1a2e/ffffff?text=Stripe' },
  { name: 'Mailchimp', logo: 'https://via.placeholder.com/100x40/1a1a2e/ffffff?text=Mailchimp' },
  { name: 'Zapier', logo: 'https://via.placeholder.com/100x40/1a1a2e/ffffff?text=Zapier' },
  { name: 'Google Analytics', logo: 'https://via.placeholder.com/100x40/1a1a2e/ffffff?text=Google+Analytics' },
  { name: 'Shopify', logo: 'https://via.placeholder.com/100x40/1a1a2e/ffffff?text=Shopify' }
];

const features = [
  {
    icon: <FiLayers className="w-6 h-6 text-blue-400" />,
    title: "Drag & Drop Builder",
    description: "Build beautiful websites visually with our intuitive drag and drop interface. No coding required.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <FiCode className="w-6 h-6 text-purple-400" />,
    title: "Clean Code Export",
    description: "Export production-ready React, HTML, and CSS code that's clean, semantic, and optimized.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: <FiZap className="w-6 h-6 text-green-400" />,
    title: "Lightning Fast",
    description: "Built with performance in mind. Your websites will load fast and run smoothly on all devices.",
    color: "from-green-500 to-green-600"
  },
  {
    icon: <FiGrid className="w-6 h-6 text-yellow-400" />,
    title: "Responsive Design",
    description: "Create designs that look great on all devices with our responsive design tools."
  },
  {
    icon: <FiCpu className="w-6 h-6 text-pink-400" />,
    title: "Powerful CMS",
    description: "Manage your content with our built-in CMS and dynamic content features."
  },
  {
    icon: <FiGitBranch className="w-6 h-6 text-indigo-400" />,
    title: "Version Control",
    description: "Track changes and collaborate with team members using our version control system."
  }
];

const FeatureCard = ({ icon, title, description, index }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: isMobile, amount: 0.2 }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
      className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1.5 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden"
    >
      {/* Animated background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
          {React.cloneElement(icon, { className: 'w-6 h-6 text-white' })}
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
        
        {/* Learn more link */}
        <div className="mt-4 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
          <span className="text-sm font-medium">Learn more</span>
          <FiArrowRight className="ml-1.5 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

const AnimatedText = ({ text, className }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let currentText = '';
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    
    return () => clearInterval(interval);
  }, [text]);
  
  return <span className={className}>{displayText}</span>;
};

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-grid-white/[0.03] [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-900/30 text-blue-400 border border-blue-800/50 mb-6"
            >
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Introducing our new website builder
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
            >
              <AnimatedText text="Build websites visually" />
              <br />
              <span className="text-blue-400"><AnimatedText text="without writing code" /></span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Create beautiful, responsive websites with our intuitive drag and drop builder.
              Export clean, production-ready code or host with us. No design or coding skills needed.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link 
                to="/signup" 
                className="relative group flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-medium text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <span className="relative z-10 flex items-center">
                  Get Started Free
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                {isHovered && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </Link>
              
              <Link 
                to="/login" 
                className="px-6 py-3.5 border border-gray-600 rounded-xl font-medium text-gray-200 hover:bg-gray-800/50 transition-colors duration-300 flex items-center"
              >
                Sign In
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400"
            >
              <FiCheckCircle className="text-green-400" />
              <span>No credit card required • Free forever</span>
            </motion.div>
          </div>
          
          {/* Demo Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 md:mt-24 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10 pointer-events-none"></div>
            <div className="relative z-0 rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
              <div className="bg-gray-800 p-3 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center text-sm text-gray-400">
                  editor.websitebuilder.com
                </div>
                <div className="w-16"></div>
              </div>
              <div className="h-80 md:h-[500px] bg-gray-900 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-900/30 text-blue-400 text-sm font-medium mb-4 border border-blue-800/50">
                    <FiCode className="mr-2" />
                    Drag components here
                  </div>
                  <p className="text-gray-500">Your website preview will appear here</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="py-16 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50"
              >
                <div className="flex justify-center mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Everything you need to build <span className="text-blue-400">amazing websites</span>
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Powerful features that help you create professional websites without touching a single line of code.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Loved by <span className="text-blue-400">thousands of creators</span>
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our users say about our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-medium text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-300 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Showcase */}
      <div className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Stunning <span className="text-blue-400">Templates</span>
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Choose from our collection of professionally designed templates. All templates are fully customizable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group bg-gray-800/50 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="relative">
                  <img 
                    src={template.image} 
                    alt={template.name}
                    className="w-full h-48 object-cover"
                  />
                  {template.isNew && (
                    <span className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Preview Template
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white">{template.name}</h3>
                      <p className="text-sm text-gray-400">{template.category}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center text-sm text-gray-400">
                        <FiHeart className="w-4 h-4 mr-1" /> {template.likes}
                      </span>
                      <span className="flex items-center text-sm text-gray-400">
                        <FiDownload className="w-4 h-4 mr-1" /> {template.downloads}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              to="/templates" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            >
              View All Templates
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Simple, transparent <span className="text-blue-400">pricing</span>
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. Start with a free trial, no credit card required.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 border ${
                  plan.featured 
                    ? 'border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-gray-900/50' 
                    : 'border-gray-700/50 bg-gray-800/50'
                } backdrop-blur-lg`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                
                <div className="mb-8">
                  <span className="text-5xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <FiCheck className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-300 ${
                    plan.featured 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600' 
                      : 'bg-gray-700/50 text-white hover:bg-gray-600/50'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center text-gray-400 text-sm">
            <p>Need a custom plan? <a href="#" className="text-blue-400 hover:underline">Contact our sales team</a></p>
          </div>
        </div>
      </div>

      {/* Integrations Section */}
      <div className="py-16 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">Trusted by industry leaders</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Seamlessly integrate with your favorite tools and services
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="opacity-70 hover:opacity-100 transition-opacity duration-300"
              >
                <img 
                  src={integration.logo} 
                  alt={integration.name}
                  className="h-10 w-auto mx-auto"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to create something amazing?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of designers and developers who are building better websites faster with our platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-medium text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
            >
              Get Started for Free
            </Link>
            <Link 
              to="/login" 
              className="px-6 py-3.5 border border-gray-600 rounded-xl font-medium text-gray-200 hover:bg-gray-800/50 transition-colors duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Templates</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-3">n                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Website Builder. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
