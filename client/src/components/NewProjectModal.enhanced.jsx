import React, { useState, useEffect, useRef } from 'react';
import { 
  FiX, FiSearch, FiGrid, FiLayers, FiShoppingBag, FiBriefcase, 
  FiFileText, FiMonitor, FiStar, FiTrendingUp, FiAward, FiClock,
  FiLayout, FiDownload, FiEye, FiHeart, FiShare2, FiTag, 
  FiMaximize2, FiMinimize2, FiExternalLink, FiChevronLeft, 
  FiChevronRight, FiPlus, FiFilter, FiCheck, FiChevronDown
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Template category icons
const CATEGORY_ICONS = {
  all: <FiGrid className="mr-2" />,
  business: <FiBriefcase className="mr-2" />,
  portfolio: <FiAward className="mr-2" />,
  ecommerce: <FiShoppingBag className="mr-2" />,
  blog: <FiFileText className="mr-2" />,
  landing: <FiMonitor className="mr-2" />,
  featured: <FiStar className="mr-2 text-amber-400" />,
  trending: <FiTrendingUp className="mr-2 text-green-400" />,
  general: <FiLayout className="mr-2" />
};

// Template difficulty levels
const DIFFICULTY_LEVELS = [
  { id: 'all', name: 'All Levels' },
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' }
];

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

// Mock templates data
const mockTemplates = [
  {
    id: 'portfolio-modern',
    name: 'Modern Portfolio',
    category: 'portfolio',
    difficulty: 'beginner',
    tags: ['responsive', 'minimal', 'modern'],
    preview: 'https://via.placeholder.com/600x400/1a1a2e/ffffff?text=Portfolio',
    description: 'A sleek and modern portfolio template perfect for showcasing your work.'
  },
  // Add more mock templates...
];

const NewProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const modalRef = useRef(null);
  
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    templateId: 'blank'
  });

  // Load templates
  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      // In a real app, you would fetch templates from an API
      setTimeout(() => {
        setTemplates(mockTemplates);
        setIsLoading(false);
      }, 800);
    };

    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  // Filter templates based on search, category, difficulty, and tags
  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = difficulty === 'all' || template.difficulty === difficulty;
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => template.tags.includes(tag));
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesTags;
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
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm" />
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Create New Project</h2>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            {/* Progress Steps */}
            <div className="mt-4 flex items-center">
              <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white w-1/2 rounded-full" />
              </div>
              <span className="ml-4 text-sm font-medium text-white">Step 1 of 2</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white p-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FiFilter className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filters</span>
                  <FiChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isFilterOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {/* Filter Dropdown */}
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Difficulty</h3>
                      <div className="space-y-2">
                        {DIFFICULTY_LEVELS.map((level) => (
                          <label key={level.id} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              checked={difficulty === level.id}
                              onChange={() => setDifficulty(level.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="text-sm text-gray-700">{level.name}</span>
                          </label>
                        ))}
                      </div>
                      
                      <h3 className="text-sm font-medium text-gray-700 mt-4 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {TAGS.map((tag) => (
                          <button
                            key={tag.id}
                            onClick={() => toggleTag(tag.id)}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${selectedTags.includes(tag.id) ? tag.color + ' ring-2 ring-offset-2 ring-blue-500' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                          >
                            {selectedTags.includes(tag.id) && <FiCheck className="mr-1 h-3 w-3" />}
                            {tag.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FiGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FiLayers className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Categories */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex space-x-2 pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium flex items-center transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.icon}
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Templates Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
                ))}
              </div>
            ) : filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`group relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                      newProject.templateId === template.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className="relative pt-[56.25%] bg-gray-100 overflow-hidden">
                      <img
                        src={template.preview}
                        alt={template.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <div className="text-white">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {template.tags.map((tagId) => {
                              const tag = TAGS.find(t => t.id === tagId);
                              return tag ? (
                                <span key={tagId} className={`${tag.color} text-xs px-2 py-0.5 rounded-full`}>
                                  {tag.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                          <button className="text-sm font-medium bg-white text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
                            Preview
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900">{template.name}</h3>
                        {template.difficulty === 'beginner' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Beginner
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{template.description}</p>
                    </div>
                    {newProject.templateId === template.id && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
                        <FiCheck className="h-4 w-4" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                  <FiSearch className="h-full w-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No templates found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setDifficulty('all');
                    setSelectedTags([]);
                  }}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Project name"
                  className="block w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  required
                />
              </div>
              <span className="text-sm text-gray-500">
                {newProject.name ? 30 - newProject.name.length : 30} characters left
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!newProject.name.trim()}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  newProject.name.trim()
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-300 cursor-not-allowed'
                }`}
              >
                Create Project
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewProjectModal;
