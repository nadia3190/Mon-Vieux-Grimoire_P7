//get book by id

const mongoose = require('mongoose');
const Book = require('../../Models/book');

exports.getBookById = async (req, res, next) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });
        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({ error });
    }
};






