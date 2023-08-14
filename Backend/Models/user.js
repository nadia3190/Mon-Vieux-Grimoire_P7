//ici on met les schemas de données pour les utilisateurs

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');// Importe le package mongoose-unique-validator pour empêcher qu'un même utilisateur puisse s'enregistrer plusieurs fois avec la même adresse mail

const userSchema = mongoose.Schema({

  email: { 
    type: String, 
    required: true, 
    unique: true },
  password: { 
    type: String, 
    required: true }
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);