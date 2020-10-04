const express = require('express');
const router = express.Router();

// Auth Guard
const { ensureAuthenticated } = require('../config/authenticate');

// Property Model
const Property = require('../models/Property');

// Add Properties Route
router.get('/', ensureAuthenticated, (req, res) => {
    res.render('add_property', { title: 'Add Property' });
});

// Add Properties Handler
router.post('/', (req, res) => {
    // Destructuring
    const { property, owner, email, number } = req.body;

    // Check if property exists
    Property.findOne({ property_name: property }, (err, foundProperty) => {
        if (err) {
            console.log(err);
        } else {
            if (foundProperty) {
                req.flash('error_message', 'Property Name Already Exists');
                res.render('add_property', { property, owner, email, number });
            } else {
                // Add New Property
                const newProperty = new Property({
                    property_name: property,
                    owner_name: owner,
                    owner_email: email,
                    owner_number: number
                });

                newProperty.save();
                req.flash('success_message', 'New Property Added Successfully');
                res.redirect('/dashboard');
            }
        }
    });
});

module.exports = router;