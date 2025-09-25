import { useEffect, useState } from 'react'
import { FiEdit2, FiTrash2, FiEye, FiPlus, FiLogOut, FiGrid, FiLayers } from 'react-icons/fi'
import api from '../lib/api'
import { getToken } from '../lib/auth'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [projectName, setProjectName] = useState('')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)

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
    e.preventDefault()
    if (!projectName.trim()) return
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/projects', { name: projectName })
      setProjects((p) => [data.project, ...p])
      setProjectName('')
      setShowNewProjectForm(false)
      navigate(`/editor/${data.project._id}`)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      await api.delete(`/projects/${projectId}`)
      setProjects(projects.filter(p => p._id !== projectId))
    } catch (err) {
      setError('Failed to delete project')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Website Builder</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <FiLogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">My Projects</h2>
          <button
            onClick={() => setShowNewProjectForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            New Project
          </button>
        </div>

        {/* New Project Form */}
        {showNewProjectForm && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
            <h3 className="text-lg font-medium text-white mb-4">Create New Project</h3>
            <form onSubmit={createProject} className="space-y-4">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-1">
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  className="block w-full sm:text-sm rounded-md p-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-offset-0"
                  placeholder="My Awesome Website"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewProjectForm(false)}
                  className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {loading && !projects.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg shadow-lg border border-gray-700/50">
            <FiLayers className="mx-auto h-12 w-12 text-gray-500" />
            <h3 className="mt-2 text-lg font-medium text-white">No projects</h3>
            <p className="mt-1 text-sm text-gray-400">Get started by creating a new project.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowNewProjectForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                New Project
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project._id} className="bg-gray-800/50 overflow-hidden shadow-lg rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-colors duration-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-600 rounded-md p-3">
                      <FiGrid className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-white truncate">{project.name}</h3>
                      <p className="mt-1 text-sm text-gray-400">
                        Last updated: {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 px-5 py-3 flex justify-end space-x-3 border-t border-gray-700/50">
                  <button
                    onClick={() => deleteProject(project._id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="Delete project"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                  <Link
                    to={`/editor/${project._id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <FiEdit2 className="-ml-0.5 mr-1.5 h-4 w-4" />
                    Edit
                  </Link>
                  <Link
                    to={`/preview/${project._id}`}
                    target="_blank"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    <FiEye className="-ml-0.5 mr-1.5 h-4 w-4" />
                    Preview
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
