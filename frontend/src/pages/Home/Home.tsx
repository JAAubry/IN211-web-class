import './Home.css'
import { useState } from 'react'
import filmLogo from '../../assets/movies-icon.png'
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
  // RENDER
  // --------------------
  return (
  <div className="container">

    {/* TOP BAR */}
    <div className="top-bar">
      <h1 className="title">Mon movie journal </h1>

      <div className="login-inline">
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