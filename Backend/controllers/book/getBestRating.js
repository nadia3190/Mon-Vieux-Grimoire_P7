// Importation de Mongoose et du modèle Book
const mongoose = require("mongoose");
const Book = require("../../Models/book");

// Exportation d'une fonction nommée getBestRating pour récupérer les trois livres les mieux notés
exports.getBestRating = async (req, res, next) => {
  try {
    // Utilisation de la méthode d'agrégation de Mongoose pour trier les livres par note moyenne, de la plus haute à la plus basse, et pour limiter le nombre de résultats à 3
    const bestRatedBooks = await Book.aggregate([
      {
        $sort: { averageRating: -1 }, // trier les livres par note moyenne, de la plus haute à la plus basse
        // -1 = ordre décroissant (du plus grand au plus petit)
      },
      {
        $limit: 3, // limiter le nombre de résultats à 3
      },
    ]);
    // Si la requête est réussie, renvoie une réponse avec un code de statut 200 et les trois livres les mieux notés
    res.status(200).json(bestRatedBooks); // renvoie un tableau d'objets
  } catch (error) {
    // Si une erreur se produit, renvoie une réponse avec un code de statut 400 et un objet d'erreur contenant le message d'erreur
    res.status(400).json({ error });
  }
};

//aggregate() = méthode de mongoose qui permet d'effectuer des opérations d'agrégation sur les données d'une collection (comme la méthode group() en SQL)
