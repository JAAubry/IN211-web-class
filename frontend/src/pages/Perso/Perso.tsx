import './Perso.css'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

function Perso() {
  const { isAuthenticated } = useAuth()

  const [notes, setNotes] = useState<string[]>([])
  const [noteInput, setNoteInput] = useState('')

  const [playlists, setPlaylists] = useState<string[]>([])
  const [playlistInput, setPlaylistInput] = useState('')

  if (!isAuthenticated) {
    return <h2>Accès refusé</h2>
  }

  function addNote() {
    if (!noteInput) return
    setNotes([...notes, noteInput])
    setNoteInput('')
  }

  function addPlaylist() {
    if (!playlistInput) return
    setPlaylists([...playlists, playlistInput])
    setPlaylistInput('')
  }

  return (
    <div className="perso-container">
      <h1>My Space</h1>

      {/* FAVORITES */}
      <section className="card">
        <h2>My Favourites</h2>
        <p>❤️ Your favourite movies will appear here</p>
      </section>

      {/* NOTES */}
      <section className="card">
        <h2>My Notes</h2>

        <input
          placeholder="Ajouter une note"
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
        />

        <button onClick={addNote}>Add Note</button>

        <ul>
          {notes.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      </section>

      {/* PLAYLISTS */}
      <section className="card">
        <h2>Playlists</h2>

        <input
          placeholder="Nom de la playlist"
          value={playlistInput}
          onChange={(e) => setPlaylistInput(e.target.value)}
        />

        <button onClick={addPlaylist}>Create</button>

        <ul>
          {playlists.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default Perso