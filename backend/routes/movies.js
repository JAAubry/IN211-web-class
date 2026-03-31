import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    console.log("Dans movies.js");
    // Au lieu de la liste vide, on aurait mis la liste hardcodée de films
    res.send([]);
    
});

export default router;

