const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path'); 
const uuid = require('uuid');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Model.Movie;
const Users = Model.User; 

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

mongoose.connect('mongodb://localhost:27017/MyFlixDB', {useNewUrlParser: true, useUnifiedTopology: true}); 

app.use(bodyParser.json());

let user = {
  id: 1,
  name: 'Alyssa K',
  username: 'akramer',
  password: '1234',
  email: 'ak@gmail.com'
}

let topMovies = [
    {
        id : 1,
        title: 'Shawshank Redemption', 
        director: 'Frank Darabont'
    },
    {
        id: 2,
        title: 'The Godfather',
        director: 'Francis Ford Coppola'
    },
    {
        id: 3, 
        title: 'The Dark Knight',
        director: 'Christopher Nolan'  
    }, 
    {
        id: 4, 
        title: 'The Godfather Part II',
        director: 'Francis Ford Coppola'
    }
]

app.use(morgan('common', {stream: accessLogStream}))

// Get all movies  
app.get('/movies', (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Gets the data about a single student, by name

app.get('/movies/:title', (req, res) => {
  Movies.findOne({ 'Movie.Title': req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// Gets the data about a single genre, by name
app.get('/genre/:name', (req, res) => {
  Movies.find({ 'Genre.Name': req.params.Name })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// Gets the data about a single director, by name
app.get('/directors/:name', (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

app.get('/documentation', (req, res) => {
    res.sendFile(__dirname + ('/public/documentation.html'));
});

// Get all users 
app.get('/users', (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        res.status(500).send('Error: ' + err);
      });
});

app.get('/users/:username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    res.status(500).send('Error: ' + err);
  });
});

app.post('/user/:id/:movies/:favorites', (req, res) => {
    res.send('Successful POST request adding favorite to users movies');
});

app.delete('/user/:id/:movies/:favorite', (req, res) => {
    res.send('Successful DELETE request removing movie from users favorites')
});

// Add a user 
/* We'll use JSON format 
{
  ID: Integer, 
  Name: String, 
  Username: String, 
  Password: String, 
  Email: String, 
  Birthday: Date
}*/
app.post('/users', (req, res) =>{
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if(user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Name: req.body.Name,
            Username: req.body.Username,
            Password: req.body.Password, 
            Email: req.body.Email, 
             Birthday: req.body.Birthday
          })
          .then((user) => {res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Deletes a user from our list by ID
app.delete('/user/:id', (req, res) => {
    let user = user.find((user) => { return user.id === req.params.id });
  
    if (user) {
      users = users.filter((obj) => { return obj.id !== req.params.id });
      res.status(201).send('User ' + req.params.id + ' was deleted.');
    }
  });

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('App not working!');
});

app.listen(3001, () => {
    console.log('My Node is running on Port 3001.');
});

