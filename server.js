//initialize app as an express application
var express = require('express');
var app = express();
var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');

// install, load, and configure body parser module
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'Bazinga',
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// require ("./server/app.js")(app);

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});