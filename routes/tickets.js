var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var q = require('q');
var json2csv = require('json2csv');
var fs = require('fs');
var path = require('path');
var Verify = require('./verify');

var Tickets = require('../models/tickets');

router.use(bodyParser.json());

/* GET home page. */
router.route('/')
	.get(Verify.verifyOrdinaryUser, function(req, res, next){
		Tickets.find({'createdBy': req.decoded._doc._id})
		.exec(function(err, ticket){
			if(err) console.log(err);
			res.json(ticket);
		});
	})
	.post(Verify.verifyOrdinaryUser, function(req, res, next){
		generateNewCode().then(function(code){
			req.body.ticketCode = code;
			Tickets.create(req.body, function(err, ticket){
				if(err) console.log(err);
				console.log('ticket Created!');
				res.json(ticket);
			});
		})
	})
	.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
		Tickets.remove({}, function(err, resp){
			if(err) console.log(err);
			res.json(resp);
		});
});

router.route('/all')
	.get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
		Tickets.find({})
		.populate('createdBy')
		.exec(function(err, ticket){
			if(err) console.log(err);
			res.json(ticket);
		});
	})

router.route('/time-intervals/:date')
	.get(Verify.verifyOrdinaryUser, function(req, res, next){
		Tickets.find({date: req.params.date, status: 'Aprovuar'})
		.exec(function(err, tickets){
			if(err) console.log(err);
			var intervals = [];
			tickets.forEach(function(ticket){
				intervals.push({
					start: ticket.time,
					end: ticket.endTime
				});
			});
			intervals.sort(function(a, b){
				var ha = parseInt(a.start.split(':')[0]);
				var hb = parseInt(b.start.split(':')[0]);
				var ma = parseInt(a.start.split(':')[1]);
				var mb = parseInt(b.start.split(':')[1]);
				if (ha < hb) return -1;
				else if(ha > hb) return 1;
				else{
					if (ma < mb) return -1;
					else if (ma > mb) return 1;
					else return 0;
				}
			})
			res.json(intervals);
		});
	});

router.route('/csv')
	.get(function(req, res, next){
		Tickets.find({})
		// .populate('createdBy')
		.exec(function(err, tickets){
			if(err) console.log(err);
			var data = JSON.stringify(tickets);
			var fields = ['_id', 'date', 'time', 'endTime', 'location', 'service', 'nbServices', 'status', 'createdAt',  'createdBy'];
			var fieldNames = ['ID', 'Data', 'Ora e fillimit', 'Ora e mbarimit', 'Vendndodhja', 'Sherbimi', 'Numri i sherbimeve', 'Statusi', 'Krijuar me',  'Krijuar nga'];
			var csv = json2csv({ data: tickets, fields: fields, fieldNames: fieldNames });
			var file = path.resolve(`${__dirname}/../public/tickets.csv`);
			fs.writeFile(file, csv, function(err) {
				if (err) {
					res.status(500).send('Could not create file');
				}
				res.download(file, 'tickets.csv');

			})
		});
	});

router.route('/:ticketId')
	.get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
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
	.delete(Verify.verifyOrdinaryUser, function(req, res, next){
		Tickets.findByIdAndRemove(req.params.ticketId, function (err, resp) {
			if (err) console.log(err);
	        res.json(resp);
	    });
});




module.exports = router;

generateNewCode = function() {
	var defer = q.defer();
	Tickets.count()
	.exec(function(err, count) {
		if (err) defer.reject(err);
		count++;
		var newCode = count.toString();
		while(newCode.length < 6){
			newCode = '0' + newCode;
		}
		defer.resolve(newCode);
	});
	return defer.promise;
}
