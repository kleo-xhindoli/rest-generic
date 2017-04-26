
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ticketSchema = new Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User',
        unique: false
    },
    service: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: false
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});


var Tickets = mongoose.model('Ticket', ticketSchema);


module.exports = Tickets;