import React from 'react';
import { FiBarChart2, FiTrendingUp, FiUsers, FiEye, FiDownload, FiClock } from 'react-icons/fi';

const Analytics = () => {
  // Sample data for charts
  const visitorData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Visitors',
        data: [65, 59, 80, 81, 56, 72],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const pageViewsData = {
    labels: ['Home', 'About', 'Products', 'Contact', 'Blog'],
    datasets: [
      {
        label: 'Page Views',
        data: [1200, 800, 1500, 600, 900],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(236, 72, 153, 0.7)',
          'rgba(139, 92, 246, 0.7)'
        ],
        borderWidth: 0
      }
    ]
  };

  const stats = [
    { name: 'Total Visitors', value: '24,532', change: '+12.5%', icon: FiUsers, changeType: 'increase' },
    { name: 'Page Views', value: '89,234', change: '+8.2%', icon: FiEye, changeType: 'increase' },
    { name: 'Avg. Session', value: '4m 32s', change: '+2.3%', icon: FiClock, changeType: 'increase' },
    { name: 'Bounce Rate', value: '42.3%', change: '-3.1%', icon: FiTrendingUp, changeType: 'decrease' },
  ];

  const topPages = [
    { name: 'Homepage', visitors: '12,345', views: '24,678', conversion: '3.2%' },
    { name: 'Product Page', visitors: '8,765', views: '15,432', conversion: '2.8%' },
    { name: 'About Us', visitors: '5,432', views: '9,876', conversion: '1.9%' },
    { name: 'Contact', visitors: '3,210', views: '5,678', conversion: '1.2%' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        <p className="text-gray-600">Monitor your website's performance and visitor insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                <p className={`text-sm mt-2 flex items-center ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'increase' ? (
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  {stat.change} from last month
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-700">Visitor Overview</h3>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64">
            {/* Chart would be rendered here */}
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
              <p className="text-gray-400">Visitor trend chart</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-700">Page Views</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg">Pages</button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 rounded-lg">Sources</button>
            </div>
          </div>
          <div className="h-64">
            {/* Chart would be rendered here */}
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
              <p className="text-gray-400">Page views chart</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Pages Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Top Pages</h3>
            <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
              <FiDownload className="mr-1" />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitors</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Views</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topPages.map((page, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{page.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.visitors}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.views}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.conversion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-gray-50 text-right text-sm">
          <button className="text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
