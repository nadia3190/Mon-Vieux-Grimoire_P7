//ici on met les schemas de la base de données pour les livres


const mongoose = require('mongoose');


const ratingSchema = new mongoose.Schema({// Création d'un schéma de données pour les notes des utilisateurs

  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
 
  grade: {
    type: Number, 
    required: true 
  }
});



const bookSchema = new mongoose.Schema({// Création d'un schéma de données pour les livres
  
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
 
  title: {
    type: String,
    required: true
  },
 
  author: {
    type: String, 
    required: true 
  },
 
  imageUrl: {
    type: String,
    required: true 
  },
  
  year: {
    type: Number, 
    required: true
  },
 
  genre: {
    type: String, 
    required: true
  },
 
  ratings: [ratingSchema],
 
  averageRating: {
    type: Number, 
    default: 0 
  }
});



