
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var feedbackSchema = new Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    feedbackFor: {
        type: String,
        required: false
    },
    cardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InfoCard',
        required: false
    },
    rating: {
        type: Number,
        required: false,
        default: 10
    },
    wasHelpful: {
        type: Boolean,
        required: false,
        default: true
    },
    difficulty: {
        type: String,
        required: false,
    },
    suggestions: {
        type: String,
        required: false,
    },
    comments: {
        type: String,
        required: false,
    }
}, {
    timestamps: true
});


var Feedbacks = mongoose.model('Feedback', feedbackSchema);


module.exports = Feedbacks;