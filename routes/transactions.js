const express = require('express');
const router = express.Router();

// Property Model
const Property = require('../models/Property');

// Transaction Model
const Transaction = require('../models/Transaction');

// Auth Guard
const { ensureAuthenticated } = require('../config/authenticate');

router.get('/:property', ensureAuthenticated, (req, res) => {
    const propertyId = req.params.property;

    // Pull out the property by id
    Property.findById(propertyId, (err, property) => {
        if (err) {
            console.log(err);
        } else {
            // Now find all of the transactions for the property
            Transaction.find({ property_id: propertyId }, (err, transactions) => {
                if (err) {
                    console.log(err);
                } else {
                    if (!transactions) {
                        transactions = [];
                    }

                    res.render('transactions', { title: 'Transactions', property: property, transactions: transactions });
                }
            });
        }
    });
});

router.get('/new-transaction/:property', (req, res) => {
    const propertyId = req.params.property;

    // Pull out the property by id
    Property.findById(propertyId, (err, property) => {
        if (err) {
            console.log(err);
        } else {
            res.render('new_transaction', { title: 'New Transaction', property: property });
        }
    });
});

router.post('/new-transaction', (req, res) => {
    // Check required fields
    const transactionDate = req.body.datepicker;
    let rentReceived = req.body.rent;
    let levyDeduction = req.body.levy;
    let levyDescription = req.body.levy_description;
    let maintenanceDeduction = req.body.maintenance;
    let maintenanceDescription = req.body.maintenance_description;
    let ratesDeduction = req.body.rates;
    let agencyDeduction = req.body.agency;
    const propertyId = req.body.submit;

    // Append Values With Cent Values
    if (!rentReceived.includes('.')) {
        rentReceived = rentReceived + '.00';
    }

    if (!levyDeduction.includes('.') && levyDeduction !== '') {
        levyDeduction = levyDeduction + '.00';
    } else if (levyDeduction === '') {
        levyDeduction = '0.00';
    }

    if (!maintenanceDeduction.includes('.') && maintenanceDeduction !== '') {
        maintenanceDeduction = maintenanceDeduction + '.00';
    } else if (maintenanceDeduction === '') {
        maintenanceDeduction = '0.00';
    }

    if (!ratesDeduction.includes('.') && ratesDeduction !== '') {
        ratesDeduction = ratesDeduction + '.00';
    } else if (ratesDeduction === '') {
        ratesDeduction = '0.00';
    }

    if (!agencyDeduction.includes('.') && agencyDeduction !== '') {
        agencyDeduction = agencyDeduction + '.00';
    } else if (agencyDeduction === '') {
        agencyDeduction = '0.00';
    }

    // Create Default Descriptions
    if (levyDescription === '') {
        levyDescription = 'No Description Provided';
    }

    if (maintenanceDescription === '') {
        maintenanceDescription = 'No Description Provided';
    }

    // Calculate Total Paid
    calculateTotalPaid();


    // Create New Transaction
    const newTransaction = new Transaction({
        transaction_date: transactionDate,
        rent_received: rentReceived,
        levy_deduction: levyDeduction,
        levy_description: levyDescription,
        maintenance_deduction: maintenanceDeduction,
        maintenance_description: maintenanceDescription,
        rates_deduction: ratesDeduction,
        agency_fee: agencyDeduction,
        property_id: propertyId
    });

    newTransaction.save();
    req.flash('success_message', 'Transaction Added Successfully');
    res.redirect('/transactions/' + propertyId);
});

// Total Paid Function
function calculateTotalPaid() {

}

module.exports = router;