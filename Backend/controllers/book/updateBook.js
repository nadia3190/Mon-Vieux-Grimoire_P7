// requete modifier

const mongoose = require("mongoose");
const Book = require("../../Models/book");

exports.updateBook = async (req, res, next) => {
  try {
    // Chercher le livre à modifier en utilisant son ID
    const book = await Book.findById(req.params.id);
    if (!book) {
      // Si le livre n'est pas trouvé, renvoie une erreur avec un code de statut 404 et un message d'erreur
      return res.status(404).json({ error: "Book not found" });
    }

    // Vérifier que l'utilisateur est autorisé à modifier ce livre
    if (book.userId.toString() !== req.auth.userId) {
      //si l'utilisateur n'est pas l'auteur du livre, renvoie une erreur avec un code de statut 401 et un message d'erreur
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Mettre à jour le livre dans la base de données en utilisant son ID, les nouvelles données et l'URL de l'image mise à jour
    let imageUrl = book.imageUrl; //si l'utilisateur n'a pas téléchargé de nouvelle image, imageUrl est égal à l'URL de l'image existante
    if (req.file) {
      //si l'utilisateur a téléchargé une nouvelle image, imageUrl est égal à l'URL de la nouvelle image
      imageUrl = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
    }

    const updatedBook = await Book.findByIdAndUpdate(
      //mettre à jour le livre dans la base de données en utilisant son ID, les nouvelles données et l'URL de l'image mise à jour
      req.params.id,
      {
        ...req.body, // Utiliser l'opérateur de décomposition pour ajouter toutes les propriétés de `req.body`
        imageUrl: imageUrl, // Utiliser l'URL de l'image mise à jour
      },
      { new: true } // Renvoyer le livre mis à jour après la modification
    );
    res.status(200).json({ book: updatedBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};
