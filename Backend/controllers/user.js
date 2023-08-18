const User = require('../Models/user'); // importation du modèle User
const jwt = require('jsonwebtoken'); // importation du module jsonwebtoken pour la gestion des tokens d'authentification
const bcrypt = require('bcrypt'); // importation du module bcrypt pour le hashage des mots de passe



// *********************************Connexion d'un utilisateur existant********************************


exports.login = (req, res, next) => {// fonction qui permet de connecter un utilisateur existant en vérifiant ses identifiants, en renvoyant son identifiant userID depuis la base de données et en créant un token d'authentification pour cette connexion
  console.log("debut controller auth");
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {// si l'utilisateur n'est pas trouvé dans la base de données, renvoie une erreur
        console.log("Utilisateur ou Mot de passe incorrect.");
        const error = new Error('Utilisateur ou Mot de passe incorrect.');
        error.statusCode = 401;
        throw error; // Passe l'erreur à la prochaine fonction middleware
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {// si l'utilisateur est trouvé dans la base de données, vérifie que le mot de passe correspond à celui de la base de données
          if (!valid) {
            console.log("Utilisateur ou Mot de passe incorrect.");
            const error = new Error('Utilisateur ou Mot de passe incorrect.');
            error.statusCode = 401;
            throw error;
          }

          res.setHeader('Content-Type', 'application/json'); // Définit le type de contenu de la réponse à JSON
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '1h' })
          });
        })
        .catch(error => {
          next(error); // Passe l'erreur à la prochaine fonction middleware
        });
    })
    .catch(error => {
      console.log("erreur global controller");
      console.log(error);
      next(error); // Passe l'erreur à la prochaine fonction middleware
    });
};


// *********************************Création d'un nouvel utilisateur********************************

exports.signup =(req, res, next) => {// fonction qui permet d'enregistrer un nouvel utilisateur dans la base de données
    bcrypt.hash(req.body.password, 10) // hachage du mot de passe fourni par l'utilisateur à l'aide de la fonction de hachage bcrypt
    .then(hash => { // si le hachage réussit, crée un nouvel utilisateur avec l'adresse email et le mot de passe haché
        const user = new User({
            email: req.body.email,
            password: hash// hachage du mot de passe
        });
        user.save() // sauvegarde le nouvel utilisateur dans la base de données
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => {
          error.message = "Erreur, cet email existe déjà";
          next(error);
        });
    })
    .catch(error => {
      error.statusCode = 422;
      error.message = "Erreur, cet email existe déjà";
      next(error);
    });
};


      //400 : mauvaise requête
      //401 : non authentifié
      //403 : accès interdit
      //404 : non trouvé
      //422 : entité non traitable
      //500 : erreur interne du serveur