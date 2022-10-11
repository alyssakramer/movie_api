const express = requite("express");
    morgan = require('morgan')

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(morgan('common', {stream: accessLogStream}));

// GET requests 
app.get('/movies', (req, res) => {
    res.json(topMovies);
  });
app.get('/', (req, res) => {
res.send('Welcome to myFlix App!');
});
app.use('/documentation.html', express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('App not working!');
});

app.listen(8080, () => {
    console.log('My Node is running on Port 8080.');
});

