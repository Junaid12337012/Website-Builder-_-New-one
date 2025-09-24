import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ErrorBoundary>
        <main className="container-app py-8 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<div className="text-gray-600">Page not found</div>} />
          </Routes>
        </main>
      </ErrorBoundary>
      <footer className="border-t bg-white/70 backdrop-blur py-4">
        <div className="container-app text-sm text-gray-500">© {new Date().getFullYear()} Website Builder</div>
      </footer>
    </div>
  )
}

export default App
