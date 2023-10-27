// errorHandler.js permet de gérer les erreurs de manière centralisée. Cela permet de ne pas avoir à répéter le même code dans chaque route. Il est important de placer le middleware errorHandler.js après les routes dans le fichier server.js pour que les erreurs soient bien gérées.
const errorHandler = (err, req, res, next) => {
  console.error("ERRORHANDLER - " + err); // Affiche l'erreur dans la console (facultatif)

  const statusCode = err.statusCode || 500; // Utilise le statut de l'erreur ou 500 (Erreur interne du serveur) par défaut
  const errorMessage = err.message || "Une erreur est survenue.";

  res.status(statusCode).json({ message: errorMessage });
};

module.exports = errorHandler;
