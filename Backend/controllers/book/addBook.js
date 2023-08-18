// post un livre
const mongoose = require('mongoose');
const Book = require('../../Models/book');



exports.addBook = (req, res, next) => {

    const bookObject = JSON.parse(req.body.book);//on transforme l'objet JSON en objet JS 

  
    const book = new Book({//on crée un nouveau livre avec les infos du livre
        ...bookObject, 
        userId: req.auth.userId, 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    book.save().then(//on enregistre le livre dans la base de données 
        () => {//on renvoie une réponse positive
            res.status(201).json(//on renvoie une réponse positive
            { message: 'Livre enregistré avec succès !'});
        }
    ).catch(//on renvoie une erreur si il y a un problème
        (error) => {
            res.status(400).json(
            { error: error }
            );
        }
    );
};
//200 = ok
//201 = created
//400 = bad request


