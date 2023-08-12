const express = require('express'); // Importation du framework express pour faciliter la configuration du serveur

const app = express(); // Création d'une application express pour pouvoir utiliser les fonctionnalités du framework 

app.use((req, res, next) => { 
    console.log('Requête reçue !');
    next(); // Permet de passer au middleware suivant
});

app.use((req, res, next) => { // Middleware général appliqué à toutes les routes
    res.status(201); // Permet de modifier le statut de la réponse
    next(); // Permet de passer au middleware suivant

});


app.use((req, res, next) => {
    res.json({ message: 'Votre requête a bien été reçue !' }); // Réponse à la requête
});

app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !');
});



module.exports = app;


// un middleware est une fonction qui reçoit les objets request et response en tant que paramètre.
