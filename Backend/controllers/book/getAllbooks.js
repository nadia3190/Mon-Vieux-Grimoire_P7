const mongoose = require("mongoose");
const Book = require("../../Models/book");

exports.getAllBooks = async (req, res, next) => {
  // fonction qui permet de récupérer tous les livres de la base de données
  //req = requête envoyée par le frontend
  //res = réponse envoyée par le backend
  //next = fonction qui permet de passer à la prochaine fonction middleware

  try {
    const books = await Book.find({}); // récupère tous les livres de la base de données
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error });
  }
};

//find() = méthode de mongoose qui permet de récupérer tous les documents d'une collection
//find({}) = récupère tous les documents de la collection
