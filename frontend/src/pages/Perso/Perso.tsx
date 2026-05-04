import { useEffect, useState } from 'react'

function Perso() {
  const [favourites, setFavourites] = useState<any[]>([])
  const [notes, setNotes] = useState<any[]>([])

  const [noteInput, setNoteInput] = useState('')
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)

  // -----------------------
  // FETCH HELPERS (INLINE)
  // -----------------------

  async function getFavourites() {
    const res = await fetch('/api/perso/favourites', {
      credentials: 'include',
    })
    return res.json()
  }

  async function getNotes() {
    const res = await fetch('/api/perso/notes', {
      credentials: 'include',
    })
    return res.json()
  }

  async function addFavourite(movieId: number) {
    const res = await fetch('/api/perso/favourites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ movieId }),
    })
    return res.json()
  }

  async function addNote(movieId: number, content: string) {
    const res = await fetch('/api/perso/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ movieId, content }),
    })
    return res.json()
  }

  // -----------------------
  // LOAD DATA
  // -----------------------
  useEffect(() => {
    async function load() {
      const favs = await getFavourites()
      const n = await getNotes()

      setFavourites(favs)
      setNotes(n)
    }

    load()
  }, [])

  // -----------------------
  // HANDLERS
  // -----------------------

  async function handleAddNote() {
    if (!selectedMovieId || !noteInput) return

    const newNote = await addNote(selectedMovieId, noteInput)

    setNotes([...notes, newNote])
    setNoteInput('')
  }

  async function handleAddFavourite(movieId: number) {
    const updated = await addFavourite(movieId)
    setFavourites(updated)
  }

  // -----------------------
  // UI (simplified)
  // -----------------------

  return (
    <div>
      <h1>Mon journal</h1>

      {/* FAVOURITES */}
      <section>
        <h2>❤️ Favoris</h2>

        {favourites.map((movie: any) => (
          <div key={movie.id}>
            <p>{movie.title}</p>

            <button onClick={() => setSelectedMovieId(movie.id)}>
              Ajouter une note
            </button>

            <button onClick={() => handleAddFavourite(movie.id)}>
              ❤️ Toggle Favori
            </button>
          </div>
        ))}
      </section>

      {/* NOTES */}
      <section>
        <h2>📝 Notes</h2>

        <input
          placeholder="Ecris une note"
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
        />

        <button onClick={handleAddNote}>Add Note</button>

        <ul>
          {notes.map((note: any) => (
            <li key={note.id}>
              {note.content} (movie: {note.movie?.title || note.movieId})
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default Perso