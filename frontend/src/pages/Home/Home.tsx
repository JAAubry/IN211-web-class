import './Home.css'
import { useState, useEffect } from 'react'
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
  // FAVOURITES
  // --------------------
  const [favourites, setFavourites] = useState<string[]>([])

  useEffect(() => {
    async function fetchFavourites() {
      try {
        const res = await fetch('/api/favourites', {
          credentials: 'include',
        })

        if (!res.ok) return

        const data = await res.json()

        setFavourites(data.map((f: any) => f.movieTitle))
      } catch (err) {
        console.log(err)
      }
    }

    fetchFavourites()
  }, [])

  async function toggleFavourite(title: string) {
    try {
      const isFav = favourites.includes(title)

      const response = await fetch('/api/favourites', {
        method: isFav ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ movieTitle: title }),
      })

      if (!response.ok) {
        setMessage('Erreur serveur')
        return
      }

      if (isFav) {
        setFavourites(favourites.filter((m) => m !== title))
      } else {
        setFavourites([...favourites, title])
      }
    } catch (error) {
      setMessage('Erreur serveur')
    }
  }

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
  // LOGIN
  // --------------------
  async function handleLogin() {
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
        document.cookie = `authToken=${data.token}`
        setMessage('Connexion réussie')
      }
    } catch (error) {
      setMessage('Erreur serveur')
    }
  }

  // --------------------
  // SIGNUP
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
          <p>Aucun film populaire ne correspond à votre recherche</p>
        ) : (
          filteredMovies.map((title, index) => {
            const isFav = favourites.includes(title)

            return (
              <div key={index} className="movie-item">
                <MovieCard title={title} />

                <button
                  className={`fav-button ${isFav ? 'active' : ''}`}
                  onClick={() => toggleFavourite(title)}
                >
                  {isFav ? '❤️ Liked' : '🤍 Like'}
                </button>
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}

export default Home