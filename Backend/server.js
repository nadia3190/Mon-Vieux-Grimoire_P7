const http = require("http"); //importation du package http de Node.js qui permet de créer un serveur HTTP
const app = require("./app"); //importation de l'application Express à partir du fichier app.js
const server = http.createServer(app); //création du serveur Node.js en utilisant la fonction createServer() du package http de Node.js

const WebSocket = require("ws"); //importation du package ws qui permet de créer un serveur WebSocket
const wss = new WebSocket.Server({ server }); //création du serveur WebSocket en utilisant la fonction Server() du package ws

wss.on("connection", (socket) => {
  //configuration du serveur WebSocket pour écouter les connexions entrantes
  console.log("Nouvelle connexion WebSocket établie");

  socket.on("message", (message) => {
    console.log("Message reçu:", message); //configuration du serveur WebSocket pour écouter les messages entrants
  });
});

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || "4000"); //configuration du port du serveur Node.js en utilisant la fonction normalizePort() qui renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address(); //configuration du gestionnaire d'erreurs du serveur Node.js en utilisant la fonction errorHandler() qui recherche les différentes erreurs et les gère de manière appropriée
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//EACCES = Erreur d'accès (permission refusée)
//EADDRINUSE = Adresse déjà utilisée dans la mémoire du système d'exploitation

app.on("error", errorHandler);
app.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);

const crypto = require("crypto");
const jwtSecret = crypto.randomBytes(64).toString("hex");
console.log(jwtSecret);

//le fichier server.js est le point d'entrée de l'application. Il contient le code qui crée le serveur Node.js et le connecte à l'application Express. Il contient également le code qui configure le serveur WebSocket.
//express est un framework Node.js qui permet de créer des applications web. Il fournit des fonctionnalités qui facilitent la création d'applications web, comme la gestion des routes, la gestion des requêtes et des réponses, etc.
//Le fichier app.js contient le code qui configure l'application Express et la connecte à la base de données MongoDB. Il contient également le code qui configure les en-têtes HTTP et les CORS.
//websocket est un protocole de communication bidirectionnel qui permet aux clients et au serveur de communiquer en temps réel. Il est utilisé pour créer des applications web en temps réel, comme les applications de chat.
