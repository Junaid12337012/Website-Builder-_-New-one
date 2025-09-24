import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="border-b bg-white/70 backdrop-blur">
      <div className="container-app h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">Website Builder</Link>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}>
            Home
          </NavLink>
          <NavLink to="/login" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}>
            Login
          </NavLink>
          <NavLink to="/signup" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}>
            Signup
          </NavLink>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}>
            Dashboard
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
