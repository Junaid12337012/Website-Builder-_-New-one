import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  FiEdit2, FiTrash2, FiEye, FiPlus, FiLogOut, FiGrid, 
  FiLayers, FiHome, FiSettings, FiUsers, FiBarChart2, 
  FiMail, FiHelpCircle, FiBell, FiSearch, FiClock, 
  FiStar, FiDownload, FiShare2, FiMoreHorizontal, FiGlobe,
  FiX, FiCheck, FiZap, FiPieChart, FiDollarSign, FiBriefcase,
  FiShoppingBag
} from 'react-icons/fi';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { getToken } from '../lib/auth';

const navItems = [
  { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
  { name: 'Projects', icon: FiLayers, path: '/dashboard/projects' },
  { name: 'Analytics', icon: FiBarChart2, path: '/dashboard/analytics' },
  { name: 'Team', icon: FiUsers, path: '/dashboard/team' },
  { name: 'Settings', icon: FiSettings, path: '/dashboard/settings' },
];

const recentActivity = [
  { id: 1, action: 'created', project: 'E-commerce Store', time: '2 hours ago', user: 'You' },
  { id: 2, action: 'updated', project: 'Portfolio Site', time: '5 hours ago', user: 'Alex Johnson' },
  { id: 3, action: 'published', project: 'Landing Page', time: '1 day ago', user: 'You' },
  { id: 4, action: 'commented', project: 'Blog Template', time: '2 days ago', user: 'Sam Wilson' },
];

const quickTemplates = [
  { 
    id: 1, 
    name: 'Business', 
    category: 'Website', 
    thumbnail: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    features: ['Responsive', '5+ Pages', 'Contact Form'],
    rating: 4.8
  },
  { 
    id: 2, 
    name: 'Portfolio', 
    category: 'Website', 
    thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80',
    features: ['Gallery', 'Blog', 'About Section'],
    rating: 4.6
  },
  { 
    id: 3, 
    name: 'E-commerce', 
    category: 'Store', 
    thumbnail: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    features: ['Product Listings', 'Shopping Cart', 'Checkout'],
    rating: 4.9
  },
  { 
    id: 4, 
    name: 'Landing Page', 
    category: 'Marketing', 
    thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    features: ['Lead Capture', 'Call-to-Action', 'Analytics'],
    rating: 4.7
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [isTemplateView, setIsTemplateView] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const modalRef = useRef(null);
  const [showUserMenu, setShowUserMenu] = useState(false); // Remove this line if not used elsewhere

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (showProfileModal && modalRef.current && !modalRef.current.contains(event.target)) {
        // Check if the click is not on the profile button
        const profileButton = document.getElementById('user-menu');
        if (profileButton && !profileButton.contains(event.target)) {
          setShowProfileModal(false);
        }
      }
    }
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!getToken()) {
      navigate('/login')
    } else {
      fetchProjects()
    }
  }, [navigate])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/projects')
      setProjects(data.projects || [])
    } catch (err) {
      setError('Failed to load projects')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const createProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setError('Project name cannot be empty');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { data } = await api.post('/projects', { name: projectName });
      setProjects((p) => [data.project, ...p]);
      setProjectName('');
      setShowNewProjectForm(false);
      navigate(`/editor/${data.project._id}`);
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err?.response?.data?.message || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const deleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      await api.delete(`/projects/${projectId}`)
      setProjects(projects.filter(p => p._id !== projectId))
    } catch (err) {
      setError('Failed to delete project')
    }
  }

  const location = useLocation();

  // Stats data
  const stats = [
    { name: 'Total Projects', value: projects.length, icon: FiLayers, change: '+12%', changeType: 'increase' },
    { name: 'Active Users', value: '1,234', icon: FiUsers, change: '+5.4%', changeType: 'increase' },
    { name: 'Storage Used', value: '2.4 GB', icon: FiDownload, change: '80%', changeType: 'warning' },
    { name: 'Monthly Visitors', value: '8,542', icon: FiBarChart2, change: '+23.1%', changeType: 'increase' },
  ];

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Projects', count: projects.length },
    { id: 'recent', name: 'Recent', count: projects.filter(p => new Date(p.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length },
    { id: 'starred', name: 'Starred', count: 0 },
    { id: 'published', name: 'Published', count: projects.filter(p => p.published).length },
  ];

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (activeCategory === 'all' || 
     (activeCategory === 'recent' && new Date(project.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
     (activeCategory === 'published' && project.published))
  );

  // Get recent projects (last 3)
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);

  // Get featured templates
  const featuredTemplates = [...quickTemplates].sort((a, b) => b.rating - a.rating).slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row overflow-hidden">
      {/* Mobile sidebar backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-gray-800 text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-20 lg:w-64 flex-shrink-0`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0">
                <FiGrid className="h-5 w-5 text-white" />
              </div>
              {isSidebarOpen && <h1 className="ml-3 text-xl font-bold text-white">WebStudio</h1>}
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-400 hover:text-white lg:hidden"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {isSidebarOpen && item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center cursor-pointer" onClick={() => setShowProfileModal(true)}>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                {localStorage.getItem('userName')?.charAt(0).toUpperCase() || 'U'}
              </div>
              {isSidebarOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {localStorage.getItem('userName') || 'User'}
                  </p>
                  <p className="text-xs text-gray-400">Free Plan</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-900">
        <div className="flex-1 overflow-y-auto">
        {/* Top Navigation */}
        <header className="bg-gray-800 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center lg:hidden">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="text-gray-400 hover:text-white p-2 rounded-md focus:outline-none"
                >
                  <span className="sr-only">Open sidebar</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center md:justify-start">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search projects, templates..."
                    className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-gray-600 focus:text-white sm:text-sm transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="ml-4 flex items-center">
                <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors">
                  <span className="sr-only">View notifications</span>
                  <div className="relative">
                    <FiBell className="h-6 w-6" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-800"></span>
                  </div>
                </button>
                
                {/* Profile Button with Dropdown */}
                <div className="relative ml-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProfileModal(!showProfileModal);
                    }}
                    className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-all"
                    id="user-menu"
                    aria-haspopup="true"
                    aria-expanded={showProfileModal}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
                      {localStorage.getItem('userName')?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>

                  {/* Dropdown Menu - Positioned Below */}
                  {showProfileModal && (
                    <div 
                      ref={modalRef}
                      className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '0.5rem'
                      }}
                    >
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                        <div className="px-4 py-3 border-b border-gray-700">
                          <p className="text-sm text-white">{localStorage.getItem('userName') || 'User'}</p>
                          <p className="text-xs text-gray-300">{localStorage.getItem('userEmail') || 'user@example.com'}</p>
                        </div>
                        
                        <a 
                          href="#" 
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                          role="menuitem"
                        >
                          <div className="flex items-center">
                            <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Your Profile
                          </div>
                        </a>
                        
                        <a 
                          href="#" 
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                          role="menuitem"
                        >
                          <div className="flex items-center">
                            <FiSettings className="mr-3 h-5 w-5 text-gray-400" />
                            Settings
                          </div>
                        </a>
                        
                        <div className="border-t border-gray-700 my-1"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-gray-700 hover:text-red-400"
                          role="menuitem"
                        >
                          <div className="flex items-center">
                            <FiLogOut className="mr-3 h-5 w-5" />
                            Sign out
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-900">
          {/* Welcome Banner */}
          <div className="relative bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 p-6 md:p-8 overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative z-10 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Welcome back, {localStorage.getItem('userName')?.split(' ')[0] || 'User'}! 👋</h2>
                  <p className="mt-2 text-gray-300 max-w-2xl">
                    {projects.length > 0 
                      ? `You have ${projects.length} project${projects.length !== 1 ? 's' : ''} in your workspace.`
                      : "Let's get started by creating your first project!"}
                  </p>
                </div>
                <div className="mt-6 md:mt-0 flex space-x-3">
                  <button
                    onClick={() => setShowNewProjectForm(true)}
                    className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5"
                  >
                    <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                    New Project
                  </button>
                  <button
                    onClick={() => setIsTemplateView(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-lg shadow-sm text-white bg-gray-800/80 hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                  >
                    <FiLayers className="-ml-1 mr-2 h-5 w-5" />
                    Browse Templates
                  </button>
                </div>
              </div>
              
              {/* Stats */}
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.name} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-blue-500/30 transition-colors">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${
                        stat.name === 'Total Projects' ? 'bg-blue-900/30 text-blue-400' :
                        stat.name === 'Active Users' ? 'bg-green-900/30 text-green-400' :
                        stat.name === 'Storage Used' ? 'bg-yellow-900/30 text-yellow-400' :
                        'bg-purple-900/30 text-purple-400'
                      }`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                        <div className="flex items-baseline">
                          <p className="text-2xl font-semibold text-white">{stat.value}</p>
                          {stat.change && (
                            <span className={`ml-2 text-xs font-medium ${
                              stat.changeType === 'increase' ? 'text-green-400' : 
                              stat.changeType === 'decrease' ? 'text-red-400' : 
                              'text-yellow-400'
                            }`}>
                              {stat.change}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div 
                onClick={() => setShowNewProjectForm(true)}
                className="group bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-xl p-5 border border-blue-800/30 hover:border-blue-500/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex items-start">
                  <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                    <FiPlus className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-white">New Project</h3>
                    <p className="mt-1 text-sm text-gray-400">Start from scratch with a blank canvas</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-blue-400 font-medium">
                  <span>Create now</span>
                  <svg className="ml-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              <div 
                onClick={() => setIsTemplateView(true)}
                className="group bg-gradient-to-br from-purple-900/20 to-purple-800/20 rounded-xl p-5 border border-purple-800/30 hover:border-purple-500/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className="flex items-start">
                  <div className="p-2.5 rounded-lg bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 transition-colors">
                    <FiLayers className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-white">Templates</h3>
                    <p className="mt-1 text-sm text-gray-400">Start with a professionally designed template</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-purple-400 font-medium">
                  <span>Browse templates</span>
                  <svg className="ml-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              <div 
                className="group bg-gradient-to-br from-green-900/20 to-green-800/20 rounded-xl p-5 border border-green-800/30 hover:border-green-500/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-green-500/10"
              >
                <div className="flex items-start">
                  <div className="p-2.5 rounded-lg bg-green-500/20 text-green-400 group-hover:bg-green-500/30 transition-colors">
                    <FiDownload className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-white">Import</h3>
                    <p className="mt-1 text-sm text-gray-400">Import an existing website or project</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-green-400 font-medium">
                  <span>Import now</span>
                  <svg className="ml-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              <div 
                className="group bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 rounded-xl p-5 border border-yellow-800/30 hover:border-yellow-500/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-yellow-500/10"
              >
                <div className="flex items-start">
                  <div className="p-2.5 rounded-lg bg-yellow-500/20 text-yellow-400 group-hover:bg-yellow-500/30 transition-colors">
                    <FiUsers className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-white">Team</h3>
                    <p className="mt-1 text-sm text-gray-400">Invite team members to collaborate</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-yellow-400 font-medium">
                  <span>Invite team</span>
                  <svg className="ml-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Projects & Templates Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">
                  {isTemplateView ? 'Website Templates' : 'My Projects'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                  {isTemplateView ? quickTemplates.length : projects.length} {isTemplateView ? 'templates' : 'projects'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    onClick={() => setIsTemplateView(false)}
                    className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                      !isTemplateView 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <FiGrid className="mr-2 h-4 w-4" />
                      My Projects
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTemplateView(true)}
                    className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                      isTemplateView 
                        ? 'bg-purple-600 border-purple-600 text-white' 
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <FiLayers className="mr-2 h-4 w-4" />
                      Templates
                    </div>
                  </button>
                </div>
                
                <div className="relative">
                  <select 
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="appearance-none bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 pr-8"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.count})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            {isTemplateView ? (
              <div className="space-y-6">
                {/* Featured Templates */}
                {featuredTemplates.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Featured Templates</h3>
                      <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                        View all
                      </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {featuredTemplates.map((template) => (
                        <div key={template.id} className="group relative bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                          <div className="relative h-48 bg-gray-800 overflow-hidden">
                            <img 
                              src={template.thumbnail} 
                              alt={template.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-5">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center bg-blue-600/90 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                                  <FiStar className="h-3 w-3 mr-1" />
                                  Featured
                                </div>
                                <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors">
                                  <FiStar className="h-5 w-5" />
                                </button>
                              </div>
                              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {template.features.map((feature, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900/70 text-gray-200">
                                      <FiCheck className="mr-1 h-3 w-3 text-green-400" />
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                                <button className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center">
                                  <FiPlus className="mr-2 h-4 w-4" />
                                  Use This Template
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-white">{template.name}</h3>
                                <p className="text-sm text-gray-400">{template.category} Template</p>
                              </div>
                              <div className="flex items-center bg-gray-800/70 rounded-full px-2.5 py-1">
                                <FiStar className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                                <span className="ml-1 text-xs font-medium text-white">{template.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Templates */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">All Templates</h3>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <select className="appearance-none bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 pr-8">
                          <option>All Categories</option>
                          <option>Business</option>
                          <option>Portfolio</option>
                          <option>E-commerce</option>
                          <option>Landing Page</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <div className="relative">
                        <select className="appearance-none bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 pr-8">
                          <option>Sort by: Popular</option>
                          <option>Newest</option>
                          <option>Trending</option>
                          <option>Rating</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {quickTemplates.map((template) => (
                      <div key={template.id} className="group relative bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
                        <div className="relative h-40 bg-gray-800 overflow-hidden">
                          <img 
                            src={template.thumbnail} 
                            alt={template.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <button className="w-full py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                              Use Template
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-white">{template.name}</h3>
                              <p className="text-xs text-gray-400">{template.category}</p>
                            </div>
                            <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                              <FiStar className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex -space-x-1">
                                {[1, 2, 3].map((i) => (
                                  <div key={i} className="h-5 w-5 rounded-full border-2 border-gray-800 bg-gray-700"></div>
                                ))}
                              </div>
                              <span className="ml-2 text-xs text-gray-400">+12</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-400">
                              <FiStar className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                              {template.rating}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Projects Grid */}
                {loading && !projects.length ? (
                  <div className="flex flex-col items-center justify-center py-16 bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-700">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <h3 className="text-lg font-medium text-white">Loading your projects</h3>
                    <p className="mt-1 text-sm text-gray-400">This will just take a moment...</p>
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="text-center py-16 bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-700">
                    <div className="mx-auto h-16 w-16 bg-blue-900/20 rounded-full flex items-center justify-center text-blue-400 mb-4">
                      <FiLayers className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-medium text-white">No projects found</h3>
                    <p className="mt-1 text-sm text-gray-400 mb-6">
                      {searchQuery 
                        ? 'No projects match your search. Try a different term.'
                        : activeCategory === 'recent' 
                          ? 'You have no recent projects.'
                          : activeCategory === 'published'
                            ? 'You have no published projects.'
                            : 'Get started by creating a new project.'
                      }
                    </p>
                    <button
                      onClick={() => setShowNewProjectForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                      New Project
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project) => (
                      <div key={project._id} className="group relative bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
                        <div className="relative h-40 bg-gray-800 flex items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative z-10 text-center p-4">
                            <FiGrid className="mx-auto h-12 w-12 text-gray-600 group-hover:text-blue-500 transition-colors" />
                            <p className="mt-2 text-sm text-gray-400 group-hover:text-white transition-colors">
                              {project.pages?.length || 0} {project.pages?.length === 1 ? 'page' : 'pages'}
                            </p>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm">
                            <Link
                              to={`/editor/${project._id}`}
                              className="p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 className="h-5 w-5" />
                            </Link>
                            <Link
                              to={`/preview/${project._id}`}
                              target="_blank"
                              className="p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
                              title="Preview"
                            >
                              <FiEye className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                deleteProject(project._id);
                              }}
                              className="p-2 bg-white/10 backdrop-blur-sm rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                            <button 
                              className="p-2 bg-white/10 backdrop-blur-sm rounded-lg text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300 transition-colors"
                              title="Add to favorites"
                            >
                              <FiStar className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors truncate">{project.name}</h3>
                              <p className="text-xs text-gray-400 mt-1">
                                Last updated: {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex space-x-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">
                                {project.published ? 'Published' : 'Draft'}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex -space-x-1">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="h-6 w-6 rounded-full border-2 border-gray-800 bg-gray-700"></div>
                              ))}
                            </div>
                            <div className="flex space-x-2">
                              <button className="p-1 text-gray-400 hover:text-blue-400 transition-colors">
                                <FiShare2 className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-yellow-400 transition-colors">
                                <FiStar className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                                <FiMoreHorizontal className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add New Project Card */}
                    <div 
                      onClick={() => setShowNewProjectForm(true)}
                      className="group flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-700 rounded-xl hover:border-blue-500/50 hover:bg-gray-800/30 transition-colors duration-200 cursor-pointer"
                    >
                      <div className="mx-auto h-12 w-12 bg-blue-900/20 rounded-full flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors">
                        <FiPlus className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 text-sm font-medium text-gray-200 group-hover:text-white">New Project</h3>
                      <p className="mt-1 text-xs text-gray-400 text-center">
                        Start from scratch or use a template
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Recent Activity */}
            {!isTemplateView && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                  <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    View all activity
                  </button>
                </div>
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
                  <ul className="divide-y divide-gray-700/50">
                    {recentActivity.map((activity) => (
                      <li key={activity.id} className="p-4 hover:bg-gray-800/30 transition-colors group">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400">
                            {activity.user.charAt(0)}
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm text-gray-300">
                              <span className="font-medium text-white">{activity.user}</span> {activity.action} "{activity.project}"
                            </p>
                            <div className="mt-1 flex items-center justify-between">
                              <p className="text-xs text-gray-400 flex items-center">
                                <FiClock className="h-3 w-3 mr-1" /> {activity.time}
                              </p>
                              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-xs text-gray-400 hover:text-blue-400 transition-colors">
                                  View
                                </button>
                                <button className="text-xs text-gray-400 hover:text-red-400 transition-colors">
                                  Dismiss
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* New Project Form Modal - Enhanced */}
          {showNewProjectForm && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                {/* Overlay */}
                <div 
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                  onClick={() => setShowNewProjectForm(false)}
                />
                
                {/* Modal Container */}
                <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-800 border border-gray-700/50 shadow-2xl transition-all">
                  {/* Header */}
                  <div className="px-6 py-5 border-b border-gray-700/50 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Create New Project</h3>
                      <p className="mt-1 text-sm text-gray-400">Get started by creating a new project</p>
                    </div>
                    <button 
                      onClick={() => setShowNewProjectForm(false)}
                      className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
                      aria-label="Close"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>
                  
                  {/* Scrollable Content */}
                  <div className="max-h-[65vh] overflow-y-auto p-6">
                    <form id="projectForm" onSubmit={createProject} className="space-y-6">
                      <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-2">
                          Project Name
                        </label>
                        <input
                          id="projectName"
                          type="text"
                          className="block w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                          placeholder="My Awesome Website"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          required
                          autoFocus
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Choose a Template
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div 
                            className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all hover:border-blue-500/50 ${
                              projectName.includes('Business') ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700'
                            }`} 
                            onClick={() => setProjectName('Business Website')}
                          >
                            <div className="h-24 bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-lg mb-3 flex items-center justify-center">
                              <FiBriefcase className="h-10 w-10 text-blue-400" />
                            </div>
                            <h4 className="font-medium text-white">Business</h4>
                            <p className="text-xs text-gray-400 mt-1">Professional business website</p>
                            {projectName.includes('Business') && (
                              <div className="absolute top-3 right-3 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <FiCheck className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          
                          <div 
                            className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all hover:border-purple-500/50 ${
                              projectName.includes('Portfolio') ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700'
                            }`} 
                            onClick={() => setProjectName('Portfolio')}
                          >
                            <div className="h-24 bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-lg mb-3 flex items-center justify-center">
                              <FiGrid className="h-10 w-10 text-purple-400" />
                            </div>
                            <h4 className="font-medium text-white">Portfolio</h4>
                            <p className="text-xs text-gray-400 mt-1">Showcase your work</p>
                            {projectName.includes('Portfolio') && (
                              <div className="absolute top-3 right-3 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <FiCheck className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          
                          <div 
                            className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all hover:border-green-500/50 ${
                              projectName.includes('E-commerce') ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700'
                            }`} 
                            onClick={() => setProjectName('E-commerce Store')}
                          >
                            <div className="h-24 bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-lg mb-3 flex items-center justify-center">
                              <FiShoppingBag className="h-10 w-10 text-green-400" />
                            </div>
                            <h4 className="font-medium text-white">E-commerce</h4>
                            <p className="text-xs text-gray-400 mt-1">Online store setup</p>
                            {projectName.includes('E-commerce') && (
                              <div className="absolute top-3 right-3 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <FiCheck className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          
                          <div 
                            className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all hover:border-yellow-500/50 ${
                              projectName === 'Blank' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700'
                            }`} 
                            onClick={() => setProjectName('Blank')}
                          >
                            <div className="h-24 bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 rounded-lg mb-3 flex items-center justify-center">
                              <FiZap className="h-10 w-10 text-yellow-400" />
                            </div>
                            <h4 className="font-medium text-white">Blank</h4>
                            <p className="text-xs text-gray-400 mt-1">Start from scratch</p>
                            {projectName === 'Blank' && (
                              <div className="absolute top-3 right-3 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <FiCheck className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  
                  {/* Fixed Footer */}
                  <div className="sticky bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm px-6 py-4 border-t border-gray-700/50">
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setShowNewProjectForm(false)}
                        className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        form="projectForm"
                        disabled={loading || !projectName.trim()}
                        className={`inline-flex items-center px-5 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 ${
                          !loading && projectName.trim() 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' 
                            : 'bg-blue-600/50 cursor-not-allowed'
                        }`}
                        onClick={(e) => {
                          // Ensure the form is submitted when the button is clicked
                          if (!projectName.trim()) {
                            e.preventDefault();
                          }
                        }}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                          </>
                        ) : (
                          <>
                            <FiPlus className="-ml-1 mr-2 h-4 w-4" />
                            Create Project
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Footer */}
        <footer className="border-t border-gray-800/50 bg-gray-900/50 backdrop-blur-sm py-6 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-6">
                <p className="text-sm text-gray-400">
                  &copy; {new Date().getFullYear()} WebStudio. All rights reserved.
                </p>
                <div className="hidden md:flex items-center space-x-1 text-xs text-gray-500">
                  <span>v1.0.0</span>
                  <span>•</span>
                  <a href="#" className="hover:text-blue-400 transition-colors">Changelog</a>
                </div>
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Help Center">
                  <FiHelpCircle className="h-5 w-5" />
                  <span className="sr-only">Help</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Documentation">
                  <FiGlobe className="h-5 w-5" />
                  <span className="sr-only">Documentation</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Status">
                  <div className="flex items-center">
                    <span className="relative flex h-2.5 w-2.5 mr-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-medium text-green-400">All systems operational</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
        </div>
      </div>
    </div>
  );
}
