const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    property_name: {
        type: String,
        required: true
    },
    owner_name: {
        type: String,
        required: true
    },
    owner_email: {
        type: String,
        required: true
    },
    owner_number: {
        type: String,
        required: true
    }
});

const Property = new mongoose.model('Property', PropertySchema);

module.exports = Property;