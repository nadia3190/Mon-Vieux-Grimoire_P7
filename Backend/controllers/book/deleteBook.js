// requete supprimer

const mongoose = require('mongoose');
const Book = require('../../Models/book');

exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Livre supprimé !' });
    } catch (error) {
        res.status(400).json({ error });
    }
}