// ici on met les routes pour les livres
const express = require("express"); //on importe express pour avoir accès à la méthode Router
const router = express.Router(); //on utilise la méthode Router d'express pour créer un routeur

const auth = require("../middleware/auth"); //pour la gestion des tokens
const multer = require("../middleware/multer-config"); //pour la gestion des images
const getAllBooksControl = require("../controllers/book/getAllBooks"); // Assurez-vous du chemin correct
const addBookControl = require("../controllers/book/postBook");
const giveRatingBookCtrl = require("../controllers/book/giveRatingBook");
const getBookByIdCtrl = require("../controllers/book/getBookById");
const getBestRatingCtrl = require("../controllers/book/getBestRating");
const getBookByUserIdCtrl = require("../controllers/book/getBookByUserId");
const deleteBookCtrl = require("../controllers/book/deleteBook");
const updateBookCtrl = require("../controllers/book/updateBook");

router.post("/:id/rating", auth, giveRatingBookCtrl.giveRatingBook); //on utilise la méthode post pour envoyer les requêtes POST à notre API
router.get("/", getAllBooksControl.getAllBooks); //on utilise la méthode get pour envoyer les requêtes GET à notre API
router.post("/", auth, multer, addBookControl.postBook); //on utilise la méthode post pour envoyer les requêtes POST à notre API
router.get("/:id", getBookByIdCtrl.getBookById); //on utilise la méthode get pour envoyer les requêtes GET à notre API
router.get("/bestrating", getBestRatingCtrl.getBestRating); //on utilise la méthode get pour envoyer les requêtes GET à notre API
router.get("/user/:id", getBookByUserIdCtrl.getBookByUserId);
router.delete("/:id", auth, deleteBookCtrl.deleteBook); //on utilise la méthode delete pour envoyer les requêtes DELETE à notre API
router.put("/:id", auth, multer, updateBookCtrl.updateBook); //on utilise la méthode put pour envoyer les requêtes PUT à notre API

module.exports = router;

//Crud : Create, Read, Update, Delete
