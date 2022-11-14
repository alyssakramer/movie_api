const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 
const Models = require('.models.js');
const passportJWT = require('passport-jwt');

let User = Models.User, 
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password', 
}, (username, password, callback) => {
    console.log(username + ' ' + password);
    Users.findONe({ Username: username }, (error, user) => {
        if (error) {
            console.log(error);
            return callback(error);
        }

        if(!user) {
            console.log('incorrect username');
            return callback(null, false, {message: 'Incorrect username or password.'});
        }
        console.log('finished');
        return callback(null, user);
    });
}));