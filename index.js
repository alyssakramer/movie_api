const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path'); 
const uuid = require('uuid');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User; 

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

mongoose.connect('mongodb://localhost:27017/MyFlixDB', {useNewUrlParser: true, useUnifiedTopology: true}); 

app.use(bodyParser.json());

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

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Name: req.body.Name, 
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    res.status(500).send('Error: ' + err);
  });
});

// Add movie to user's favorites list
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Delete movie from users favorites list
app.delete('/user/:Username/:movies/MovieID:', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username }, {
      $pull: { FavoriteMovies: req.params.MovieID}
    },
    { new: true }, // This line makes sure that the updated document is returned
   (err, updatedUser) => {
     if (err) {
       console.error(err);
       res.status(500).send('Error: ' + err);
     } else {
       res.json(updatedUser);
     }
   });
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

// Deletes a user by username
app.delete('/user/:Username', (req, res) => {
   Users.findOneAndRemove({ Username: req.params.Username})
    .then((user) => {
      if(!user) {
        res.status(400).send(req.params.Username + ' was not found.');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.')
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    })
  });

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('App not working!');
});

app.listen(3001, () => {
    console.log('My Node is running on Port 3001.');
});

