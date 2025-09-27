import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiX, FiHome, FiLayers, FiBarChart2, FiUsers, FiSettings, FiBell } from 'react-icons/fi';

const navItems = [
  { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
  { name: 'Projects', icon: FiLayers, path: '/dashboard/projects' },
  { name: 'Analytics', icon: FiBarChart2, path: '/dashboard/analytics' },
  { name: 'Team', icon: FiUsers, path: '/dashboard/team' },
  { name: 'Settings', icon: FiSettings, path: '/dashboard/settings' },
];

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row overflow-hidden">
      {/* Mobile sidebar backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-gray-800 text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-20 lg:w-64 flex-shrink-0`} aria-label="Sidebar Navigation">
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
              aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              aria-expanded={isSidebarOpen}
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4" role="navigation" aria-label="Dashboard sections">
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
                      aria-current={isActive ? 'page' : undefined}
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
            <div className="flex items-center">
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
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-900" role="main" aria-label="Main content">
        <header className="bg-gray-800 shadow-sm border-b border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="text-gray-400 hover:text-white p-2 rounded-md focus:outline-none lg:hidden"
                  aria-label="Open sidebar"
                  aria-controls="sidebar"
                >
                  <span className="sr-only">Open sidebar</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                {/* Breadcrumb Navigation */}
                <nav className="hidden md:flex items-center text-sm" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-4">
                    <li>
                      <div>
                        <Link to="/dashboard" className="text-gray-300 hover:text-white">
                          Dashboard
                        </Link>
                      </div>
                    </li>
                    {location.pathname !== '/dashboard' && (
                      <li>
                        <div className="flex items-center">
                          <svg className="flex-shrink-0 h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          <Link 
                            to={location.pathname} 
                            className="ml-4 text-sm font-medium text-white hover:text-gray-300"
                          >
                            {navItems.find(item => item.path === location.pathname)?.name || 
                             location.pathname.split('/').pop().charAt(0).toUpperCase() + 
                             location.pathname.split('/').pop().slice(1)}
                          </Link>
                        </div>
                      </li>
                    )}
                  </ol>
                </nav>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none transition-colors relative">
                  <span className="sr-only">View notifications</span>
                  <div className="relative">
                    <FiBell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-800"></span>
                  </div>
                </button>
                
                <div className="hidden md:block h-6 w-px bg-gray-600"></div>
                
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {localStorage.getItem('userName')?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      {localStorage.getItem('userName') || 'User'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-900">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
