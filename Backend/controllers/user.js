const User = require("../Models/user"); // importation du modèle User
const jwt = require("jsonwebtoken"); // importation du module jsonwebtoken pour la gestion des tokens d'authentification
const bcrypt = require("bcrypt"); // importation du module bcrypt pour le hashage des mots de passe
const passwordValidator = require("password-validator"); // importation du module password-validator pour la validation des mots de passe
const validator = require("validator"); // importation du module validator pour la validation des emails
require("dotenv").config();

// *********************************Connexion d'un utilisateur existant********************************

exports.login = (req, res, next) => {
  // fonction qui permet de connecter un utilisateur existant en vérifiant ses identifiants, en renvoyant son identifiant userID depuis la base de données et en créant un token d'authentification pour cette connexion
  console.log("debut controller auth");
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        // si l'utilisateur n'est pas trouvé dans la base de données, renvoie une erreur
        console.log("Utilisateur ou Mot de passe incorrect.");
        const error = new Error("Utilisateur ou Mot de passe incorrect.");
        error.statusCode = 401;
        throw error; // Passe l'erreur à la prochaine fonction middleware
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // si l'utilisateur est trouvé dans la base de données, vérifie que le mot de passe correspond à celui de la base de données
          if (!valid) {
            console.log("Utilisateur ou Mot de passe incorrect.");
            const error = new Error("Utilisateur ou Mot de passe incorrect.");
            error.statusCode = 401;
            throw error;
          }

          res.setHeader("Content-Type", "application/json"); // Définit le type de contenu de la réponse à JSON
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => {
          next(error); // Passe l'erreur à la prochaine fonction middleware
        });
    })
    .catch((error) => {
      console.log("erreur global controller");
      console.log(error);
      next(error); // Passe l'erreur à la prochaine fonction middleware
    });
};

// *********************************Création d'un nouvel utilisateur********************************

exports.signup = (req, res, next) => {
  if (!validator.isEmail(req.body.email)) {
    console.log("Adresse email invalide.");
    const error = new Error("Adresse email invalide.");
    error.statusCode = 422;
    throw error;
  }

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // hachage du mot de passe avec le module bcrypt pour sécuriser le mot de passe
      const schema = new passwordValidator(); // Crée un schéma de validation de mot de passe avec le module password-validator pour vérifier que le mot de passe respecte les critères de sécurité requis

      schema
        .is()
        .min(8)
        .is()
        .max(100)
        .has()
        .uppercase()
        .has()
        .lowercase()
        .has()
        .digits()
        .has()
        .symbols()
        .not()
        .spaces();

      // Validez le mot de passe avant de créer l'utilisateur
      if (!schema.validate(req.body.password)) {
        console.log("Mot de passe invalide.");
        const error = new Error("Mot de passe invalide.");
        error.statusCode = 422;
        throw error;
      }

      // si le hachage réussit, crée un nouvel utilisateur avec l'adresse email et le mot de passe haché
      const user = new User({
        email: req.body.email, // adresse email fournie dans le corps de la requête
        password: hash, // hachage du mot de passe
      });
      user
        .save() // sauvegarde le nouvel utilisateur dans la base de données
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => {
          error.message = "Erreur, cet email existe déjà";
          next(error);
        });
    })
    .catch((error) => {
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
