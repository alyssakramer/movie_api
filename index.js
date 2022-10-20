const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path'); 
const uuid = require('uuid');
const bodyParser = require('body-parser');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

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

// Gets the list of data about ALL  top movies  
app.get('/movies', (req, res) => {
    res.json(topMovies);
  });

// Gets the data about a single student, by name

app.get('/movies/:name', (req, res) => {
    res.json(topMovies.find((movie) =>
      { return movie.name === req.params.name }));
  });

// Gets the data about a single genre, by name

app.get('/genre/:name', (req, res) => {
    res.send('Successful GET request returning data on all genres');
  });

// Gets the data about a single director, by name

app.get('/directors/:name', (req, res) => {
    res.send('Successful GET request returning data on specific director');
  });

app.get('/documentation', (req, res) => {
    res.sendFile(__dirname + ('/public/documentation.html'));
});

app.post('/user', (req, res) => {
    let newUser = req.body

    if (!newUser.name) {
        const message = 'Missing name in request body';
        res.status(400).send(message);
      } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
      }
});

app.put('/user/:name/:username', (req, res) => {
    res.send('Successful PUT request updating users infomation');
});

app.post('/user/:id/:movies/:favorites', (req, res) => {
    res.send('Successful POST request adding favorite to users movies');
});

app.delete('/user/:id/:movies/:favorite', (req, res) => {
    res.send('Successful DELETE request removing movie from users favorites')
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

