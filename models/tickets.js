
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ticketSchema = new Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    service: {
        type: String,
        required: false
    },
    ticketCode: {
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
    nbServices: {
        type: Number,
        required: false,
        default: 1
    },
    endTime: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});


var Tickets = mongoose.model('Ticket', ticketSchema);


module.exports = Tickets;