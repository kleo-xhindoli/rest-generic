var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var InfoCards = require('../models/infoCards');

router.use(bodyParser.json());

/* GET home page. */
router.route('/')
	.get(function(req, res, next){
		InfoCards.find({}, {legalInfo: 0})
		.exec(function(err, infoCard){
			if(err) {console.log(err); next(err);}
			res.json(infoCard);
		});
	})
	.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
		InfoCards.create(req.body, function(err, infoCard){
			if(err) {console.log(err); next(err);}
			console.log('infoCard Created!');
			var id = infoCard._id;
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('Added the infoCard with id: ' + id);
		});
	})
	.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
		InfoCards.remove({}, function(err, resp){
			if(err) {console.log(err); next(err);}
			res.json(resp);
		});
});

router.route('/:from/:to')
.get(function(req, res, next){
	let from = parseInt(req.params.from);
	let to = parseInt(req.params.to);
	InfoCards.find({}, {legalInfo: 0}).skip(from || 0).limit(to || 0)
	.exec(function(err, infoCard){
		if(err) {console.log(err); next(err);}
		res.json(infoCard);
	});
})

router.route('/institutions')
.get(function(req, res, next){
	InfoCards.find({})
	.distinct('responsibleInstitution')
	.exec(function(err, infoCard){
		if(err) {console.log(err); next(err);}
		res.json(infoCard);
	});
})

router.route('/:infoCardId')
	.get(function(req, res, next){
		InfoCards.findById(req.params.infoCardId, {legalInfo: 0})
		.populate('comments.postedBy')
		.exec(function(err, infoCard){
			if(err) {console.log(err); next(err);}
			res.json(infoCard);
		});
	})
	.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
		InfoCards.findByIdAndUpdate(req.params.infoCardId, {
			$set: req.body
		}, {new: true}, function(err, infoCard){
			if(err) {console.log(err); next(err);}
			res.json(infoCard);
		});
	})
	.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
		InfoCards.findByIdAndRemove(req.params.infoCardId, function (err, resp) {        
			if (err) {console.log(err); next(err);}
	        res.json(resp);
	    });
});



module.exports = router;
