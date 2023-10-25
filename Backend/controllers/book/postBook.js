// post un livre
const mongoose = require("mongoose");
const Book = require("../../Models/book");

exports.postBook = (req, res, next) => {
  // Analyse les données du livres à partir des donées JSON
  const bookObject = JSON.parse(req.body.book); //transforme les données JSON en objet JS

  // Créer un nouveu libre (Book) en utilisant les données du livre analysées, l'ID utilisateur et l'URL de l'image
  const book = new Book({
    ...bookObject, // Utiliser l'opérateur de propagation pour ajouter toutes les propriétés de `bookObject`
    userId: req.auth.userId, // Ajout l'id de l'utilisateur authentifié
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`, // Construit URL de l'image
  });

  // Save book dans le database
  book
    .save() // enregistre le livre dans la base de données
    .then(() => {
      // Si réussi, envoyer une réponse avec un code d'état 201 et un message de succès
      res.status(201).json({ message: "Livre enregistré avec succès !" });
      console.log("Livre enregistré avec succès !");
    })
    .catch((error) => {
      // Si une erreur se produit, envoyer une réponse avec un code d'état 400 et le message d'erreur
      res.status(400).json({ error: error });
      console.log("erreur global controller");
    });
};
//200 = ok
//201 = created
//400 = bad request

//save() = méthode de mongoose qui permet d'enregistrer un document dans une collection
