const mongoose = require('mongoose');
const Book = require('../../Models/book');




exports.getAllbooks = async (req, res, next) => {
    try {
    const books = await Book.find();
    res.status(200).json(books);
} catch (error) {
    res.status(400).json({ error });
}
};




