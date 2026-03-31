import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';

const router = express.Router();

router.get('/', (req, res) => {
    console.log("Dans movies.js");
    // Au lieu de la liste vide, on aurait mis la liste hardcodée de films
    res.send([]);
    
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
      res.send("Film added to database.");
    })
    .catch(function (error) {
      console.error(error);
        res.status(500).json({ message: 'Error while creating the movie' });
    });
})

export default router;

