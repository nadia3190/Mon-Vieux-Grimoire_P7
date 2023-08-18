const http = require('http'); // Import du module http
const app = require('./app'); // Import du fichier app.js
const server = http.createServer(app);// La méthode createServer du package http permet de créer un serveur avec en argument la fonction app

const WebSocket = require('ws'); // Import du module websocket permet de créer un serveur websocket 
// websocket est un protocole de communication bi-directionnel de données par-dessus TCP, défini par la RFC 6455. Il fournit un canal de communication full-duplex par-dessus une connexion TCP unique.
const wss = new WebSocket.Server({ server });
wss.on('connection', (socket) => {
  console.log('Nouvelle connexion WebSocket établie');

  // Gérez les messages entrants, etc.
  socket.on('message', (message) => {
    console.log('Message reçu:', message);
    // Faites quelque chose avec le message reçu
  });
});
const normalizePort = val => {
  const port = parseInt(val, 10);// La fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne

  if (isNaN(port)) {// isNaN détermine si la valeur passée en argument n'est pas un nombre
    return val;// Si la valeur n'est pas un nombre, la fonction renvoie la valeur telle quelle
  }
  if (port >= 0) {// Si la valeur est un nombre positif, la fonction renvoie la valeur
    return port;// Si la valeur est un nombre positif, la fonction renvoie la valeur
  }
  return false;
};
const port = normalizePort(process.env.PORT || '4000');// La fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
app.set('port', port);// La méthode set permet de définir des variables d'environnement


const errorHandler = error => {// La fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();// La méthode address renvoie l'adresse sous forme d'objet
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;// La fonction typeof renvoie une chaîne indiquant le type de l'opérande
  switch (error.code) {// La fonction switch évalue une expression et, selon le résultat obtenu et le cas associé, exécute les instructions correspondantes
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');//Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force  si le port est déjà utilisé
      process.exit(1);
      break;
    default:
      throw error;
  }
};


server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);


//server.js est le fichier principal de l'application, il contient le code qui permet de créer un serveur Node et de le faire tourner. Il contient également le code qui permet de gérer les CORS et les différentes routes de l'API.
