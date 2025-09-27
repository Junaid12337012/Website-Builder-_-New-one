import React, { useState } from 'react';
import { 
  FiBarChart2, FiTrendingUp, FiUsers, FiEye, FiDownload, 
  FiClock, FiFilter, FiRefreshCw, FiExternalLink, FiDollarSign,
  FiShoppingCart, FiCreditCard, FiPieChart, FiMapPin, FiGlobe,
  FiTablet, FiSmartphone, FiMonitor, FiTable, FiPieChart as FiPieChart2
} from 'react-icons/fi';
import DashboardLayout from './DashboardLayout';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate data refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Stats data
  const stats = [
    { 
      name: 'Total Visitors', 
      value: '24,532', 
      change: '+12.5%', 
      icon: <FiUsers className="w-6 h-6" />,
      changeType: 'increase',
      description: 'Total unique visitors',
      color: 'bg-blue-500/10 text-blue-400'
    },
    { 
      name: 'Page Views', 
      value: '89,234', 
      change: '+8.2%', 
      icon: <FiEye className="w-6 h-6" />,
      changeType: 'increase',
      description: 'Total page views',
      color: 'bg-purple-500/10 text-purple-400'
    },
    { 
      name: 'Avg. Session', 
      value: '4m 32s', 
      change: '+2.3%', 
      icon: <FiClock className="w-6 h-6" />,
      changeType: 'increase',
      description: 'Average session duration',
      color: 'bg-green-500/10 text-green-400'
    },
    { 
      name: 'Bounce Rate', 
      value: '42.3%', 
      change: '-3.1%', 
      icon: <FiTrendingUp className="w-6 h-6 transform rotate-180" />,
      changeType: 'decrease',
      description: 'Visitors who left after one page',
      color: 'bg-amber-500/10 text-amber-400'
    },
    { 
      name: 'Conversion Rate', 
      value: '2.8%', 
      change: '+0.7%', 
      icon: <FiShoppingCart className="w-6 h-6" />,
      changeType: 'increase',
      description: 'Visitors who completed a goal',
      color: 'bg-emerald-500/10 text-emerald-400'
    },
    { 
      name: 'Revenue', 
      value: '$12,459', 
      change: '+15.2%', 
      icon: <FiDollarSign className="w-6 h-6" />,
      changeType: 'increase',
      description: 'Total revenue generated',
      color: 'bg-rose-500/10 text-rose-400'
    }
  ];

  // Visitor data for line chart
  const getVisitorData = () => {
    const labels = [];
    const data = [];
    const count = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 12;
    const now = new Date();
    
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now);
      if (timeRange === '12months') {
        date.setMonth(now.getMonth() - i);
        labels.push(date.toLocaleString('default', { month: 'short' }));
      } else {
        date.setDate(now.getDate() - i);
        labels.push(date.toLocaleString('default', { day: 'numeric', month: 'short' }));
      }
      data.push(Math.floor(Math.random() * 1000) + 500);
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Visitors',
          data,
          borderColor: 'rgba(99, 102, 241, 1)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: 'white',
          pointBorderColor: 'rgba(99, 102, 241, 1)',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  };

  // Page views data for bar chart
  const pageViewsData = {
    labels: ['Home', 'Products', 'Blog', 'About', 'Contact', 'Pricing', 'Docs'],
    datasets: [
      {
        label: 'Page Views',
        data: [1200, 800, 1500, 600, 900, 1100, 700],
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  // Traffic sources data for doughnut chart
  const trafficSourcesData = {
    labels: ['Direct', 'Organic Search', 'Social', 'Email', 'Referral'],
    datasets: [
      {
        data: [35, 40, 15, 5, 15],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderWidth: 0,
        hoverOffset: 10
      }
    ]
  };

  // Device distribution data
  const deviceData = [
    { name: 'Desktop', value: 62, icon: <FiMonitor className="w-5 h-5" />, color: 'bg-indigo-500' },
    { name: 'Mobile', value: 30, icon: <FiSmartphone className="w-5 h-5" />, color: 'bg-purple-500' },
    { name: 'Tablet', value: 8, icon: <FiTablet className="w-5 h-5" />, color: 'bg-pink-500' }
  ];

  // Top pages table data
  const topPages = [
    { name: 'Homepage', visitors: '12,345', views: '24,678', bounceRate: '38%', avgTime: '2:45' },
    { name: 'Product Page', visitors: '8,765', views: '15,432', bounceRate: '42%', avgTime: '3:12' },
    { name: 'Blog', visitors: '6,543', views: '12,345', bounceRate: '35%', avgTime: '4:23' },
    { name: 'About Us', visitors: '5,432', views: '9,876', bounceRate: '28%', avgTime: '1:45' },
    { name: 'Contact', visitors: '3,210', views: '5,678', bounceRate: '52%', avgTime: '1:12' },
  ];

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        callbacks: {
          label: (context) => {
            return `${context.parsed.y} visitors`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#9CA3AF'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#9CA3AF',
          callback: (value) => {
            if (value >= 1000) return `${value / 1000}k`;
            return value;
          }
        }
      }
    }
  };

  const barChartOptions = {
    ...lineChartOptions,
    indexAxis: 'y',
    plugins: {
      ...lineChartOptions.plugins,
      tooltip: {
        ...lineChartOptions.plugins.tooltip,
        callbacks: {
          label: (context) => {
            return `${context.parsed.x} views`;
          }
        }
      }
    },
    scales: {
      ...lineChartOptions.scales,
      x: {
        ...lineChartOptions.scales.x,
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        }
      },
      y: {
        ...lineChartOptions.scales.y,
        grid: {
          display: false,
          drawBorder: false
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          color: '#9CA3AF',
          font: {
            size: 12
          },
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8
        }
      },
      tooltip: {
        ...lineChartOptions.plugins.tooltip,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}% (${value})`;
          }
        }
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400">Track and analyze your website's performance</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <div className="relative">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="12months">Last 12 months</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiFilter className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              title="Refresh data"
            >
              <FiRefreshCw className={`w-5 h-5 text-gray-300 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button className="hidden md:flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors">
              <FiDownload className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                  <p className="text-2xl font-semibold mt-1 text-white">{stat.value}</p>
                  <p className="text-xs mt-1 text-gray-400">{stat.description}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'increase' 
                    ? 'bg-green-900/30 text-green-400' 
                    : 'bg-red-900/30 text-red-400'
                }`}>
                  {stat.changeType === 'increase' ? '↑' : '↓'} {stat.change}
                </span>
                <span className="text-xs text-gray-400 ml-2">vs previous period</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Visitor Trends */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Visitor Trends</h3>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <button className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white">Visitors</button>
                <button className="px-3 py-1 text-sm rounded-md text-gray-300 hover:bg-gray-700">Sessions</button>
                <button className="px-3 py-1 text-sm rounded-md text-gray-300 hover:bg-gray-700">Pageviews</button>
              </div>
            </div>
            <div className="h-80">
              <Line data={getVisitorData()} options={lineChartOptions} />
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Traffic Sources</h3>
              <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
            </div>
            <div className="h-64">
              <Doughnut data={trafficSourcesData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Top Pages */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Top Pages</h3>
              <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Page</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Visitors</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Page Views</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Bounce Rate</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Avg. Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {topPages.map((page, index) => (
                    <tr key={index} className="hover:bg-gray-700/50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                        <div className="flex items-center">
                          <FiExternalLink className="mr-2 text-gray-400" />
                          {page.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-right">{page.visitors}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-right">{page.views}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          parseFloat(page.bounceRate) > 50 ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'
                        }`}>
                          {page.bounceRate}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-right">{page.avgTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Device Distribution */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Device Distribution</h3>
              <button className="text-sm text-blue-400 hover:text-blue-300">View Details</button>
            </div>
            <div className="space-y-4">
              {deviceData.map((device, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <div className={`p-1.5 rounded-md ${device.color} text-white mr-3`}>
                        {device.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-200">{device.name}</span>
                    </div>
                    <span className="text-sm font-medium text-white">{device.value}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${device.color}`} 
                      style={{ width: `${device.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-white mb-4">Top Countries</h3>
              <div className="space-y-3">
                {[
                  { name: 'United States', value: '32.4%', change: '+2.1%' },
                  { name: 'United Kingdom', value: '18.7%', change: '-0.5%' },
                  { name: 'Canada', value: '12.5%', change: '+1.2%' },
                  { name: 'Australia', value: '8.9%', change: '+0.8%' },
                  { name: 'Germany', value: '6.3%', change: '-0.3%' },
                ].map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                        <FiGlobe className="w-3 h-3 text-gray-400" />
                      </div>
                      <span className="text-sm text-gray-200">{country.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-white mr-2">{country.value}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        country.change.startsWith('+') 
                          ? 'bg-green-900/30 text-green-400' 
                          : 'bg-red-900/30 text-red-400'
                      }`}>
                        {country.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Page Views */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Top Pages by Views</h3>
              <button className="text-sm text-blue-400 hover:text-blue-300">View Report</button>
            </div>
            <div className="h-80">
              <Bar data={pageViewsData} options={barChartOptions} />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Recent Activity</h3>
              <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
            </div>
            <div className="space-y-4">
              {[
                { 
                  id: 1, 
                  type: 'page_view', 
                  page: 'Homepage', 
                  time: '2 minutes ago',
                  user: 'John Doe',
                  location: 'New York, US',
                  device: 'Desktop'
                },
                { 
                  id: 2, 
                  type: 'signup', 
                  page: 'Sign Up', 
                  time: '15 minutes ago',
                  user: 'jane@example.com',
                  location: 'London, UK',
                  device: 'Mobile'
                },
                { 
                  id: 3, 
                  type: 'purchase', 
                  page: 'Checkout', 
                  time: '1 hour ago',
                  user: 'Robert Johnson',
                  location: 'Toronto, CA',
                  amount: '$149.99',
                  device: 'Tablet'
                },
                { 
                  id: 4, 
                  type: 'download', 
                  page: 'Resources', 
                  time: '3 hours ago',
                  user: 'michael@example.com',
                  location: 'Sydney, AU',
                  file: 'Documentation.pdf',
                  device: 'Desktop'
                },
                { 
                  id: 5, 
                  type: 'form_submission', 
                  page: 'Contact Us', 
                  time: '5 hours ago',
                  user: 'sarah@example.com',
                  location: 'Berlin, DE',
                  form: 'Contact Form',
                  device: 'Mobile'
                },
              ].map((activity) => (
                <div key={activity.id} className="flex items-start pb-4 border-b border-gray-700 last:border-0 last:pb-0">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 mr-3 mt-1">
                    {activity.type === 'page_view' && <FiEye className="w-4 h-4" />}
                    {activity.type === 'signup' && <FiUsers className="w-4 h-4" />}
                    {activity.type === 'purchase' && <FiShoppingCart className="w-4 h-4" />}
                    {activity.type === 'download' && <FiDownload className="w-4 h-4" />}
                    {activity.type === 'form_submission' && <FiTable className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">
                        {activity.type === 'page_view' && `${activity.user} viewed ${activity.page}`}
                        {activity.type === 'signup' && `New signup: ${activity.user}`}
                        {activity.type === 'purchase' && `New purchase: ${activity.amount}`}
                        {activity.type === 'download' && `${activity.user} downloaded ${activity.file}`}
                        {activity.type === 'form_submission' && `${activity.user} submitted ${activity.form}`}
                      </h4>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center text-xs text-gray-400 space-x-3">
                      <span className="flex items-center">
                        <FiMapPin className="w-3 h-3 mr-1" />
                        {activity.location}
                      </span>
                      <span className="flex items-center">
                        {activity.device === 'Desktop' && <FiMonitor className="w-3 h-3 mr-1" />}
                        {activity.device === 'Mobile' && <FiSmartphone className="w-3 h-3 mr-1" />}
                        {activity.device === 'Tablet' && <FiTablet className="w-3 h-3 mr-1" />}
                        {activity.device}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
