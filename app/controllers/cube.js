var express = require('express');
var router 	= express.Router();
var config	= require('../../config');
var db = require('../db');
var ObjectID = require('mongodb').ObjectID;
var utils = require('../utils');

router.get('/index', function (req, res, next) {

	let collection 	= db.get().collection(config.dataCollection);

	collection.aggregate([
		{ $project: { "_id": 0  } }
		], { allowDiskUse: true, cursor: { batchSize: 100000 } }).toArray(function (err, data) {
		if (err) next(err);

		res.json(data);
	});

});

router.get('/generate', function (req, res, next) {

	let collection 	= db.get().collection(config.dataCollection);
	let count = 10000;
	let items = [
	  { "product" : "Samsung Galaxy S", "os" : "1.0.2", "price" : "500" },
	  { "product" : "Samsung Galaxy Nexus", "os" : "5.0.1", "price" : "400" },
	  { "product" : "Samsung Galaxy S III", "os" : "4.4.2", "price" : "300" },
	  { "product" : "Samsung Galaxy S5", "os" : "4.4.2", "price" : "200" },
	];
	let itemsLenght = items.length - 1;

	for (let i = 0; i < 10000; i++) {
	  let random = utils.getRandom(1, itemsLenght);
	  let row = items[random];
		let objectId = new ObjectID();

		row._id = objectId;
  	row.date = new Date();

  	collection.insert(row, function(err, result) {
			if (err) next(err);
			count--;
			if (count === 0) res.json({ success: true })
		});
	};
});

module.exports = router;
