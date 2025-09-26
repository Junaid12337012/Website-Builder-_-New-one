import React from 'react';
import { FiLayers, FiPlus, FiSearch, FiFilter, FiGrid, FiList } from 'react-icons/fi';
import DashboardLayout from './DashboardLayout';

const Projects = () => {
  const projects = [
    {
      id: 1,
      name: 'E-commerce Store',
      description: 'A modern online store with product listings and cart functionality',
      lastUpdated: '2 hours ago',
      status: 'In Progress',
      progress: 75,
    },
    {
      id: 2,
      name: 'Portfolio Website',
      description: 'Professional portfolio with project showcase and contact form',
      lastUpdated: '1 day ago',
      status: 'Published',
      progress: 100,
    },
    {
      id: 3,
      name: 'Blog Platform',
      description: 'Content management system for publishing articles',
      lastUpdated: '3 days ago',
      status: 'Draft',
      progress: 30,
    },
  ];

  return (
    <DashboardLayout>
      <div className="">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-gray-300">Manage and track all your website projects</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FiPlus className="mr-2" />
            New Project
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-80">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-300"
              />
            </div>
            <div className="flex space-x-2">
              <button className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700 text-gray-300">
                <FiFilter />
              </button>
              <button className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700 text-gray-300">
                <FiGrid />
              </button>
              <button className="p-2 rounded-lg border border-gray-600 bg-gray-700 text-white">
                <FiList />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-700 rounded-xl p-4 hover:bg-gray-750 hover:bg-gray-750/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-white">{project.name}</h3>
                    <p className="text-sm text-gray-300 mt-1">{project.description}</p>
                    <div className="mt-3 flex items-center text-sm text-gray-400">
                      <span className="mr-4">Last updated: {project.lastUpdated}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        project.status === 'Published' ? 'bg-green-900/40 text-green-300 border border-green-700' :
                        project.status === 'In Progress' ? 'bg-blue-900/40 text-blue-300 border border-blue-700' :
                        'bg-yellow-900/40 text-yellow-300 border border-yellow-700'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="w-48">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Projects;
