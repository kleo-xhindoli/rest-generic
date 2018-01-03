let cards = require('./output.json');
var InfoCards = require('../models/infoCards');

console.log('Inserting infocards')

// InfoCards.insertMany(cards, function(err, docs) {
//     if (err) {
//         console.log('Could not insert docs');
//         console.log(err);
//         return;
//     }
//     console.log('inserted ' + docs.length + ' infoCards!');
// });

InfoCards.create(cards, function(err, doc) {
    if (err) {
        console.log(err);
        return
    }
    console.log(doc);
})
