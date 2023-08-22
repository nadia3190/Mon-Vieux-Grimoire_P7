// errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error("ERRORHANDLER - " + err); // Affiche l'erreur dans la console (facultatif)
  
    const statusCode = err.statusCode || 500; // Utilise le statut de l'erreur ou 500 (Erreur interne du serveur) par défaut
    const errorMessage = err.message || 'Une erreur est survenue.';
    
    res.status(statusCode).json({ message: errorMessage });
  };
  
  module.exports = errorHandler;