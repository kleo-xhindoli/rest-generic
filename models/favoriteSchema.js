
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;


var favoriteSchema = new Schema({
     postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
     dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
}, {
    timestamps: true
});


var Favorites = mongoose.model('Favorites', favoriteSchema);


module.exports = Favorites;