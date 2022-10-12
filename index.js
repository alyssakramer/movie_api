const express = require('express');
const morgan = require('morgan')

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

let topMovies = [
    {
        title: 'Shawshank Redemption', 
        director: 'Frank Darabont'
    },
    {
        title: 'The Godfather',
        director: 'Francis Ford Coppola'
    },
    {
        title: 'The Dark Knight',
        director: 'Christopher Nolan'  
    }, 
    {
        title: 'The Godfather Part II',
        director: 'Francis Ford Coppola'
    }
]

app.use(morgan('common', {stream: accessLogStream}));

// GET requests 
app.get('/movies', (req, res) => {
    res.json(topMovies);
  });
app.get('/', (req, res) => {
res.send('Welcome to myFlix App!');
});

app.get('/documentation', (req, res) => {
    res.sendFile(__dirname + ('/documentation'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('App not working!');
});

app.listen(8080, () => {
    console.log('My Node is running on Port 8080.');
});

