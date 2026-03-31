import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const movieRepository = appDataSource.getRepository(Movie);
    const movies = await movieRepository.find();
    console.log(movies);
    // Au lieu de la liste vide, on aurait mis la liste hardcodée de films
    res.send(movies);
    
});

router.post('/new', (req,res) => {
  const movieRepository = appDataSource.getRepository(Movie);
  const newMovie = movieRepository.create({
    title: req.body.title,
    date: req.body.date
  });
  movieRepository
    .insert(newMovie)
    .then(function (newDocument) {
    res.status(201).json(newDocument);
    })
    .catch(function (error) {
    console.error(error);
        res.status(500).json({ message: 'Error while creating the movie' });
    });
})

router.post('/delete', (req, res) => {
  const movieRepository = appDataSource.getRepository(Movie);
  const movieId = req.body.id;

  movieRepository
    .delete(movieId)
    .then((result) => {
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      res.status(200).json({ message: 'Movie deleted successfully' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error while deleting the movie' });
    });
});



export default router;

