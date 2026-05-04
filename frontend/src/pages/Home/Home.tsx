import './Home.css'
import { useState } from 'react'
import { useFetchMovies } from '../../hooks/useFetchMovies'
import { MovieCard } from '../../components/MovieCard'

function filterMovies(search: string, movies: string[]) {
  return movies.filter((movie) =>
    movie.toLowerCase().startsWith(search.toLowerCase())
  )
}

function Home() {
  // --------------------
  // MOVIES
  // --------------------
  const [search, setSearch] = useState('')
  const { movies } = useFetchMovies()
  const filteredMovies = filterMovies(search, movies)

  // --------------------
  // LOGIN STATE
  // --------------------
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  // --------------------
  // SIGNUP STATE
  // --------------------
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  
  // --------------------
  // LOGIN HANDLER
  // --------------------
  async function handleLogin() {
    // validation
    if (!email || !password) {
      setMessage('Entrez vos informations de connection')
      return
    }

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (response.status === 401) {
        setMessage('Utilisateur ou Mot de passe invalide')
        return
      }
      if (response.status === 500) {
        setMessage('Erreur serveur')
        return
      }
      if (response.ok) {
        const data = await response.json()
        // simulate cookie storage (needed for tests)
        document.cookie = `authToken=${data.token}`
        setMessage('Connexion réussie')
      }
    } catch (error) {
      setMessage('Erreur serveur')
    }
  }


  // --------------------
  // SIGN UP HANDLER
  // --------------------
  async function handleSignup() {
  if (!signupEmail || !signupPassword) {
    setMessage('Entrez vos informations de création de compte')
    return
  }

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: signupEmail,
        password: signupPassword,
      }),
    })

    if (response.status === 409) {
      setMessage('Utilisateur déjà existant')
      return
    }
    if (response.status === 500) {
      setMessage('Erreur serveur')
      return
    }
    if (response.ok) {
      setMessage('Compte créé avec succès')
    }
  } catch (error) {
    setMessage('Erreur serveur')
  }
}

  // --------------------
  // RENDER
  // --------------------
  return (
  <div className="container">

    {/* TOP BAR */}
    <div className="top-bar">
      <div className="right-actions">
        <div className="login-inline">
          {/* LOGIN */}
          <input
            type="text"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>

          {/* SIGNUP */}
          <input
            type="text"
            placeholder="E-mail (signup)"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe (signup)"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
          />
          <button onClick={handleSignup}>Sign up</button>

        </div>
      </div>
    </div>

    {/* MESSAGE */}
    {message && <p className="message">{message}</p>}

    {/* SEARCH */}
    <div className="card">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Effectuez votre recherche"
      />
    </div>

    {/* MOVIES */}
    <h2>Les films en vogue</h2>

    <div className="movie-grid">
      {filteredMovies.length === 0 ? (
        <p>Aucun film populaire de correspond à votre recherche</p>
      ) : (
        filteredMovies.map((title, index) => (
          <MovieCard key={index} title={title} />
        ))
      )}
    </div>

  </div>
)
}

export default Home