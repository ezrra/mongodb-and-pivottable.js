var express = require('express');
var router 	= express.Router();
var config	= require('../../config');
var db = require('../db');

router.get('/range', function (req, res) {

	var dataCollection 	= db.get().collection(config.dataCollection);
	var startDate 			= new Date(req.query.startDate + "T00:00:00");
	var endDate 				= new Date(req.query.endDate + "T23:59:59");

	dataCollection.aggregate([
			{ $match: { Date: { $gte: startDate, $lt: endDate } } },
			{ $project: { "_id": 0  } }
		], 	{ allowDiskUse: true, cursor: { batchSize: 100000 } }).toArray(function (err, data) {
			if (err) {
				console.log(err)
			}
			console.log(data)
		res.json(data);
	});

});

module.exports = router;
