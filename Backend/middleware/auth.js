// ici on va créer un middleware pour protéger les routes sélectionnées et vérifier que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes

const jwt = require("jsonwebtoken");
require("dotenv").config(); // Chargez les variables d'environnement depuis le fichier .env

module.exports = (req, res, next) => {
  try {
    console.log("AUTH MIDDLE");
    const token = req.headers.authorization.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET; // Utilisez la variable d'environnement pour accéder à la clé secrète
    //process.env.JWT_SECRET est la clé secrète pour l'encodage et le décodage du token
    console.log("token", jwtSecret);
    const decodedToken = jwt.verify(token, jwtSecret); //la clé secrète pour vérifier le token
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (err) {
    let error = new Error("Vous n'êtes pas connecté");
    error.statusCode = 401;
    next(error);
  }
};
