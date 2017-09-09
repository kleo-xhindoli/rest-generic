
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var infoCardSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    profitable: {
        type: String,
        required: false
    },
    documents: [{
        number: Number,
        docType: String,
        institution: String,
        description: String
    }],
    applyLocation: {
        office: String,
        city: String,
        address: String,
        time: String
    },
    isOnline: {
        lvl1: Boolean,
        lvl2: Boolean,
        lvl3: Boolean,
        lvl4: Boolean,
    },
    fee: {
        base: String,
        extra: String,
        paymentMethod: String
    },
    serviceDuration: {
        type: String
    },
    profits: {
        type: String
    },
    serviceValidDuration: {
        type: String
    },
    location: {
        type: String
    },
    responsibleInstitution: {
        type: String
    },
    contact: {
        contactInfo: String,
        availableHours: String
    },
    legalInfo: {
        type: String
    },
    complaints: {
        type: String
    }
    
}, {
    timestamps: true
});


var InfoCards = mongoose.model('InfoCard', infoCardSchema);


module.exports = InfoCards;