//get book by id

const mongoose = require("mongoose");
const Book = require("../../Models/book");

exports.getBookById = async (req, res, next) => {
  //async await pour attendre la réponse de la base de données avant de passer à la suite du code
  try {
    const book = await Book.findOne({ _id: req.params.id }); //_id est l'identifiant unique de chaque livre dans la base de donnée
    //le _ devant id est obligatoire car c'est comme ça que mongoDB nomme l'identifiant unique de chaque livre
    console.log(book);
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error });
  }
};

//req = requete envoyé par le front end
//res = réponse envoyé par le back end
//next = fonction qui permet de passer à la suite du code (comme un return)
