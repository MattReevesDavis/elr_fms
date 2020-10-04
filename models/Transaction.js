const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    transaction_date: {
        type: Date,
        required: true
    },
    rent_received: {
        type: String,
        required: true
    },
    levy_deduction: {
        type: String
    },
    levy_description: {
        type: String
    },
    maintenance_deduction: {
        type: String
    },
    maintenance_description: {
        type: String
    },
    rates_deduction: {
        type: String
    },
    agency_fee: {
        type: String
    },
    total_paid: {
        type: String
    },
    property_id: {
        type: String
    }
});

const Transaction = new mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;