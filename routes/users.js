var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');
var Mailer = require('./mailer');

/* GET users listing. */
router.get('/', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
	User.find({}, function(err, user){
		if(err) throw err;
		res.json(user);
	});
});

router.post('/register', function(req,res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			return res.status(500).json({err: err});
		}

		if(req.body.firstname){
			user.firstname = req.body.firstname;
		}
		if(req.body.lastname){
			user.lastname = req.body.lastname;
		}
		user.birthday = req.body.birthday;
		user.cardId = req.body.cardId;
		user.tel = req.body.tel;
		user.save(function(err, user){
			passport.authenticate('local')(req, res, function(){
				return res.status(200).json({status: 'Registration Successful!'});
			});
		});
	});
});

router.post('/register-admin', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			return res.status(500).json({err: err});
		}

		if(req.body.firstname){
			user.firstname = req.body.firstname;
		}
		if(req.body.lastname){
			user.lastname = req.body.lastname;
		}
		user.admin = true;
		user.save(function(err, user){
			passport.authenticate('local')(req, res, function(){
				return res.status(200).json({status: 'Registration Successful!'});
			});
		});
	});
});

router.post('/login', function(req, res, next){
	passport.authenticate('local', function(err, user, info){
		if(err){
			return next(err);
		}
		if(!user){
			return res.status(401).json({
				err: info
			});
		}
		req.logIn(user, function(err){
			if(err){
				return res.status(500).json({
					err: 'Could not log in user'
				});
			}
			console.log('User in users: ', user);
			var token = Verify.getToken(user);
			res.status(200).json({
				status: 'Login successful!',
				success: true,
				token: token,
				id: user._id,
				fullname: user.firstname + ' ' + user.lastname,
				username: user.username,
				admin: user.admin
			});
		});
	})(req, res, next);
});

router.get('/logout', function(req, res){
	req.logout();
	res.status(200).json({
		status: 'Bye'
	});
});

router.post('/changePassword/:username', Verify.verifyOrdinaryUser, function(req, res){
	if (req.decoded._doc.username !== req.params.username) {
		res.status(403).json({
			message: 'You are not authorized to perform this action'
		});
	}
	else {
		User.findByUsername(req.params.username).exec(function(err, user) {
			if (err) {
				console.log(err);
				res.status(500).json(err);
			}
			user.setPassword(req.body.password, function() {
				user.save();
				res.status(200).json({
					message: "Password changed successfully"
				});
			})
		});
	}
});

router.post('/resetPassword', function(req, res){
	User.findByUsername(req.body.username).exec(function(err, user) {
		if (err || !user) {
			console.log(err);
			res.status(404).json(err);
			return;
		}
		if (!user.resetCode || req.body.resetCode !== user.resetCode) {
			res.status(403).json({message: "Invalid Reset Code"});
			return;
		}
		user.setPassword(req.body.password, function() {
			user.resetCode = generateResetCode();
			user.save();
			res.status(200).json({
				message: "Password changed successfully"
			});
		})
	});
});

router.post('/requestReset', function(req, res){
	User.findByUsername(req.body.username).exec(function(err, user) {
		if (err || !user) {
			console.log(err);
			res.status(404).json(err);
			return;
		}
		let code = generateResetCode();
		user.resetCode = code;
		user.save(function(err, newUser){
			if (err) {
				console.log(err);
				res.send(500).json({message: err});
			}
			else {
				Mailer.sendResetMail(req.body.username, code);
				res.status(200).json({
					message: 'Success'
				});
			}
		});
	});
});

generateResetCode = function() {
	let output = '';
	for(let i = 0; i < 6; i++) {
		output += getRandomInt(0, 9);
	}
	return output;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = router;
