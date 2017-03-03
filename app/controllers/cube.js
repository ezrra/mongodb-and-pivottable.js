var express = require('express');
var router 	= express.Router();
var config	= require('../../config');
var db = require('../db');

router.get('/data', function (req, res, next) {

	var dataCollection 	= db.get().collection(config.dataCollection);

	dataCollection.aggregate([
			{ $project: { "_id": 0  } }
			], { allowDiskUse: true, cursor: { batchSize: 100000 } }).toArray(function (err, data) {
			if (err) {
				next(err)
			}
		res.json(data);
	});

});

module.exports = router;
