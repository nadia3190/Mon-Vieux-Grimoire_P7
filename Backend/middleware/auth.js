// ici on va créer un middleware pour protéger les routes sélectionnées et vérifier que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes

const jwt = require("jsonwebtoken"); // importation du module jsonwebtoken pour la gestion des tokens d'authentification
require("dotenv").config(); // importation du module dotenv pour la gestion des variables d'environnement
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // récupération du token d'authentification à partir de l'en-tête Authorization de la requête
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // vérification de la validité du token à l'aide de la clé secrète prédéfinie
    //Random token secret est une chaîne de développement temporaire pour encoder le token d'authentification (à remplacer par une chaîne aléatoire plus longue pour la production)
    const userId = decodedToken.userId; // récupération de l'identifiant utilisateur à partir du token décodé
    req.auth = {
      userId: userId,
    };
    next(); // continuer l'exécution de la requête si l'utilisateur est authentifié
  } catch (err) {
    let error = new Error("Vous n'êtes pas connecté");
    error.statusCode = 401;
    next(error); // renvoie une erreur d'authentification si le token est invalide ou manquant
  }
};
