var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Feedback = require('../models/feedback');

router.use(bodyParser.json());

/* GET home page. */
router.route('/')
	.get(Verify.verifyOrdinaryUser, function(req, res, next){
		Feedback.find({'createdBy': req.decoded._doc._id})
		.exec(function(err, ticket){
			if(err) console.log(err);
			res.json(ticket);
		});
	})
	.post(Verify.decodeTokenIfAvailable, function(req, res, next){
        if (!req.body.createdBy && req.decoded) {
            req.body.createdBy = req.decoded._doc._id;
        }
		Feedback.create(req.body, function(err, fBack){
			if(err) console.log(err);
			console.log('feedback Created!');
			res.json(fBack);
		});
	})
	.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
		Feedback.remove({}, function(err, resp){
			if(err) console.log(err);
			res.json(resp);
		});
});

router.route('/all')
	.get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
		Feedback.find({})
		.populate('createdBy')
		.populate('cardId')
		.exec(function(err, fBack){
			if(err) console.log(err);
			res.json(fBack);
		});
	})

router.route('/:feedbackId')
	.get(Verify.verifyOrdinaryUser, function(req, res, next){
		Feedback.findById(req.params.feedbackId)
		.exec(function(err, ticket){
			if(err) console.log(err);
			res.json(ticket);
		});
	})
	.put(Verify.verifyOrdinaryUser,Verify.verifyAdmin, function(req, res, next){
		Feedback.findByIdAndUpdate(req.params.feedbackId, {
			$set: req.body
		}, {new: true}, function(err, ticket){
			if(err) console.log(err);
			res.json(ticket);
		});
	})
	.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
		Feedback.findByIdAndRemove(req.params.feedbackId, function (err, resp) {
			if (err) console.log(err);
	        res.json(resp);
	    });
});



module.exports = router;
