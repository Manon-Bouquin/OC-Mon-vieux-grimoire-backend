const Book = require("../models/book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  bookObject.ratings = [];
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Livre enregistré!" }))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book
    .findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book
    .find() 
    .then(books => res.status(200).json(books))
    .catch(error => res.status(404).json({ error }));
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
  } : {...req.body};
  delete bookObject._userId;
  Book
    .findOne({_id: req.params.id})
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        Book.updateOne({_id: req.params.id}, {...bookObject, _id: req.params.id})
        .then(() => res.status(200).json({ message: "Livre modifié !" }))
        .catch(error => res.status(401).json({ error }));
      }
    })
    .catch(error => res.status(404).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book
    .findOne({_id: req.params.id})
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({_id: req.params.id})
          .then(() => {res.status(200).json({ message: "Livre supprimé !" })})
          .catch(error => res.status(401).json({ error}));
        });
      }
    })
    .catch(error => res.status(500).json({ error }));
};

exports.ratingBook = (req, res, next) => {
  const rating = req.body.rating;
  if (rating < 0 || rating > 5) {
    return res.status(400).json({ message: "La note doit être entre 0 et 5." });
  }
  Book
    .findOne({_id: req.params.id})
    .then((book) => {
      if (book.ratings.find((rating) => rating.userId === req.auth.userId) !== undefined) {
        return res.status(403).json({ message: "unauthorized request !" })
      }
      book.ratings.push({ userId: req.auth.userId, grade: rating });
      const totalRating = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
      book.averageRating = totalRating / book.ratings.length;
      book
      .save()
      .then(() => res.status(200).json({ message: "Note ajouté ! " }))
      .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.bestRating = (req, res, next) => {
  Book
    .find()
    .sort({ averageRating: -1 }) // Tri par moyenne de notes décroissante
    .limit(3) // Garde seulement les 3 premiers livres
    .then(books => res.status(200).json(books))
    .catch(error => res.status(500).json({ error }));
};
