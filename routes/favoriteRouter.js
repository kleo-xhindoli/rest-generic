var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Favorites = require('../models/favoriteSchema');

router.use(bodyParser.json());

/* GET home page. */
router.route('/')
	.all(Verify.verifyOrdinaryUser)
	.get(function(req, res, next){
		Favorites.find({})
		.populate('postedBy dishes')
		.exec(function(err, favoriteDishes){
			if(err) throw err;
			res.json(favoriteDishes);
		});
	})
	.post(function(req, res, next){
		Favorites.find({'postedBy': req.decoded._doc._id})
		.exec(function(err, favs){
			if(err) throw err;
			//Check if user has already added favorites before
			if(favs.length >= 1){
				favs[0].dishes.push(req.body._id);
				favs[0].save(function(err, fav){
					if(err) throw err;
					console.log("Adding dish to favorites");
					res.json(fav);
				});
			}
			else{
				Favorites.create({postedBy: req.decoded._doc._id}, function(err, fav){
					if(err) throw err;
					fav.dishes.push(req.body._id);
					fav.save(function(err, fav){
						if(err) throw err;
						console.log("Adding dish to favorites");
						res.json(fav);
					});
				});
			}
		});
	})
	.delete(function(req, res, next){
		Favorites.remove({'postedBy': req.decoded._doc._id}, function(err, resp){
			if(err) throw err;
			res.json(resp);
		});
});

router.route('/:dishId')
	.all(Verify.verifyOrdinaryUser)
	.delete(function(req, res, next){
		Favorites.find({'postedBy': req.decoded._doc._id}, function(err, favs){
			if(err) throw err;
			var fav = null;
			if(favs){
				fav = favs[0];
				for (var i = (fav.dishes.length - 1); i >= 0; i--) {
                    if (fav.dishes[i] == req.params.dishId) {
                        fav.dishes.remove(req.params.dishId);
                    }
                }
                fav.save(function(err, favorite){
                	if(err) throw err;
                	console.log('Favorite delete');
                	res.json(favorite);
                });
			}
			else{
				console.log('No favorites');
				res.json(favorite);
			}

		});
	});


module.exports = router;
