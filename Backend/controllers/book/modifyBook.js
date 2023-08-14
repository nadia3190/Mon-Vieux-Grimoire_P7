// requete modifier 

const mongoose = require('mongoose');
const Book = require('../../Models/book');

exports.modifyBook = async (req, res, next) => {
    try {
        const book = await Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id });
        res.status(200).json({ message: 'Livre modifié !' });
    } catch (error) {
        res.status(400).json({ error });
    }
};

