// ici on met les routes pour les livres
const express = require("express"); //on importe express pour avoir accès à la méthode Router
const router = express.Router(); //on utilise la méthode Router d'express pour créer un routeur

const auth = require("../middleware/auth"); //pour la gestion des tokens
const multer = require("../middleware/multer-config"); //pour la gestion des images

const getAllBooksCtrl = require("../controllers/book/getAllBooks");
const getBookByIdCtrl = require("../controllers/book/getBookById");
const getBestRatingCtrl = require("../controllers/book/getBestRating");
const postBooksCtrl = require("../controllers/book/postBook");
const modifyBookCtrl = require("../controllers/book/updateBook");
const deleteBookCtrl = require("../controllers/book/deleteBook");
const giveRatingBookCtrl = require("../controllers/book/giveRatingBook");

router.get("/", getAllBooksCtrl.getAllBooks);
router.get("/bestrating", getBestRatingCtrl.getBestRating);
router.get("/:id", getBookByIdCtrl.getBookById);
router.post("/:id/rating", auth, giveRatingBookCtrl.giveRatingBook);
router.post("/", auth, multer, postBooksCtrl.postBook);
router.put("/:id", auth, multer, modifyBookCtrl.updateBook);
router.delete("/:id", auth, deleteBookCtrl.deleteBook); //on met auth pour protéger la route et multer pour la gestion des images (on peut mettre plusieurs middleware)

module.exports = router; //on exporte ce routeur pour pouvoir l'importer dans app.js

//Crud : Create, Read, Update, Delete
