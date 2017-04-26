var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Verify = require('./verify');

router.use(bodyParser.json());

/* GET home page. */
router.route('/')
	.all( function(req, res, next){
		res.writeHead(200, {'Content-Type': 'text/plain'});
		next();
	})
	.get(Verify.verifyOrdinaryUser, function(req, res, next){
		res.end('Will send all the leadership to you!');
	})
	.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
		res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
	})
	.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
		res.end('Deleting all leadership');
});

router.route('/:leaderId')
	.all(function(req, res, next){
		res.writeHead(200, {'Content-Type': 'text/plain'});
		next();
	})
	.get(Verify.verifyOrdinaryUser, function(req, res, next){
		res.end('Will send details of the leader: ' + req.params.leaderId + ' to you.');
	})
	.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
		res.write('Updating the leader: ' + req.params.leaderId + '\n');
		res.end('Will update the leader: ' + req.body.name + ' with details: ' + req.body.description);
	})
	.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
		res.end('Deleting leader: ' + req.params.leaderId);
});

module.exports = router;
