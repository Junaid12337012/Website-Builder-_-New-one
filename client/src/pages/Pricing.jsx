import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCheck, FiX, FiZap, FiStar, FiAward, FiClock, 
  FiUsers, FiGlobe, FiHeart, FiCreditCard, FiArrowRight, FiUser, FiDollarSign
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Pricing plans data
const pricingPlans = [
  {
    name: 'Starter',
    price: 9,
    period: 'month',
    description: 'Perfect for personal projects and small websites',
    features: [
      '5 Projects',
      '1GB Storage',
      'Basic Templates',
      'Community Support',
      'Basic Analytics',
      'Mobile Responsive',
      'SEO Basics',
      'Custom Domain',
      'Remove Branding',
      'E-commerce',
      'API Access',
      'Priority Support'
    ],
    included: [true, true, true, true, true, false, false, false, false, false, false],
    featured: false,
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: 29,
    period: 'month',
    description: 'For growing businesses and professionals',
    features: [
      'Unlimited Projects',
      '10GB Storage',
      'Premium Templates',
      'Priority Support',
      'Advanced Analytics',
      'Mobile Responsive',
      'SEO Tools',
      'Custom Domain',
      'Remove Branding',
      'E-commerce',
      'API Access',
      'Priority Support'
    ],
    included: [true, true, true, true, true, true, true, true, true, false, false],
    featured: true,
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 99,
    period: 'month',
    description: 'For large organizations with advanced needs',
    features: [
      'Unlimited Projects',
      'Unlimited Storage',
      'All Templates',
      '24/7 Support',
      'Advanced Analytics',
      'Mobile Responsive',
      'Advanced SEO',
      'Custom Domain',
      'Remove Branding',
      'E-commerce',
      'API Access',
      'Priority Support'
    ],
    included: [true, true, true, true, true, true, true, true, true, true, true],
    featured: false,
    cta: 'Contact Sales',
    popular: false
  }
];

// Features comparison
const featureGroups = [
  {
    category: 'General',
    features: [
      { name: 'Projects', key: 0 },
      { name: 'Storage', key: 1 },
      { name: 'Templates', key: 2 },
      { name: 'Support', key: 3 },
      { name: 'Analytics', key: 4 }
    ]
  },
  {
    category: 'Features',
    features: [
      { name: 'Mobile Responsive', key: 5 },
      { name: 'SEO Tools', key: 6 },
      { name: 'Custom Domain', key: 7 },
      { name: 'Remove Branding', key: 8 },
      { name: 'E-commerce', key: 9 },
      { name: 'API Access', key: 10 },
      { name: 'Priority Support', key: 11 }
    ]
  }
];

// FAQ section
const faqs = [
  {
    question: 'Can I change plans later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Your billing will be adjusted accordingly.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes, all paid plans come with a 14-day free trial. No credit card is required to start your trial.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards including Visa, Mastercard, American Express, and PayPal.'
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can cancel your subscription at any time. There are no cancellation fees.'
  },
  {
    question: 'Do you offer discounts for non-profits?',
    answer: 'Yes, we offer a 30% discount for registered non-profit organizations. Contact our sales team for more information.'
  }
];

// Random user data generator
const generateRandomUser = () => {
  const names = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Morgan', 'Jamie', 'Quinn', 'Avery', 'Peyton'];
  const actions = ['subscribed to', 'upgraded to', 'downgraded to', 'started trial with', 'purchased'];
  const plans = ['Starter', 'Pro', 'Enterprise'];
  const times = ['just now', '2 minutes ago', '5 minutes ago', '10 minutes ago', '15 minutes ago'];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: names[Math.floor(Math.random() * names.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    plan: plans[Math.floor(Math.random() * plans.length)],
    time: times[Math.floor(Math.random() * times.length)],
    avatar: `https://i.pravatar.cc/100?u=${Math.random().toString(36).substr(2, 9)}`
  };
};

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [activeFaq, setActiveFaq] = useState(null);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  
  // Recent purchases data
  const recentPurchases = Array(6).fill().map(() => {
    const user = generateRandomUser();
    const plans = ['Starter', 'Pro', 'Agency'];
    const amounts = [9, 29, 99];
    const randomPlan = Math.floor(Math.random() * 3);
    
    return {
      user: {
        ...user,
        plan: plans[randomPlan]
      },
      amount: amounts[randomPlan]
    };
  });
  
  // Generate initial users
  useEffect(() => {
    const initialUsers = Array.from({ length: 5 }, () => generateRandomUser());
    setCurrentUsers(initialUsers);
    
    // Update users every 5-10 seconds
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentUsers(prevUsers => {
          const newUsers = [...prevUsers];
          // Randomly add or remove a user
          if (Math.random() > 0.3 && newUsers.length < 8) {
            newUsers.unshift(generateRandomUser());
          } else if (newUsers.length > 3) {
            newUsers.pop();
          }
          // Randomly update a user's action
          if (Math.random() > 0.5 && newUsers.length > 0) {
            const index = Math.floor(Math.random() * newUsers.length);
            newUsers[index] = generateRandomUser();
          }
          return newUsers.slice(0, 8); // Keep max 8 users
        });
      }
    }, Math.random() * 5000 + 5000); // 5-10 seconds
    
    return () => clearInterval(interval);
  }, [isPaused]);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      
      {/* Current Users Activity */}
      <div className="bg-gray-800/50 border-b border-gray-700/50 py-3 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center text-sm font-medium text-blue-400 mr-4">
              <FiUser className="mr-2" /> Current Activity:
            </div>
            <div className="relative flex-1 overflow-hidden">
              <div 
                className="whitespace-nowrap will-change-transform"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {currentUsers.map((user, index) => (
                  <div 
                    key={user.id} 
                    className={`inline-flex items-center mr-8 text-sm text-gray-300 ${
                      index % 2 === 0 ? 'opacity-90' : 'opacity-70'
                    }`}
                  >
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-6 h-6 rounded-full mr-2 border border-blue-500/50" 
                    />
                    <span className="font-medium text-white">{user.name}</span>
                    <span className="mx-1">{user.action}</span>
                    <span className="font-medium text-blue-400">{user.plan}</span>
                    <span className="text-xs text-gray-500 ml-2">• {user.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <div className="flex items-center text-xs text-green-400">
                <span className="flex h-2 w-2 relative mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                {Math.floor(Math.random() * 50) + 50} active users now
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 w-full overflow-x-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-grid-white/[0.03] [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        </div>
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-900/30 text-blue-400 border border-blue-800/50 mb-6"
          >
            <FiStar className="mr-2" />
            Simple, transparent pricing
          </motion.div>
          
          <motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.1 }}
  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
             font-bold tracking-tight 
             leading-tight   /* 👈 ye add karo */
             bg-clip-text text-transparent bg-gradient-to-r 
             from-white to-gray-400 mb-6 px-4 break-words"
>
  Pricing that grows with you
</motion.h1>

          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-10"
          >
            Choose the perfect plan for your needs. Start with a free trial, no credit card required.
          </motion.p>
          
          {/* Billing Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center bg-gray-800/50 rounded-full p-1 mb-12 border border-gray-700/50"
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                billingCycle === 'monthly' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                billingCycle === 'yearly' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly Billing
              <span className="ml-2 px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                Save 20%
              </span>
            </button>
          </motion.div>
        </div>
      </div>
      
      {/* Pricing Cards */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 border ${
                plan.popular 
                  ? 'border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-gray-900/50' 
                  : 'border-gray-700/50 bg-gray-800/50'
              } backdrop-blur-lg`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-medium px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                
                <div className="flex items-baseline mb-2">
                  <span className="text-5xl font-bold text-white">
                    ${billingCycle === 'yearly' ? Math.round(plan.price * 12 * 0.8) : plan.price}
                  </span>
                  <span className="ml-2 text-gray-400">
                    /{billingCycle === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>
                
                {billingCycle === 'yearly' && (
                  <p className="text-sm text-green-400 mb-6">
                    Billed annually (${plan.price * 12} value)
                  </p>
                )}
                
                <Link
                  to={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                  className={`w-full inline-flex justify-center items-center py-3 px-6 rounded-lg font-medium transition-colors duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600' 
                      : 'bg-gray-700/50 text-white hover:bg-gray-600/50'
                  }`}
                >
                  {plan.cta}
                  <FiArrowRight className="ml-2" />
                </Link>
              </div>
              
              <div className="pt-6 border-t border-gray-700/50">
                <h4 className="text-sm font-medium text-gray-300 mb-4">WHAT'S INCLUDED</h4>
                <ul className="space-y-3">
                  {featureGroups[0].features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      {plan.included[feature.key] ? (
                        <FiCheck className="w-5 h-5 text-green-500 mr-2" />
                      ) : (
                        <FiX className="w-5 h-5 text-red-500 mr-2" />
                      )}
                      <span className="text-gray-300">
                        {feature.name}
                        {feature.key === 0 && `: ${plan.features[0]}`}
                        {feature.key === 1 && `: ${plan.features[1]}`}
                        {feature.key === 2 && `: ${plan.features[2]}`}
                        {feature.key === 3 && `: ${plan.features[3]}`}
                        {feature.key === 4 && `: ${plan.features[4]}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Feature Comparison */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Compare all features
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            See how our plans stack up against each other
          </p>
        </div>
        
        <div className="bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Features</th>
                  {pricingPlans.map((plan) => (
                    <th key={plan.name} className="py-4 px-6 text-center text-sm font-medium text-gray-300">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {featureGroups[1].features.map((feature, i) => (
                  <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-300">{feature.name}</td>
                    {pricingPlans.map((plan) => (
                      <td key={`${plan.name}-${i}`} className="py-4 px-6 text-center">
                        {plan.included[feature.key] ? (
                          <FiCheck className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <FiX className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about our pricing and plans
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <h3 className="text-lg font-medium text-white">{faq.question}</h3>
                <svg
                  className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${
                    activeFaq === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`px-6 pb-6 pt-0 overflow-hidden transition-all duration-300 ${
                  activeFaq === index ? 'block' : 'hidden'
                }`}
              >
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6">Still have questions?</p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
          >
            Contact our support team
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
      
      {/* Recent Purchases */}
      <div className="py-16 sm:py-24 lg:py-32 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-center text-xl font-medium text-gray-300 mb-8">Recent Purchases</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPurchases.map(({ user, amount }, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 hover:border-blue-500/30 transition-colors duration-300"
              >
                <div className="flex items-center">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-12 h-12 rounded-full border-2 border-blue-500/50"
                  />
                  <div className="ml-4">
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-sm text-gray-400">{user.time}</div>
                  </div>
                  <div className="ml-auto flex items-center text-green-400">
                    <FiDollarSign className="mr-1" />
                    <span className="font-bold">{amount}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700/50 text-sm text-gray-300">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                    <span>Purchased <span className="text-blue-400">{user.plan}</span> plan</span>
                  </div>
                  <div className="mt-2 flex items-center">
                    <div className="flex-shrink-0 h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span>Payment successful</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers building their dream websites with our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            >
              Start your free trial
              <FiArrowRight className="ml-2" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-base font-medium rounded-md text-white hover:bg-gray-700/50 transition-colors duration-300"
            >
              Contact sales
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
