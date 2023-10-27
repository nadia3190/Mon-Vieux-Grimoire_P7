// ici on va créer un middleware pour protéger les routes sélectionnées et vérifier que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes

const jwt = require("jsonwebtoken"); // importation du module jsonwebtoken pour la gestion des tokens d'authentification
require("dotenv").config(); // Importation du package dotenv pour masquer les informations de connexion à la base de données MongoDB

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // récupération du token d'authentification à partir de l'en-tête Authorization de la requête
    //.split(" ")[1] = on récupère tout après l'espace dans l'en-tête Authorization
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // vérification de la validité du token à l'aide de la clé secrète prédéfinie
    jwt.verify(token, process.env.JWT_SECRET); // vérification de la validité du token à l'aide de la clé secrète prédéfinie

    const userId = decodedToken.userId; // récupération de l'identifiant utilisateur à partir du token décodé
    //req.auth = { userId: userId }; // on crée un objet auth dans la requête pour y stocker l'identifiant utilisateur

    req.auth = {
      // on crée un objet auth dans la requête pour y stocker l'identifiant utilisateur
      userId: userId,
    };
    next(); // continuer l'exécution de la requête si l'utilisateur est authentifié
  } catch (err) {
    let error = new Error("Vous n'êtes pas connecté");
    error.statusCode = 401;
    next(error); // renvoie une erreur d'authentification si le token est invalide ou manquant
  }
};
