import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    console.log("Dans movies.js");
    // Au lieu de la liste vide, on aurait mis la liste hardcodée de films
    res.send([]);
    
});

router.post('/new', (req,res) => {
    console.log(req.body);
    res.send(`Ajout de ${req.body.titre} sorti en ${req.body.date}`);
})

export default router;

