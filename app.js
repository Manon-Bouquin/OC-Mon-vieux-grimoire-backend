import express from 'express';

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.post('/api/stuff', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
      message: "Livre ajouté"
    });
  });
  
app.get('/api/stuff', (req, res, next) => {
    const Book = [
      {
        userId: "qsomihvqios",
        title: "Mon premier livre",
        author: "Auteur",
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        year:2024,   //Année de publication du livre
        genre: "Fiction",
        ratings: [
          {
            userId: "qsomihvqios",
            grade: 2,    //note donnée par l'utilisateur
          }
        ],
        averageRating: 5  //Note moyenne du livre
      },
      {
        userId: "qsomihvqios",
        title: "Mon deuxième livre",
        author: "Auteur",
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        year:2022,   
        genre: "Fiction",
        ratings: [
          {
            userId: "qsomihvqios",
            grade: 8,    
          }
        ],
        averageRating: 9 
      },
    ];
    res.status(200).json(Book);
  });

export default app;