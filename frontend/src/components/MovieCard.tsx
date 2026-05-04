import { useEffect, useState } from 'react'
import './MovieCard.css'

type Props = {
  title: string
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

export function MovieCard({ title }: Props) {
  const [poster, setPoster] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPoster() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
        )
        const data = await res.json()

        if (data.results && data.results.length > 0) {
          setPoster(IMAGE_BASE + data.results[0].poster_path)
        }
      } catch (e) {
        console.error('TMDB error', e)
      }
    }

    fetchPoster()
  }, [title])

  return (
    <div className="movie-card">
      {poster ? (
        <img src={poster} alt={title} />
      ) : (
        <div className="placeholder">✨</div>
      )}

      <div className="overlay">
        <p>{title}</p>
      </div>
    </div>
  )
}