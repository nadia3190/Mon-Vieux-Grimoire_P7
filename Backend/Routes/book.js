
// ici on met les routes pour les livres
const express = require('express');//on importe express pour avoir accès à la méthode Router
const router = express.Router();//on utilise la méthode Router d'express pour créer un routeur

const auth = require('../middleware/auth');//pour la gestion des tokens
const multer = require('../middleware/multer-config');//pour la gestion des images
const  getAllBooksControl  = require('../controllers/book/getAllBooks'); // Assurez-vous du chemin correct
const  addBookControl  = require('../controllers/book/addBook');


router.get('/', getAllBooksControl.getAllBooks);//on utilise la méthode get pour envoyer les requêtes GET à notre API
router.post('/', auth, multer, addBookControl.addBook);//on utilise la méthode post pour envoyer les requêtes POST à notre API




module.exports = router;


//Crud : Create, Read, Update, DeletegetAllBooksControl