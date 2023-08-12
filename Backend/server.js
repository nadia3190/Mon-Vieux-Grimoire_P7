const express = require('express');// Import express module pour créer le serveur 

const app = express();// Créer le serveur 
const PORT = process.env.PORT || 3000;// Port du serveur  

app.get('/', (req, res) => {// Route pour la page d'accueil
  res.send('Response from server.js');// Réponse du serveur 
});

app.listen(PORT, () => {// Ecoute du serveur 
  console.log(`Server is running on port ${PORT}`);// Message de confirmation 
});
//server.js permet de créer un serveur et de l'écouter sur le port 3000. 
//express est un module qui permet de créer un serveur.