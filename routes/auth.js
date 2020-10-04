const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const saltRounds = 10;

// Auth Guard
const { ensureAuthenticated } = require('../config/authenticate');
const { notAuthenticated } = require('../config/deauthenticate');

// User Model
const User = require('../models/User');

// Home Route Render Login Page
router.get('/', notAuthenticated, (req, res) => {
    res.render('login', { title: 'Sign In' });
});

// Login Handler
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);
});

// Register Route
router.get('/add-user', ensureAuthenticated, (req, res) => {
    res.render('register', { title: 'Add User' });
});

// Register Handler
router.post('/add-user', (req, res) => {
    // Destructuring
    const { name, email, password, confpass } = req.body;

    // Validation
    let validationErrors = [];

    // Required Fields
    if (!name || !email || !password || !confpass) {
        validationErrors.push({ message: 'Please Complete Required Fields' });
    }

    // Passwords Match
    if (password !== confpass) {
        validationErrors.push({ message: 'Passwords Do Not Match' });
    }

    // Password Too Short
    if (password.length < 8) {
        validationErrors.push({ message: 'Password Must Be At Least 8 Characters' });
    }

    if (validationErrors.length > 0) {
        res.render('register', { validationErrors, name, email, password, confpass });
    } else {
        // Validation Passes. Add User
        User.findOne({ email: email }, (err, user) => {
            if (err) {
                console.log(err);
            } else {
                if (user) {
                    validationErrors.push({ message: 'Email Already Registered' });
                    res.render('register', { validationErrors, name, email, password, confpass });
                } else {
                    // Save User
                    // Encrypt Password
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    bcrypt.hash(password, saltRounds, (err, hash) => {
                        if (err) {
                            console.log(err);
                        } else {
                            newUser.password = hash;

                            newUser.save((err) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    // Create Flash Message
                                    req.flash('success_message', 'User Added Successfully');
                                    res.redirect('/dashboard');
                                }
                            });
                        }
                    });
                }
            }
        });
    }
});

// Log Out
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;