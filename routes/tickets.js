var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Tickets = require('../models/tickets');

router.use(bodyParser.json());

/* GET home page. */
router.route('/')
	.get(Verify.verifyOrdinaryUser, function(req, res, next){
		Tickets.find({})
		.populate('createdBy')
		.exec(function(err, ticket){
			if(err) console.log(err);
			res.json(ticket);
		});
	})
	.post(Verify.verifyOrdinaryUser, function(req, res, next){
		Tickets.create(req.body, function(err, ticket){
			if(err) console.log(err);
			console.log('ticket Created!');
			var id = ticket._id;
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('Added the ticket with id: ' + id);
		});
	})
	.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
		Tickets.remove({}, function(err, resp){
			if(err) console.log(err);
			res.json(resp);
		});
});

router.route('/:ticketId')
	.get(Verify.verifyOrdinaryUser, function(req, res, next){
		Tickets.findById(req.params.ticketId)
		.populate('comments.postedBy')
		.exec(function(err, ticket){
			if(err) console.log(err);
			res.json(ticket);
		});
	})
	.put(Verify.verifyOrdinaryUser, function(req, res, next){
		Tickets.findByIdAndUpdate(req.params.ticketId, {
			$set: req.body
		}, {new: true}, function(err, ticket){
			if(err) console.log(err);
			res.json(ticket);
		});
	})
	.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
		Tickets.findByIdAndRemove(req.params.ticketId, function (err, resp) {        
			if (err) console.log(err);
	        res.json(resp);
	    });
});



module.exports = router;
