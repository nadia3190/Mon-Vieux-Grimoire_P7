// ici c'est le fichier giveRatingBook.js qui va permettre de gérer les demandes POST visant à ajouter une note à un livre existant

// Importer le modèle Book

const Book = require("../../Models/book");

// Exporter une fonction nommée giveRatingBook pour gérer les demandes POST visant à ajouter une note à un livre existant
exports.giveRatingBook = async (req, res) => {
  // Extraire l'identifiant de l'utilisateur et la note du corps de la demande
  const { userId, rating } = req.body;

  // Extraire l'identifiant du livre de la demande
  const { id } = req.params;

  // Vérifier que l'identifiant de l'utilisateur et la note sont fournis
  if (!userId || !rating) {
    return res.status(400).json({ message: "userId and rating are required" });
  }

  // Vérifier que la note est comprise entre 0 et 5
  if (rating < 0 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 0 and 5" });
  }

  try {
    // Trouver le livre correspondant à l'identifiant fourni
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    // Vérifier si l'utilisateur a déjà noté ce livre
    const ratingExists = book.ratings.some(
      (item) => item.userId.toString() === userId
    );
    if (ratingExists) {
      return res
        .status(400)
        .json({ message: "User has already rated this book" });
    }

    // Ajouter la note à la liste des notes du livre
    book.ratings.push({ userId, grade: rating });

    // Calculer la note moyenne du livre
    const totalRating = book.ratings.reduce((acc, item) => acc + item.grade, 0);
    book.averageRating = parseFloat(totalRating / book.ratings.length).toFixed(
      2
    );

    // Enregistrer les modifications dans la base de données
    await book.save();

    // Envoyer une réponse avec un code de statut 201 et le livre mis à jour
    return res.status(201).json(book);
  } catch (error) {
    console.error(error);
    // En cas d'erreur, envoyer une réponse avec un code de statut 500 et un message d'erreur
    return res.status(500).json({ message: "Server error" });
  }
};
