var config = require('../config');
var sg = require('sendgrid')(config.sendgridKey);

var helper = require('sendgrid').mail;
var fromEmail = new helper.Email(config.fromEmail);


module.exports.sendResetMail = function(to, code) {
    var toEmail = new helper.Email(to);
    var subject = 'Kerkese per ndryshim fjalëkalimi';
    var html = `
        <head>
            <style>
                body {
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <p>Ju keni kerkuar nje ndryshim te fjalekalimit tuaj. Kodi juaj per ndryshimin e fjalekalimit eshte: </p>
            <h1>${code}</h1>
            <p>Nese kerkesa nuk eshte kryer nga ju, ju lutemi ta injoroni kete email.</p>
        </body>
    `
    
    var content = new helper.Content('text/html', html);
    var mail = new helper.Mail(fromEmail, subject, toEmail, content);
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });
    
    sg.API(request, function (error, response) {
        if (error) {
            console.log('Error response received');
        }
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });
}