import React, { useState } from 'react';
import { FiSettings, FiUser, FiLock, FiBell, FiCreditCard, FiGlobe, FiDownload, FiTrash2 } from 'react-icons/fi';
import DashboardLayout from './DashboardLayout';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Inc',
    timezone: 'America/New_York',
    notifications: {
      email: true,
      push: true,
      newsletter: false
    },
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiLock },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'billing', label: 'Billing', icon: FiCreditCard },
    { id: 'preferences', label: 'Preferences', icon: FiSettings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white">Profile Information</h3>
              <p className="mt-1 text-sm text-gray-300">Update your account's profile information and email address.</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-2xl text-gray-200">
                {formData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <button 
                  type="button"
                  className="text-sm font-medium text-blue-400 hover:text-blue-300"
                >
                  Change
                </button>
                <p className="mt-1 text-xs text-gray-400">
                  JPG, GIF or PNG. Max size of 2MB
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Full name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full sm:text-sm bg-gray-700 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full sm:text-sm bg-gray-700 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="company" className="block text-sm font-medium text-gray-300">
                  Company
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="company"
                    id="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="block w-full sm:text-sm bg-gray-700 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white">Update Password</h3>
              <p className="mt-1 text-sm text-gray-300">
                Ensure your account is using a long, random password to stay secure.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">
                  Current Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="block w-full sm:text-sm bg-gray-700 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="block w-full sm:text-sm bg-gray-700 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="block w-full sm:text-sm bg-gray-700 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure how you receive notifications.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email"
                    name="email"
                    type="checkbox"
                    checked={formData.notifications.email}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email" className="font-medium text-gray-700">Email notifications</label>
                  <p className="text-gray-500">Get notified about important updates and changes.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="push"
                    name="push"
                    type="checkbox"
                    checked={formData.notifications.push}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="push" className="font-medium text-gray-700">Push notifications</label>
                  <p className="text-gray-500">Get push notifications on your device.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newsletter"
                    name="newsletter"
                    type="checkbox"
                    checked={formData.notifications.newsletter}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="newsletter" className="font-medium text-gray-700">Newsletter</label>
                  <p className="text-gray-500">Receive our monthly newsletter with updates and tips.</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white">Billing Information</h3>
              <p className="mt-1 text-sm text-gray-300">
                Manage your subscription and payment methods.
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-white">Current Plan</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-300">Pro Plan - $29/month</p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900"
                >
                  Change Plan
                </button>
              </div>
              <div className="border-t border-gray-700 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-400">Next Billing Date</dt>
                    <dd className="mt-1 text-sm text-gray-100">March 15, 2023</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-400">Payment Method</dt>
                    <dd className="mt-1 text-sm text-gray-100">Visa ending in 4242</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-400">Billing Email</dt>
                    <dd className="mt-1 text-sm text-gray-100">billing@example.com</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-400">Billing Address</dt>
                    <dd className="mt-1 text-sm text-gray-100">
                      123 Main St<br />
                      San Francisco, CA 94103
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="px-4 py-4 bg-gray-900/40 border-t border-gray-700 text-right sm:px-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900"
                >
                  <FiDownload className="-ml-1 mr-2 h-5 w-5 text-gray-300" />
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white">Preferences</h3>
              <p className="mt-1 text-sm text-gray-300">
                Customize your application preferences.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-300">
                  Timezone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Language</label>
                <select
                  id="language"
                  name="language"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  defaultValue="en"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Theme</label>
                <div className="mt-2 space-x-4 flex">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-gray-300">Light</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-300">Dark</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="system"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-300">System</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-300">Manage your account settings and preferences</p>
        </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
        {/* Sidebar navigation */}
        <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'bg-blue-900/30 border-blue-500 text-blue-400 hover:bg-blue-900/40'
                    : 'border-transparent text-gray-300 hover:bg-gray-800 hover:text-white'
                } group border-l-4 border-gray-700 px-3 py-2 flex items-center text-sm font-medium w-full text-left rounded-md`}
              >
                <tab.icon
                  className={`${
                    activeTab === tab.id ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'
                  } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                  aria-hidden="true"
                />
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          <form onSubmit={handleSubmit}>
            {renderTabContent()}
            
            {(activeTab === 'profile' || activeTab === 'security' || activeTab === 'preferences') && (
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-800 py-2 px-4 border border-gray-600 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Danger zone */}
          {activeTab === 'profile' && (
            <div className="bg-gray-800 border border-gray-700 sm:rounded-lg mt-8">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-white">Delete account</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-300">
                  <p>Once you delete your account, there is no going back. Please be certain.</p>
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 border border-red-700 font-medium rounded-md text-red-300 bg-red-900/30 hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900 sm:text-sm"
                  >
                    <FiTrash2 className="-ml-1 mr-2 h-5 w-5" />
                    Delete account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
