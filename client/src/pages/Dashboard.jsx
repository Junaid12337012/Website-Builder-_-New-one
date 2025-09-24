import { useEffect, useState } from 'react'
import api from '../lib/api'
import { getToken, clearToken } from '../lib/auth'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [projectName, setProjectName] = useState('')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!getToken()) {
      navigate('/login')
    }
  }, [navigate])

  const logout = () => {
    clearToken()
    navigate('/login')
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
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
      </div>

      <form onSubmit={createProject} className="flex gap-2">
        <input
          className="flex-1 rounded-md border px-3 py-2"
          placeholder="New Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <button disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Creating...' : 'New Project'}
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div key={p._id || p.id || p.name} className="rounded-lg border bg-white p-4">
            <div className="font-medium">{p.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
