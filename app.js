
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var db;
var keys = require('./keys.js');
const PORT = 3000;

app.use(bodyParser.urlencoded({extended: true}));
const mongourl = 'mongodb://' + keys.user +
	':' + keys.password + '@ds123400.mlab.com:23400/messageboard';

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
})

app.get('/api/messages', function (req, res) {
	console.log('Hit: /api/messages');
});

app.post('/api/messages', function (req, res) {

});

app.get('/api/messages/:messageId', function (req, res) {
	console.log('Hit: /api/message/:messageId');
});

console.log(mongourl);
MongoClient.connect(mongourl, (err, database) => {
		if (err) return console.log(err);
		db = database;
		app.listen(PORT, function() {
			console.log('Listening on port: ' + PORT);
		});
	});
