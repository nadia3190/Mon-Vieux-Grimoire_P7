// app.js est un fichier qui contient le code qui permet de créer l'application express et de la configurer. Il contient également le code qui permet de se connecter à la base de données MongoDB.
const express = require("express"); // Importation du framework express pour faciliter la configuration du serveur
const mongoose = require("mongoose"); // Importation du package mongoose pour faciliter les interactions avec la base de données
const bodyParser = require("body-parser"); // Importation du package body-parser pour transformer le corps de la requête en objet JavaScript utilisable
const cors = require("cors"); // Importez le module cors
require("dotenv").config(); // Importation du package dotenv pour masquer les informations de connexion à la base de données MongoDB
const helmet = require("helmet"); // Importez Helmet pour sécuriser les en-têtes HTTP
const app = express(); // Création d'une application express pour pouvoir utiliser les fonctionnalités du framework
const jwt = require("jsonwebtoken");

// Utilisation de la clé secrète depuis les variables d'environnement
const token = jwt.sign({ userId: 123 }, process.env.JWT_SECRET, {
  expiresIn: "24h",
});

// Connexion à la base de données MongoDB

mongoose
  .connect(process.env.MONGODB_URI, {
    //process.env.MONGODB_URI est une variable d'environnement qui contient l'URL de connexion à la base de données MongoDB
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }) // La méthode connect() de mongoose permet de se connecter à la base de données MongoDB
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

bodyParser.json(); // Transforme le corps de la requête en objet JavaScript utilisable

app.use(helmet()); // Utilisez Helmet pour sécuriser les en-têtes HTTP

const port = process.env.PORT || 4000;
app.listen(port, "127.0.0.1", () => {
  console.log(`Listening on port ${port}`);
});
// Middleware pour servir les fichiers statiques du dossier "public"
app.use(express.static("public"));
// Middleware pour parser les requêtes avec du JSON
app.use(express.json());

//CORS (Cross-Origin Resource Sharing) est un mécanisme de sécurité utilisé par les navigateurs web pour contrôler les requêtes d'un domaine (ou origine) à un autre.
// Middleware pour ajouter les headers CORS aux réponses
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

const corsOptions = {
  origin: "http://localhost:3000", // Adresse du serveur autorisé (ici le port du frontend) à communiquer avec le serveur backend
  methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes HTTP autorisées
  allowedHeaders: ["Content-Type", "Authorization"], // Headers autorisés
  optionsSuccessStatus: 204, // Réponse pour les requêtes OPTIONS
};

// Utilisez le middleware cors avec les options configurées
app.use(cors(corsOptions));

const userRoutes = require("./Routes/user"); // Importation du routeur pour les demandes vers /api/auth
const bookRoutes = require("./Routes/book"); // Importation du routeur pour les demandes vers /api/books
const errorHandler = require("./middleware/errorHandler"); // Importation du middleware pour gérer les erreurs routes

app.use("/api/auth", userRoutes); // Pour enregistrer les routes pour les demandes vers /api/auth
app.use("/api/books", bookRoutes); // Pour enregistrer les routes pour les demandes vers /api/books
app.use(errorHandler); // Pour enregistrer le middleware pour gérer les erreurs

module.exports = app;

//app.use permet de définir une fonction qui sera exécutée pour chaque requête reçue par le serveur.
//app.get permet de répondre uniquement aux requêtes GET
//app.post permet de répondre uniquement aux requêtes POST
//app.put permet de répondre uniquement aux requêtes PUT
//app.delete permet de répondre uniquement aux requêtes DELETE

//un middleware est une fonction qui reçoit les objets request et response en tant que paramètres et qui peut effectuer des actions sur ces objets avant de les transmettre à la prochaine fonction middleware.
