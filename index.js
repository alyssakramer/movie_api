const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path'); 
const uuid = require('uuid');
const bodyParser = require('body-parser');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(bodyParser.json());

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

app.use(morgan('common', {stream: accessLogStream}));

// Gets the list of data about ALL  top movies  
app.get('/movies', (req, res) => {
    res.json(topMovies);
  });

// Gets the data about a single student, by name

app.get('/movies/:name', (req, res) => {
    res.json(movies.find((movie) =>
      { return movie.name === req.params.name }));
  });

// Gets the data about a single genre, by name

app.get('/genre/:name', (req, res) => {
    res.send('Successful GET request returning data on all genres');
  });

// Gets the data about a single director, by name

app.get('/directors/:name', (req, res) => {
    res.send('Successful GET request returning data on specific director')
  });

app.get('/documentation', (req, res) => {
    res.sendFile(__dirname + ('/documentation.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('App not working!');
});

app.listen(8080, () => {
    console.log('My Node is running on Port 8080.');
});

