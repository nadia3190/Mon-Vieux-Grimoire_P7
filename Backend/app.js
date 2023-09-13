// app.js est un fichier qui contient le code qui permet de créer l'application express et de la configurer. Il contient également le code qui permet de se connecter à la base de données MongoDB.
const express = require("express"); // Importation du framework express pour faciliter la configuration du serveur
const mongoose = require("mongoose"); // Importation du package mongoose pour faciliter les interactions avec la base de données
const cors = require("cors"); // Importez le module cors
const helmet = require("helmet"); // Importation  le module helmet
const app = express(); // Création d'une application express pour pouvoir utiliser les fonctionnalités du framework
require("dotenv").config(); // Importation du package dotenv pour masquer les informations de connexion à la base de données MongoDB
// Connexion à la base de données MongoDB

mongoose
  .connect(process.env.MONGODB_URI, {
    //process.env.MONGODB_URI est une variable d'environnement qui contient l'URL de connexion à la base de données MongoDB
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }) // La méthode connect() de mongoose permet de se connecter à la base de données MongoDB
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json()); // Middleware pour parser les requêtes avec du JSON

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

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'"],
    },
  })
);
//helmet permet de sécuriser l'application Express en configurant les en-têtes HTTP et les CORS. Il permet de se protéger contre les attaques XSS, MIME sniffing, clickjacking, etc.
//helmet permet aussi de protéger l'application Express contre les attaques XSS en configurant les en-têtes HTTP Content-Security-Policy et X-XSS-Protection.
//Il permet également de protéger l'application Express contre les attaques MIME sniffing en configurant l'en-tête HTTP X-Content-Type-Options.
// Il permet également de protéger l'application Express contre les attaques clickjacking en configurant l'en-tête HTTP X-Frame-Options.

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
