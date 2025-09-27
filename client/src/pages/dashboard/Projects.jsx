import React, { useState, useEffect } from 'react';
import { FiLayers, FiPlus, FiSearch, FiFilter, FiGrid, FiList, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import api from '../../lib/api';
import { Link } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import NewProjectModal from '../../components/NewProjectModal';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'draft', 'published', 'archived'

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
  };

  return (
    <DashboardLayout>
      <div className="">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-gray-300">Manage and track all your website projects</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            New Project
          </button>
          
          <NewProjectModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            onProjectCreated={handleProjectCreated}
          />
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-80">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-300"
              />
            </div>
            <div className="flex space-x-2 w-full md:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              
              <div className="flex border border-gray-600 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  <FiGrid />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-700 rounded-xl p-4 animate-pulse h-40"></div>
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
              {filteredProjects.map((project) => (
                <div 
                  key={project._id} 
                  className={`border border-gray-700 rounded-xl overflow-hidden hover:bg-gray-700/50 transition-colors ${
                    viewMode === 'grid' ? 'flex flex-col h-full' : ''
                  }`}
                >
                  <div className={`${viewMode === 'grid' ? 'p-4 flex-1' : 'p-4'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-medium text-white">{project.name}</h3>
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                            {project.template?.name || 'Custom'}
                          </span>
                        </div>
                        {project.description && (
                          <p className="text-sm text-gray-300 mt-1 line-clamp-2">{project.description}</p>
                        )}
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-400">
                          <span className="text-xs">
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            project.status === 'published' 
                              ? 'bg-green-900/40 text-green-300 border border-green-700' 
                              : project.status === 'archived'
                                ? 'bg-gray-700/40 text-gray-300 border border-gray-600'
                                : 'bg-yellow-900/40 text-yellow-300 border border-yellow-700'
                          }`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      {viewMode === 'list' && (
                        <div className="w-48 ml-4">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Last Updated</span>
                            <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: project.status === 'published' ? '100%' : '50%' }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {viewMode === 'grid' && project.thumbnail && (
                      <div className="mt-4 aspect-video bg-gray-700 rounded-lg overflow-hidden">
                        <img 
                          src={project.thumbnail} 
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-800/50 border-t border-gray-700 p-3 flex justify-end space-x-2">
                    <Link 
                      to={`/editor/${project._id}`}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </Link>
                    <button 
                      className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Preview"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      title="More options"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-xl">
              <FiLayers className="mx-auto text-gray-500 w-12 h-12 mb-4" />
              <h4 className="text-lg font-medium text-white">No projects found</h4>
              <p className="text-gray-400 mt-1 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Get started by creating your first project'}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="mr-2" />
                New Project
              </button>
              <NewProjectModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={handleProjectCreated}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
export default Projects;
