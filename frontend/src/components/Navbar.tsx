import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.ts'
import './Navbar.css'

function Navbar() {
  const { isAuthenticated } = useAuth()

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        <Link to="/" className="logo-text">
          🎬 Le movie diary
        </Link>
      </div>

      {/* CENTER */}
      <div className="nav-center">
        <Link to="/" className="nav-link">Home</Link>

        {isAuthenticated && (
          <Link to="/perso" className="nav-link">
            💖 Mon journal
          </Link>
        )}
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        {!isAuthenticated ? (
          <span className="nav-status">Pas connecté</span>
        ) : (
          <span className="nav-status">✨ Connecté</span>
        )}
      </div>
    </nav>
  )
}

export default Navbar