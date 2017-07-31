var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

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

// router.get('/facebook', passport.authenticate('facebook'), function(req,res){});

// router.get('/facebook/callback', function(req,res,next){
// 	passport.authenticate('facebook', function(err, user, info){
// 		if(err){
// 			return next(err);
// 		}
// 		if(!user){
// 			return res.status(401).json({
// 				err: info
// 			});
// 		}
// 		req.logIn(user, function(err){
// 			if(err){
// 				return res.status(500).json({
// 					err: 'Could not log in user'
// 				});
// 			}

// 			var token = Verify.getToken(user);
// 			res.status(200).json({
// 				status: 'Login successful!',
// 				success: true,
// 				token: token
// 			});
// 		});
// 	})(req, res, next);
// });


module.exports = router;
