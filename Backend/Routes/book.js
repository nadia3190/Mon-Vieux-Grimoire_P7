
// ici on met les routes pour les livres
const express = require('express');
const router = express.Router();
const { getAllBooks } = require('../controllers/book/getAllBooks'); // Assurez-vous du chemin correct

router.get('/', getAllBooks);


module.exports = router;
