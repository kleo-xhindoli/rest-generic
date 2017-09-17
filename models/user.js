
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
    username: String,
    password: String,
    // OauthId: String,
    // OauthToken: String,
    firstname: {
    	type: String,
    	default: ''
    },
    lastname: {
    	type: String,
    	default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },
    birthday: {
        type: String,
        default: ''
    },
    cardId: {
        type: String,
        default: ''
    },
    tel: {
        type: String,
        default: ''
    },
    resetCode: {
        type: String
    }
});

User.methods.getName = function(){
	return (this.firstname + ' ' + this.lastname);
};


User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);