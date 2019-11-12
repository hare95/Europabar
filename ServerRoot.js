var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session'); //Sessions in Cookies speichern
var ejs = require('ejs');
var MongoStore = require('connect-mongo')(session);

var credentials = require('./sensitive/credentials.js');

//Verbindung zur Datenbank wie von MongoDB vorgeschlagen
mongoose.connect(credentials.url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

var app = express();
app.use(cookieParser(credentials.cookie_secret));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

//Passport: https://github.com/expressjs/session
app.use(session({
  secret: credentials.session_secret,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  resave: false,
  rolling: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

require('./passport/passport-setup.js')(passport);

require('./routes/authentication/app.js')(app, passport); //Passport routen
require('./routes/public/app.js')(app, passport); //Review routen
app.use('/static', express.static(__dirname + "/routes/static"));
app.use(express.static(__dirname + "/routes/public/host"));
//Fallback Route
app.use(function(req, res) {
  res.redirect('/');
});

app.listen(credentials.port);
console.log('Port: ' + credentials.port);