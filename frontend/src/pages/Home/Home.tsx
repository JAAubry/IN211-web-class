import './Home.css'
import {useState } from 'react'
import reactLogo from '../../assets/react.svg'
import { useFetchMovies } from '../../hooks/useFetchMovies'
import { MovieCard } from '../../components/MovieCard'

function filterMovies(search: string, movies: string[]) {
    return movies.filter(  (movie) =>
    movie.toLowerCase().startsWith(search.toLowerCase()));
}

function Home() {
  const [search, setSearch] = useState("");
  const {movies} = useFetchMovies();
  const filteredMovies = filterMovies(search,movies) ;
  
  return (
    <div>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>My movies</h1>
      <div className="card">
        <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Effectuez votre recherche"
          />
      </div>
      Vous recherchez : {search}

      <h2> Popular Movies</h2>
      {filteredMovies.map(title => (
        <MovieCard title={title} />
      ))}
    </div>
  )
}

export default Home
