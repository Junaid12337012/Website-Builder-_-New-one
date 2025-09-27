import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiSearch, FiGrid, FiLayers, FiShoppingBag, 
  FiBriefcase, FiFileText, FiMonitor, FiStar, 
  FiTrendingUp, FiAward, FiClock, FiLayout, 
  FiDownload, FiEye, FiHeart, FiShare2, FiTag,
  FiMaximize2, FiMinimize2, FiExternalLink, FiChevronLeft,
  FiChevronRight, FiPlus, FiFilter, FiCheck, FiChevronDown,
  FiGlobe, FiSmartphone, FiTablet, FiCheckCircle,
  FiZap, FiLayers as FiTemplates, FiCode, FiPenTool
} from 'react-icons/fi';

// Template category icons
const CATEGORY_ICONS = {
  all: <FiGrid className="w-5 h-5" />,
  business: <FiBriefcase className="w-5 h-5" />,
  portfolio: <FiAward className="w-5 h-5" />,
  ecommerce: <FiShoppingBag className="w-5 h-5" />,
  blog: <FiFileText className="w-5 h-5" />,
  landing: <FiMonitor className="w-5 h-5" />,
  featured: <FiStar className="w-5 h-5 text-amber-400" />,
  trending: <FiTrendingUp className="w-5 h-5 text-green-400" />,
  general: <FiLayout className="w-5 h-5" />
};

// Template difficulty levels
const DIFFICULTY_LEVELS = [
  { id: 'all', name: 'All Levels', color: 'bg-gray-100 text-gray-800' },
  { id: 'beginner', name: 'Beginner', color: 'bg-blue-100 text-blue-800' },
  { id: 'intermediate', name: 'Intermediate', color: 'bg-purple-100 text-purple-800' },
  { id: 'advanced', name: 'Advanced', color: 'bg-pink-100 text-pink-800' }
];

// Template categories
const categories = [
  { id: 'all', name: 'All Templates', icon: CATEGORY_ICONS.all },
  { id: 'featured', name: 'Featured', icon: CATEGORY_ICONS.featured },
  { id: 'business', name: 'Business', icon: CATEGORY_ICONS.business },
  { id: 'portfolio', name: 'Portfolio', icon: CATEGORY_ICONS.portfolio },
  { id: 'ecommerce', name: 'E-commerce', icon: CATEGORY_ICONS.ecommerce },
  { id: 'blog', name: 'Blog', icon: CATEGORY_ICONS.blog },
  { id: 'landing', name: 'Landing Pages', icon: CATEGORY_ICONS.landing },
  { id: 'trending', name: 'Trending', icon: CATEGORY_ICONS.trending }
];

// Template tags
const TAGS = [
  { id: 'responsive', name: 'Responsive', color: 'bg-blue-100 text-blue-800' },
  { id: 'mobile-first', name: 'Mobile First', color: 'bg-purple-100 text-purple-800' },
  { id: 'dark-mode', name: 'Dark Mode', color: 'bg-gray-800 text-white' },
  { id: 'minimal', name: 'Minimal', color: 'bg-gray-100 text-gray-800' },
  { id: 'modern', name: 'Modern', color: 'bg-pink-100 text-pink-800' },
  { id: 'animated', name: 'Animated', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'free', name: 'Free', color: 'bg-green-100 text-green-800' },
  { id: 'premium', name: 'Premium', color: 'bg-yellow-100 text-yellow-800' }
];

// Template data
const TEMPLATES = [
  {
    id: 'portfolio-modern',
    name: 'Modern Portfolio',
    category: 'portfolio',
    difficulty: 'beginner',
    tags: ['responsive', 'minimal', 'modern', 'free'],
    preview: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    description: 'A sleek and modern portfolio template perfect for showcasing your work with style.',
    likes: 1243,
    downloads: 8567,
    isNew: true,
    isPopular: true
  },
  {
    id: 'elegant-business',
    name: 'Elegant Business',
    category: 'business',
    difficulty: 'intermediate',
    tags: ['responsive', 'modern', 'premium'],
    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1715&q=80',
    description: 'Professional business template with elegant design and modern features.',
    likes: 987,
    downloads: 5234,
    isPopular: true
  },
  {
    id: 'minimal-blog',
    name: 'Minimal Blog',
    category: 'blog',
    difficulty: 'beginner',
    tags: ['minimal', 'responsive', 'dark-mode'],
    preview: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    description: 'Clean and minimal blog template with focus on content and readability.',
    likes: 765,
    downloads: 4210,
    isNew: true
  },
  {
    id: 'landing-pro',
    name: 'Landing Pro',
    category: 'landing',
    difficulty: 'advanced',
    tags: ['responsive', 'animated', 'modern', 'premium'],
    preview: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    description: 'High-converting landing page template with smooth animations.',
    likes: 1543,
    downloads: 8765,
    isPopular: true
  },
  {
    id: 'ecommerce-starter',
    name: 'E-commerce Starter',
    category: 'ecommerce',
    difficulty: 'intermediate',
    tags: ['responsive', 'ecommerce', 'modern'],
    preview: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    description: 'Complete e-commerce template with product listings and cart functionality.',
    likes: 1120,
    downloads: 6890
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    category: 'portfolio',
    difficulty: 'intermediate',
    tags: ['creative', 'responsive', 'modern', 'free'],
    preview: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1744&q=80',
    description: 'Creative portfolio template with unique layouts and animations.',
    likes: 876,
    downloads: 5432,
    isNew: true
  }
];

const NewProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [templates, setTemplates] = useState(TEMPLATES);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const modalRef = useRef(null);
  
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    templateId: 'blank'
  });

  // Filter templates based on search, category, difficulty, and tags
  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = difficulty === 'all' || template.difficulty === difficulty;
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => template.tags.includes(tag));
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesTags;
  });

  // Sort templates
  const sortedTemplates = [...filteredTables].sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes;
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'downloads') return b.downloads - a.downloads;
    return 0;
  });

  // Toggle tag selection
  const toggleTag = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
  };

  // Handle template selection
  const handleTemplateSelect = (templateId) => {
    setNewProject(prev => ({
      ...prev,
      templateId
    }));
  };

  // Handle template preview
  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newProject.name.trim()) {
      onProjectCreated({
        ...newProject,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      });
      onClose();
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <motion.div 
          className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <motion.div
          ref={modalRef}
          className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full max-h-[90vh] flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
                <p className="text-sm text-gray-500 mt-1">Choose a template or start from scratch</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                  title={viewMode === 'grid' ? 'List View' : 'Grid View'}
                >
                  {viewMode === 'grid' ? (
                    <FiLayers className="w-5 h-5" />
                  ) : (
                    <FiGrid className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="mt-6">
              <div className="flex items-center">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: '50%' }}
                  />
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Step 1 of 2
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              {/* Search and Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search templates..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <button
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="flex items-center space-x-2 px-4 py-2.5 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      <FiFilter className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Filters</span>
                      <FiChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isFilterOpen ? 'transform rotate-180' : ''}`} />
                    </button>
                    
                    {/* Filter Dropdown */}
                    {isFilterOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-10 overflow-hidden">
                        <div className="p-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-3">Difficulty</h3>
                          <div className="space-y-2">
                            {DIFFICULTY_LEVELS.map((level) => (
                              <button
                                key={level.id}
                                onClick={() => setDifficulty(level.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  difficulty === level.id 
                                    ? 'bg-blue-50 text-blue-700' 
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {level.name}
                              </button>
                            ))}
                          </div>
                          
                          <h3 className="text-sm font-medium text-gray-700 mt-4 mb-3">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {TAGS.map((tag) => (
                              <button
                                key={tag.id}
                                onClick={() => toggleTag(tag.id)}
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                  selectedTags.includes(tag.id) 
                                    ? `${tag.color} ring-2 ring-offset-2 ring-blue-500/30` 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {selectedTags.includes(tag.id) && <FiCheck className="mr-1 h-3 w-3" />}
                                {tag.name}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end">
                          <button
                            onClick={() => {
                              setSelectedTags([]);
                              setDifficulty('all');
                            }}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 mr-4"
                          >
                            Reset All
                          </button>
                          <button
                            onClick={() => setIsFilterOpen(false)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="newest">Newest First</option>
                      <option value="downloads">Most Downloaded</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Categories */}
              <div className="mb-6 overflow-x-auto pb-2 -mx-1">
                <div className="flex space-x-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center space-x-2 transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <span className={selectedCategory === category.id ? 'text-white' : 'text-gray-500'}>
                        {category.icon}
                      </span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Templates Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse"></div>
                  ))}
                </div>
              ) : filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Blank Project Card */}
                  <div 
                    className={`relative group bg-white rounded-2xl border-2 ${
                      newProject.templateId === 'blank' 
                        ? 'border-blue-500 ring-2 ring-blue-500/20' 
                        : 'border-gray-200 hover:border-gray-300'
                    } overflow-hidden transition-all duration-200 cursor-pointer`}
                    onClick={() => handleTemplateSelect('blank')}
                  >
                    <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-3">
                          <FiPlus className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Blank Project</h3>
                        <p className="mt-1 text-sm text-gray-500">Start from scratch with a blank canvas</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">Blank</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Custom
                        </span>
                      </div>
                    </div>
                    {newProject.templateId === 'blank' && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
                        <FiCheck className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  
                  {/* Template Cards */}
                  {filteredTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`relative group bg-white rounded-2xl border-2 ${
                        newProject.templateId === template.id 
                          ? 'border-blue-500 ring-2 ring-blue-500/20' 
                          : 'border-gray-200 hover:border-gray-300'
                      } overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md`}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      {/* Template Preview */}
                      <div className="relative pt-[56.25%] bg-gray-100 overflow-hidden">
                        <img
                          src={template.preview}
                          alt={template.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <div className="w-full">
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {template.tags.slice(0, 3).map((tagId) => {
                                const tag = TAGS.find(t => t.id === tagId);
                                return tag ? (
                                  <span 
                                    key={tagId} 
                                    className={`${tag.color} text-xs px-2 py-1 rounded-full`}
                                  >
                                    {tag.name}
                                  </span>
                                ) : null;
                              })}
                              {template.tags.length > 3 && (
                                <span className="bg-gray-800/80 text-white text-xs px-2 py-1 rounded-full">
                                  +{template.tags.length - 3}
                                </span>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                className="flex-1 px-3 py-1.5 bg-white/90 text-gray-900 text-sm font-medium rounded-lg hover:bg-white transition-colors flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePreview(template);
                                }}
                              >
                                <FiEye className="mr-1.5 h-4 w-4" />
                                Preview
                              </button>
                              <button className="p-1.5 bg-white/90 text-gray-700 rounded-lg hover:bg-white transition-colors">
                                <FiHeart className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex space-x-2">
                          {template.isNew && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              New
                            </span>
                          )}
                          {template.isPopular && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Template Info */}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-900">{template.name}</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            template.difficulty === 'beginner' 
                              ? 'bg-blue-100 text-blue-800' 
                              : template.difficulty === 'intermediate'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-pink-100 text-pink-800'
                          }`}>
                            {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{template.description}</p>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <FiHeart className="h-4 w-4 mr-1" />
                              <span>{template.likes.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center">
                              <FiDownload className="h-4 w-4 mr-1" />
                              <span>{(template.downloads / 1000).toFixed(1)}k</span>
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            {template.tags.includes('premium') ? (
                              <span className="text-amber-600">Premium</span>
                            ) : (
                              <span className="text-green-600">Free</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {newProject.templateId === template.id && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white p-1.5 rounded-full shadow-lg">
                          <FiCheck className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                  <div className="mx-auto h-16 w-16 text-gray-300 mb-4">
                    <FiSearch className="h-full w-full" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No templates found</h3>
                  <p className="mt-1 text-gray-500 max-w-md mx-auto">
                    We couldn't find any templates matching your criteria. Try adjusting your search or filter settings.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setDifficulty('all');
                      setSelectedTags([]);
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <FiRefreshCw className="mr-2 h-4 w-4" />
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-gray-200 px-6 py-4 sticky bottom-0 z-10">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Project name"
                    className="block w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all duration-200"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-xs text-gray-400">
                      {newProject.name ? 30 - newProject.name.length : 30}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-500 hidden sm:block">
                  {newProject.name ? `${newProject.name.length}/30 characters` : 'Enter project name'}
                </span>
              </div>
              <div className="flex space-x-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!newProject.name.trim()}
                  className={`w-full sm:w-auto px-6 py-2.5 border border-transparent rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                    newProject.name.trim()
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Continue to Dashboard
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && selectedTemplate && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsPreviewOpen(false)}
            />
            
            <div className="flex items-center justify-center min-h-screen p-4">
              <motion.div
                className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Preview Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{selectedTemplate.name} - Preview</h3>
                  <div className="flex items-center space-x-3">
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      onClick={() => setIsPreviewOpen(false)}
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Preview Content */}
                <div className="flex-1 overflow-auto p-6">
                  <div className="mb-6">
                    <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-inner border border-gray-200">
                      <img 
                        src={selectedTemplate.preview} 
                        alt={selectedTemplate.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedTemplate.name}</h3>
                      <p className="text-gray-600 mb-4">{selectedTemplate.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedTemplate.tags.map((tagId) => {
                          const tag = TAGS.find(t => t.id === tagId);
                          return tag ? (
                            <span 
                              key={tagId} 
                              className={`${tag.color} text-xs px-3 py-1 rounded-full`}
                            >
                              {tag.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-medium text-gray-900 mb-3">Template Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Difficulty</p>
                            <p className="font-medium">
                              {selectedTemplate.difficulty.charAt(0).toUpperCase() + selectedTemplate.difficulty.slice(1)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Category</p>
                            <p className="font-medium">
                              {categories.find(c => c.id === selectedTemplate.category)?.name || 'General'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Likes</p>
                            <p className="font-medium">{selectedTemplate.likes.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Downloads</p>
                            <p className="font-medium">{selectedTemplate.downloads.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="bg-gray-50 p-5 rounded-xl sticky top-6">
                        <div className="text-center mb-6">
                          <p className="text-3xl font-bold text-gray-900 mb-1">
                            {selectedTemplate.tags.includes('premium') ? '$49' : 'Free'}
                          </p>
                          <p className="text-sm text-gray-500">one-time payment</p>
                        </div>
                        
                        <button
                          onClick={() => {
                            handleTemplateSelect(selectedTemplate.id);
                            setIsPreviewOpen(false);
                          }}
                          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 flex items-center justify-center"
                        >
                          <FiCheckCircle className="mr-2 h-5 w-5" />
                          {newProject.templateId === selectedTemplate.id ? 'Selected' : 'Select Template'}
                        </button>
                        
                        <div className="mt-6 space-y-3">
                          <div className="flex items-start">
                            <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">Fully responsive design</span>
                          </div>
                          <div className="flex items-start">
                            <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">Clean & modern code</span>
                          </div>
                          <div className="flex items-start">
                            <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">Easy to customize</span>
                          </div>
                          {selectedTemplate.tags.includes('premium') ? (
                            <div className="flex items-start">
                              <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">Premium support</span>
                            </div>
                          ) : (
                            <div className="flex items-start">
                              <FiDownload className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">Free download</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewProjectModal;
