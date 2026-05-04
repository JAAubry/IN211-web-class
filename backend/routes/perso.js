import express from 'express'
import { appDataSource } from '../datasource.js'
import { authMiddleware } from '../middleware/auth.js'

import User from '../entities/user.js'
import Movie from '../entities/movies.js'
import Note from '../entities/note.js'

const router = express.Router()

const userRepo = appDataSource.getRepository(User)
const movieRepo = appDataSource.getRepository(Movie)
const noteRepo = appDataSource.getRepository(Note)


// ❤️ GET FAVOURITES
router.get('/favourites', authMiddleware, async (req, res) => {
  const user = await userRepo.findOne({
    where: { id: req.user.userId },
    relations: ['favourites'],
  })

  res.json(user.favourites)
})


// ❤️ ADD FAVOURITE
router.post('/favourites', authMiddleware, async (req, res) => {
  const { movieId } = req.body

  const user = await userRepo.findOne({
    where: { id: req.user.userId },
    relations: ['favourites'],
  })

  const movie = await movieRepo.findOne({
    where: { id: movieId },
  })

  user.favourites.push(movie)

  await userRepo.save(user)

  res.status(201).json(user.favourites)
})


// 📝 ADD NOTE (PERSISTENT)
router.post('/notes', authMiddleware, async (req, res) => {
  const { movieId, content } = req.body

  const noteRepo = appDataSource.getRepository(Note)

  const note = noteRepo.create({
    content,
    user: { id: req.user.userId },
    movie: { id: movieId },
  })

  await noteRepo.save(note)

  res.status(201).json(note)
})


// 📝 GET NOTES
router.get('/notes', authMiddleware, async (req, res) => {
  const noteRepo = appDataSource.getRepository(Note)

  const notes = await noteRepo.find({
    where: {
      user: { id: req.user.userId },
    },
    relations: ['movie'],
  })

  res.json(notes)
})

// DELETE NOTES
router.delete('/notes/:id', authMiddleware, async (req, res) => {
  const noteRepo = appDataSource.getRepository(Note)

  const note = await noteRepo.findOne({
    where: {
      id: req.params.id,
      user: { id: req.user.userId }, // 🔐 critical
    },
  })

  if (!note) {
    return res.status(404).json({ message: 'Note not found' })
  }

  await noteRepo.remove(note)

  res.status(204).send()
})

export default router