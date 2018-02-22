let fs = require('fs');
let input = require('./input.json');
let applyLocation = require('./applyLocation.json');
let fee = require('./fee.json');
let contact = require('./contact.json');
let docs = require('./docs')

// let input = JSON.parse(inputJ);
// let applyLocation = JSON.parse(applyLocationJ);
// let fee = JSON.parse(feeJ);
// let contact = JSON.parse(contactJ);

let output = input.map((card, i) => {
    card.applyLocation = applyLocation[i];
    card.fee = fee[i];
    card.contact = contact[i];
    card.category = 'Asnje';
    card.subcategory = 'Asnje';
    cardDocs = docs
    .filter(d => d.code === card.code)
    .map((d) => {
        return {
            docType: d.docType,
            description: d.description,
            institution: d.institution,
            number: d.number
        };
    });

    switch (card.isOnline) {
        case 1:
            card.isOnline = {
                lvl1: true
            }
            break;
        case 2:
            card.isOnline = {
                lvl2: true
            }
            break;
        case 3:
            card.isOnline = {
                lvl3: true
            }
            break;
        case 4:
            card.isOnline = {
                lvl4: true
            }
            break;
        default:
            card.isOnline = {}

    }
    
    if (cardDocs)
        card.documents = cardDocs;
    return card;
});




fs.writeFileSync('./output.json', JSON.stringify(output));
console.log('done');
