require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

// Port
const PORT = process.env.PORT || 3000;

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body Parser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // Set cookie to expire after 1 hour
}));

// Initialise Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Config
require('./config/passport')(passport);

// Connect Flash
app.use(flash());

// Custom Middleware for Flash Messages
app.use((req, res, next) => {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

// Static Public Folder
app.use(express.static(__dirname + '/public'));

// Routes
app.use('/', require('./routes/auth'));
app.use('/add-user', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/add-property', require('./routes/properties'));
app.use('/transactions', require('./routes/transactions'));

// Mongoose Connection
mongoose.connect('mongodb://localhost:27017/elrfms_db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on ${PORT}`));