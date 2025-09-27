import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  FiX, 
  FiSearch, 
  FiGrid, 
  FiLayers, 
  FiShoppingBag, 
  FiBriefcase, 
  FiFileText, 
  FiMonitor,
  FiStar,
  FiTrendingUp,
  FiAward,
  FiClock,
  FiLayout,
  FiDownload,
  FiEye,
  FiHeart,
  FiShare2,
  FiTag,
  FiMaximize2,
  FiMinimize2,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

// Template category icons
const CATEGORY_ICONS = {
  all: <FiGrid className="mr-2" />,
  business: <FiBriefcase className="mr-2" />,
  portfolio: <FiAward className="mr-2" />,
  ecommerce: <FiShoppingBag className="mr-2" />,
  blog: <FiFileText className="mr-2" />,
  landing: <FiMonitor className="mr-2" />,
  featured: <FiStar className="mr-2" />,
  trending: <FiTrendingUp className="mr-2" />,
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
  { id: 'responsive', name: 'Responsive' },
  { id: 'mobile-first', name: 'Mobile First' },
  { id: 'dark-mode', name: 'Dark Mode' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'modern', name: 'Modern' },
  { id: 'animated', name: 'Animated' },
  { id: 'free', name: 'Free' },
  { id: 'premium', name: 'Premium' }
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

const NewProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  // All state hooks at the top
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTags, setSelectedTags] = useState([]);
  const [quickViewTemplate, setQuickViewTemplate] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    templateId: 'blank'
  });
  
  // Add tags to mock templates
  const templateTags = {
    portfolio: ['responsive', 'minimal', 'modern'],
    business: ['responsive', 'modern', 'dark-mode'],
    ecommerce: ['responsive', 'mobile-first', 'animated'],
    blog: ['responsive', 'minimal'],
    landing: ['responsive', 'modern', 'animated'],
    restaurant: ['responsive', 'modern']
  };
  
  const navigate = useNavigate();
  const selectedTemplate = templates.find(t => t.id === newProject.templateId) || {};

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // First try to fetch from API
        try {
          const response = await axios.get('/api/projects/templates');
          if (response.data?.templates?.length > 0) {
            const enhancedTemplates = response.data.templates.map(template => ({
              ...template,
              likes: Math.floor(Math.random() * 1000),
              downloads: Math.floor(Math.random() * 5000),
              rating: (Math.random() * 1 + 4).toFixed(1),
              difficulty: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
              isFeatured: Math.random() > 0.7,
              isTrending: Math.random() > 0.8,
              lastUpdated: new Date()
            }));
            setTemplates(enhancedTemplates);
            return;
          }
        } catch (error) {
          console.log('Using fallback templates:', error.message);
        }
        
        // Fallback to mock templates if API fails
        const mockTemplates = [
          {
            id: 'portfolio',
            name: 'Portfolio',
            description: 'A clean and modern portfolio template to showcase your work',
            category: 'portfolio',
            thumbnail: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            likes: 1243,
            downloads: 4567,
            rating: '4.7',
            difficulty: 'beginner',
            isFeatured: true,
            isTrending: true,
            lastUpdated: new Date()
          },
          {
            id: 'business',
            name: 'Business',
            description: 'Professional business website template with modern design',
            category: 'business',
            thumbnail: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            likes: 987,
            downloads: 3210,
            rating: '4.5',
            difficulty: 'intermediate',
            isFeatured: true,
            isTrending: false,
            lastUpdated: new Date()
          },
          {
            id: 'ecommerce',
            name: 'E-commerce',
            description: 'Complete e-commerce template with product listings and cart',
            category: 'ecommerce',
            thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            likes: 2456,
            downloads: 7890,
            rating: '4.8',
            difficulty: 'advanced',
            isFeatured: true,
            isTrending: true,
            lastUpdated: new Date()
          },
          {
            id: 'blog',
            name: 'Blog',
            description: 'Elegant blog template with clean typography',
            category: 'blog',
            thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            likes: 765,
            downloads: 2987,
            rating: '4.3',
            difficulty: 'beginner',
            isFeatured: false,
            isTrending: true,
            lastUpdated: new Date()
          },
          {
            id: 'landing',
            name: 'Landing Page',
            description: 'High-converting landing page template',
            category: 'landing',
            thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            likes: 1543,
            downloads: 5432,
            rating: '4.6',
            difficulty: 'intermediate',
            isFeatured: true,
            isTrending: false,
            lastUpdated: new Date()
          },
          {
            id: 'restaurant',
            name: 'Restaurant',
            description: 'Appetizing restaurant template with menu and reservation',
            category: 'business',
            thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            likes: 876,
            downloads: 3210,
            rating: '4.4',
            difficulty: 'intermediate',
            isFeatured: false,
            isTrending: true,
            lastUpdated: new Date()
          }
        ];
        
        setTemplates(mockTemplates);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      // Filter by search term
      const matchesSearch = !searchTerm || 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by category
      const matchesCategory = selectedCategory === 'all' || 
        (selectedCategory === 'featured' && template.isFeatured) ||
        (selectedCategory === 'trending' && template.isTrending) ||
        template.category === selectedCategory;
      
      // Filter by difficulty
      const matchesDifficulty = difficulty === 'all' || 
        template.difficulty === difficulty;
      
      // Filter by tags
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => template.tags?.includes(tag));
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesTags;
    }).sort((a, b) => {
      // Sort templates
      if (sortBy === 'popular') {
        return b.downloads - a.downloads;
      } else if (sortBy === 'newest') {
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      } else if (sortBy === 'rating') {
        return parseFloat(b.rating) - parseFloat(a.rating);
      }
      return 0;
    });
  }, [templates, searchTerm, selectedCategory, difficulty, sortBy]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateSelect = (templateId) => {
    setNewProject(prev => ({
      ...prev,
      templateId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) {
      alert('Please enter a project name');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Creating project with data:', {
        name: newProject.name,
        description: newProject.description,
        templateId: newProject.templateId
      });
      
      const response = await api.post('/projects', {
        name: newProject.name.trim(),
        description: newProject.description?.trim() || '',
        templateId: newProject.templateId || 'blank'
      });

      console.log('Project creation response:', response);

      if (response.status >= 400) {
        throw new Error(response.data?.message || 'Failed to create project');
      }
      
      if (onProjectCreated && response.data?.project) {
        onProjectCreated(response.data.project);
      } else {
        throw new Error('Invalid response from server');
      }
      
      // Reset form
      setNewProject({
        name: '',
        description: '',
        templateId: 'blank'
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create project. Please try again.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle overlay click (outside modal content)
  const handleOverlayClick = (e) => {
    // Close when clicking on the overlay (semi-transparent background)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle template item click
  const handleTemplateClick = (e, templateId) => {
    e.stopPropagation();
    handleTemplateSelect(templateId);
  };

  // Handle close button click
  const handleCloseClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  // Quick View Modal
  const QuickViewModal = ({ template, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90">
      <div className="relative w-full max-w-6xl bg-gray-800 rounded-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-xl font-medium text-white">{template.name} - Preview</h3>
          <div className="flex space-x-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-400 hover:text-white focus:outline-none"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white focus:outline-none"
              aria-label="Close preview"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
            <img
              src={template.thumbnail}
              alt={template.name}
              className="w-full h-auto"
            />
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h4 className="text-lg font-medium text-white mb-2">Template Details</h4>
              <p className="text-gray-300">{template.description}</p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {template.tags?.map(tag => (
                  <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {TAGS.find(t => t.id === tag)?.name || tag}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-400">Difficulty:</span>
                  <span className="ml-2 text-white capitalize">{template.difficulty}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Category:</span>
                  <span className="ml-2 text-white capitalize">{template.category}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Rating:</span>
                  <span className="ml-2 text-yellow-400">{template.rating} ★</span>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Downloads:</span>
                  <span className="ml-2 text-white">{template.downloads?.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <h5 className="font-medium text-white mb-4">Template Features</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Fully Responsive
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mobile Optimized
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Clean & Modern Design
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Easy to Customize
                </li>
              </ul>
              
              <button
                onClick={() => {
                  handleTemplateSelect({ preventDefault: () => {} }, template.id);
                  onClose();
                }}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Select This Template
              </button>
              
              <button className="mt-3 w-full flex items-center justify-center text-blue-400 hover:text-blue-300 text-sm">
                <FiExternalLink className="mr-1" /> View Live Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Early return after all hooks
  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className={`fixed inset-0 z-50 overflow-y-auto ${isFullscreen ? 'bg-gray-900' : ''}`}
      onClick={handleOverlayClick}
    >
      {quickViewTemplate && (
        <QuickViewModal 
          template={quickViewTemplate} 
          onClose={() => setQuickViewTemplate(null)} 
        />
      )}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div 
          className="inline-block w-full max-w-4xl text-left align-bottom bg-gray-800 rounded-lg shadow-xl transform transition-all sm:my-8 sm:align-middle relative"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium text-white" id="modal-headline">Create New Project</h3>
              <button
                onClick={handleCloseClick}
                className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                aria-label="Close modal"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="px-6 py-4">
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="project-name" className="block text-sm font-medium text-gray-300 mb-1">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="project-name"
                    name="name"
                    value={newProject.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    placeholder="My Awesome Project"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="project-description" className="block text-sm font-medium text-gray-300 mb-1">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    id="project-description"
                    name="description"
                    value={newProject.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    placeholder="A brief description of your project"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newProject.name.trim() || !newProject.templateId}
                  className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                    newProject.name.trim() && newProject.templateId
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  Create Project
                </button>
              </div>
            </form>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-white">Choose a Template</h4>
                <div className="relative w-64">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-sm"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-6 space-y-4">
                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </button>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedTags.includes(tag.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <FiTag className="mr-1" size={12} />
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-gray-700 rounded-lg overflow-hidden animate-pulse h-64"></div>
                  ))}
                </div>
              ) : filteredTemplates.length > 0 ? (
                <div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto p-2 custom-scrollbar"
                  onClick={(e) => e.stopPropagation()}
                >
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`relative border rounded-lg overflow-hidden transition-all bg-white dark:bg-gray-800 shadow-sm hover:shadow-md group ${
                        newProject.templateId === template.id
                          ? 'ring-2 ring-blue-500 border-blue-500'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {template.thumbnail ? (
                          <div className="relative w-full h-full overflow-hidden">
                            <img
                              src={template.thumbnail}
                              alt={template.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                              <div className="w-full">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setQuickViewTemplate(template);
                                  }}
                                  className="w-full mb-2 bg-white/90 text-gray-900 hover:bg-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center"
                                >
                                  <FiMaximize2 className="mr-2" size={14} />
                                  Quick View
                                </button>
                                <button
                                  onClick={(e) => handleTemplateClick(e, template.id)}
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
                                >
                                  Select Template
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors p-6 text-center">
                            <FiLayers className="w-10 h-10 mx-auto mb-2" />
                            <span className="text-sm">No Preview Available</span>
                          </div>
                        )}
                        
                        {template.isFeatured && (
                          <span className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                            Featured
                          </span>
                        )}
                        
                        <div className="absolute top-2 right-2 flex items-center bg-black/80 text-white text-xs px-2 py-1 rounded-full">
                          <FiStar className="text-yellow-400 mr-1" size={12} />
                          {template.rating}
                        </div>
                        
                        {template.isTrending && (
                          <span className="absolute bottom-2 left-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                            Trending
                          </span>
                        )}
                      </div>
                      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 dark:text-white truncate">{template.name}</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{template.description}</p>
                          </div>
                          <span 
                            className={`ml-2 flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              template.difficulty === 'beginner' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/80 dark:text-green-200' 
                                : template.difficulty === 'intermediate'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/80 dark:text-blue-200'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900/80 dark:text-purple-200'
                            }`}
                            title={`${template.difficulty} level`}
                          >
                            {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
                          </span>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <FiDownload className="w-3.5 h-3.5 mr-1" />
                            <span>{template.downloads.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex space-x-1">
                            {template.tags?.slice(0, 2).map(tag => (
                              <span 
                                key={tag} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                title={TAGS.find(t => t.id === tag)?.name}
                              >
                                {tag.split('-')[0]}
                              </span>
                            ))}
                            {template.tags?.length > 2 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                +{template.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {newProject.templateId === template.id && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiSearch className="mx-auto text-gray-500 w-12 h-12 mb-4" />
                  <h4 className="text-lg font-medium text-white">No templates found</h4>
                  <p className="text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProjectModal;
