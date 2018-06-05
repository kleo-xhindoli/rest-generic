var express = require('express');
var router = express.Router();
var Verify = require('./verify');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/user', Verify.verifyOrdinaryUser, function (req, res, next) {
    res.render('index', { title: 'ordinary User' });
});

router.get('/admin', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    res.render('index', { title: 'Admin' });
});

module.exports = router;
