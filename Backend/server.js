const http = require('http'); // Import du module http
const app = require('./app'); // Import du fichier app.js
const PORT = process.env.PORT || 3000; // Port du serveur

app.set('port', PORT); // Définition du port utilisé par l'application
const server = http.createServer(app); // Créer le serveur en utilisant app

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//server.js permet de créer un serveur et de l'écouter sur le port 3000. 
