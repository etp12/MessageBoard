var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var db;
var keys = require('./keys.js');
const PORT = 3000;

const headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
};


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
const mongourl = 'mongodb://' + keys.user +
	':' + keys.password + '@ds123400.mlab.com:23400/messageboard';

app.get('/', function (req, res) {
	db.collection('messages').find().toArray(function(err, results) {
		console.log(results);
		res.render('index.ejs', {messages:results});
	});
});

app.get('/api/messages', function (req, res) {
	console.log('Hit: /api/messages');
	db.collection('messages').find().toArray(function(err, results) {
		console.log(results);
		res.send(results);
	});
});

app.post('/api/messages', function (req, res) {

	db.collection('messages').save(req.body, (err, result) => {
		if (err) return console.log(err);
	});
	console.log(req.body);
	res.redirect('/');
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
