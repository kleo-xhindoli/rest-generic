
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
}, {
    timestamps: true
});


var InfoCards = mongoose.model('InfoCard', infoCardSchema);


module.exports = InfoCards;