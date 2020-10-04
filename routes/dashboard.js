const express = require('express');
const router = express.Router();

// Auth Guard
const { ensureAuthenticated } = require('../config/authenticate');

// Property Model
const Property = require('../models/Property');

// Dashboard Route
router.get('/', ensureAuthenticated, (req, res) => {
    const nameSplit = req.user.name.split(" ");
    const userFirstName = nameSplit[0];

    // Get all properties
    Property.find({}, (err, props) => {
        if (err) {
            console.log(err);
            req.flash('error_message', 'Property Loading Failed');
            res.render('dashboard', { user: userFirstName, title: 'Dashboard' });
        } else {
            res.render('dashboard', { user: userFirstName, title: 'Dashboard', properties: props });
        }
    });
});

module.exports = router;