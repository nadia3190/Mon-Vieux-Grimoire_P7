// requete supprimer

const mongoose = require("mongoose");
const Book = require("../../Models/book");

exports.deleteBook = async (req, res, next) => {
  // fonction qui permet de supprimer un livre de la base de données
  try {
    const book = await Book.deleteOne({ _id: req.params.id }); // supprime le livre avec l'ID fourni

    res.status(200).json({ message: "Livre supprimé !" }); // renvoie une réponse de réussite en cas de succès
  } catch (error) {
    res.status(400).json({ error }); // renvoie une erreur en cas d'échec
  }
};
//deleteOne() = méthode de mongoose qui permet de supprimer un document d'une collection
//deleteOne({ _id: req.params.id }) = supprime le document avec l'ID fourni
