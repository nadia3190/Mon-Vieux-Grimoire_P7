const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passwordValidator = require("password-validator");
const validator = require("validator");
require("dotenv").config(); // Importation du package dotenv pour masquer les informations de connexion à la base de données MongoDB
// *********************************Connexion d'un utilisateur existant********************************

exports.login = (req, res, next) => {
  console.log("Début du contrôleur d'authentification");
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        console.log("Utilisateur ou Mot de passe incorrect.");
        return res
          .status(401)
          .json({ error: "Utilisateur ou Mot de passe incorrect." });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            console.log("Utilisateur ou Mot de passe incorrect.");
            return res
              .status(401)
              .json({ error: "Utilisateur ou Mot de passe incorrect." });
          }

          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => {
          console.error("Erreur de comparaison de mot de passe:", error);
          res.status(500).json({ error: "Erreur de serveur interne." });
        });
    })
    .catch((error) => {
      console.error("Erreur lors de la recherche de l'utilisateur:", error);
      res.status(500).json({ error: "Erreur de serveur interne." });
    });
};

// *********************************Création d'un nouvel utilisateur********************************

exports.signup = (req, res, next) => {
  if (!validator.isEmail(req.body.email)) {
    console.log("Adresse email invalide.");
    return res.status(422).json({ error: "Adresse email invalide." });
  }

  if (!isValidPwd(req.body.password)) {
    console.log("Mot de passe invalide.");
    return res
      .status(400)
      .json({ error: validationMessages(req.body.password) });
  }

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => {
          res.status(201).json({ message: "Utilisateur créé !" });
        })
        .catch((error) => {
          if (error.name === "MongoError" && error.code === 11000) {
            console.log("Cette adresse e-mail est déjà utilisée.");
            return res
              .status(400)
              .json({ error: "Cette adresse e-mail est déjà utilisée." });
          }
          console.error(
            "Erreur lors de l'enregistrement de l'utilisateur:",
            error
          );
          res.status(500).json({ error: "Erreur de serveur interne." });
        });
    })
    .catch((error) => {
      console.error("Erreur lors du hachage du mot de passe:", error);
      res.status(500).json({ error: "Erreur de serveur interne." });
    });
};

//400 : mauvaise requête
//401 : non authentifié
//403 : accès interdit
//404 : non trouvé
//422 : entité non traitable
//500 : erreur interne du serveur

// Création du schéma de mot de passe
const schemaPassword = new passwordValidator();

const isValidPwd = (password) => {
  // Propriétés du schéma de mot de passe
  schemaPassword
    .is()
    .min(8) // Minimum de 8 caractères
    .is()
    .max(100) // Maximum de 100 caractères
    .has()
    .lowercase() // Doit contenir des minuscules
    .has()
    .uppercase(1) // Doit contenir au moins 1 majuscule
    .has()
    .digits(2) // Doit contenir au moins 2 chiffres
    .has()
    .symbols(1) // Doit contenir au moins un caractères spécial
    .has()
    .not()
    .spaces(); // Should not have spaces
  // Création de la fonction de validité du mot de passe
  return schemaPassword.validate(password);
};

// Création de la fonction retournant les messages de validation
const validationMessages = (password) => {
  let messages = "";
  const arr = schemaPassword.validate(password, { details: true });
  for (let i = 0; i < arr.length; i++) {
    messages += arr[i].message + " *** ";
  }
  return messages;
};
