import axios from 'axios';
import { useEffect, useState } from 'react'

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

export function useFetchMovies(){
    const [movies, setMovies] = useState([]);

    useEffect(() => {
    axios
    .get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`)
    .then((response) => {
        setMovies(response.data.results.map(
            (movieObjet: any) => movieObjet.title
            )
        ); 
        console.log(movies)
    })
    .catch((error) => {
        // Do something if call failed
        console.log(error)
    });
    },[]);
    
    return {movies} ;
}