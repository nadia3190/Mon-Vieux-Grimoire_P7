// ici c'est le fichier giveRatingBook.js qui va permettre de gérer les demandes POST visant à ajouter une note à un livre existant

// Importer le modèle Book

const Book = require("../../Models/book");

// Exporter une fonction nommée giveRatingBook pour gérer les demandes POST visant à ajouter une note à un livre existant
exports.giveRatingBook = async (req, res) => {
  // Extraire l'identifiant de l'utilisateur et la note du corps de la demande
  const { userId, rating } = req.body; //req.body = corps de la requête envoyée par le frontend (userId et rating sont envoyés par le frontend)
  //si on ne extrait pas on affiche avec req.body.userId et req.body.rating

  // Extraire l'identifiant du livre de la demande
  const { id } = req.params; //req.params = paramètres de la requête envoyée par le frontend (id est envoyé par le frontend)

  // Vérifier que l'identifiant de l'utilisateur et la note sont fournis
  if (!userId || !rating) {
    // si userId ou rating n'existe pas dans le body de la requête, renvoie une erreur avec un code de statut 400
    return res.status(400).json({ message: "userId and rating are required" });
  }

  // Vérifier que la note est comprise entre 0 et 5
  if (rating < 0 || rating > 5) {
    // si la note est inférieure à 0 ou supérieure à 5, renvoie une erreur avec un code de statut 400 et un message d'erreur
    return res.status(400).json({ message: "Rating must be between 0 and 5" });
  }

  try {
    // Trouver le livre correspondant à l'identifiant fourni
    const book = await Book.findById(id); // si le livre n'est pas trouvé, renvoie une erreur avec un code de statut 404 et un message d'erreur
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    // Vérifier si l'utilisateur a déjà noté ce livre
    const ratingExists = book.ratings.some(
      (item) => item.userId.toString() === userId //some() = méthode de javascript qui permet de vérifier si au moins un élément d'un tableau vérifie une condition donnée (ici, on vérifie si au moins un élément de la liste des notes du livre a un userId égal à celui fourni dans la requête)
    );
    if (ratingExists) {
      // si l'utilisateur a déjà noté ce livre, renvoie une erreur avec un code de statut 400 et un message d'erreur
      return res
        .status(400)
        .json({ message: "User has already rated this book" });
    }

    // Ajouter la note à la liste des notes du livre
    book.ratings.push({ userId, grade: rating }); // ajoute la note à la liste des notes du livre

    // Calculer la note moyenne du livre
    const totalRating = book.ratings.reduce((acc, item) => acc + item.grade, 0); //le 0 à la fin de la ligne est la valeur initiale de l'accumulateur (acc)
    book.averageRating = parseFloat(totalRating / book.ratings.length).toFixed(
      2
    ); // calcule la note moyenne du livre et l'arrondit à deux décimales après la virgule (toFixed(2))
    //acc = 0
    //acc = acc + 1 = 0 + 1 = 1
    //acc = acc + 2 = 1 + 2 = 3
    //acc = acc + 3 = 3 + 3 = 6
    //acc = acc + 4 = 6 + 4 = 10
    //acc = acc + 5 = 10 + 5 = 15

    //book.averageRating = 15 / 5 = 3 (toFixed(2) = 3,00)
    //parseFloat() = méthode de javascript qui permet de convertir une chaîne de caractères en nombre à virgule flottante

    // Enregistrer les modifications dans la base de données
    await book.save(); // enregistre les modifications dans la base de données

    // Envoyer une réponse avec un code de statut 201 et le livre mis à jour
    return res.status(201).json(book);
  } catch (error) {
    console.error(error);
    // En cas d'erreur, envoyer une réponse avec un code de statut 500 et un message d'erreur
    return res.status(500).json({ message: "Server error" });
  }
};

//findbyId() = méthode de mongoose qui permet de récupérer un document d'une collection en fonction de son ID (comme la méthode findOne() mais plus adaptée pour récupérer un document en fonction de son ID)
