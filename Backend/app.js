// app.js est un fichier qui contient le code qui permet de créer l'application express et de la configurer. Il contient également le code qui permet de se connecter à la base de données MongoDB.
const express = require('express'); // Importation du framework express pour faciliter la configuration du serveur
const mongoose = require('mongoose');// Importation du package mongoose pour faciliter les interactions avec la base de données
const bodyParser = require('body-parser');// Importation du package body-parser pour transformer le corps de la requête en objet JavaScript utilisable

const Thing = require('./Models/user'); // Importation du modèle Thing



const app = express(); // Création d'une application express pour pouvoir utiliser les fonctionnalités du framework 

// Connexion à la base de données MongoDB

mongoose.connect('mongodb+srv://nadiaDB:IccRUik3zyTCyVDY@nadiadb.rmy6few.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })// La méthode connect() de mongoose permet de se connecter à la base de données MongoDB
    .then(() => {// La méthode then() renvoie un objet Promise. Elle peut prendre jusqu'à deux arguments qui sont des fonctions callback à exécuter en cas de complétion ou d'échec de la Promise.
        console.log('Connexion à la base de données réussie !');
      app.listen(4000, () => {
    console.log('Le serveur écoute sur le port 3000');
});
    })
    .catch(err => {
        console.error('Erreur de connexion à la base de données:', err);
    });

// Middleware pour parser les requêtes avec du JSON
app.use(express.json());

// Middleware pour servir les fichiers statiques du dossier "public"
app.use(express.static('public'));

//CORS (Cross-Origin Resource Sharing) est un mécanisme de sécurité utilisé par les navigateurs web pour contrôler les requêtes d'un domaine (ou origine) à un autre.
// Middleware pour ajouter les headers CORS aux réponses
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});



module.exports = app;
