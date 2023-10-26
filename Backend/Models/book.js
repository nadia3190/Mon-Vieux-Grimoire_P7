//ici on met les schemas de la base de données pour les livres

const mongoose = require("mongoose");

//on appelle Schema de mongoose pour créer un schéma de données
//en sql on appelle ça une table

const ratingSchema = new mongoose.Schema({
  // Création d'un schéma de données pour les notes des utilisateurs

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //référence à l'utilisateur qui a créé la note du livre
  },

  grade: {
    type: Number,
    required: true,
  },
});

const bookSchema = new mongoose.Schema({
  // Création d'un schéma de données pour les livres

  userId: {
    //id de l'utilisateur qui a créé le livre
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //référence à l'utilisateur qui a créé le livre
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  author: {
    type: String,
    required: true,
  },

  imageUrl: {
    type: String,
    required: true,
  },

  year: {
    type: Number,
    required: true,
  },

  genre: {
    type: String,
    required: true,
  },

  ratings: [ratingSchema],

  averageRating: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Book", bookSchema); // Exportation du schéma de données pour les livres
//mongoose.model() = méthode qui permet de créer un modèle mongoose à partir d'un schéma de données
