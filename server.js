var	express 	= require('express'),
	app 				= express(),
	bodyParser 	= require('body-parser'),
	config			= require('./config'),
	path 				= require('path');

var db = require('./app/db');

app.set('port', config.port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(express.static(path.join(__dirname + '/public')));

app.use('/api', require('./app/controllers/cube'));

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

db.connect(config.connection, function (err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.listen(app.get('port'), function (listen) {
        console.log('App is running http://localhost:' + app.get('port'));
    });
  }
})
