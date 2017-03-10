var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var db;
var keys = require('./secrets.js');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var cron = require('cron')
var fs = require('fs')
var util = require('util')

const PORT = 3000;

const headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
};

const uploadScanner = cron.job('0 * * * * *', function() {
	console.log('Scanning directory..');

	var fileList = fs.readdirSync(__dirname + '/uploads');
	fileList.forEach(function(filename) {
		var path = __dirname + '/uploads/' + filename;
		var stats = fs.statSync(path);

		if (stats) {
			var mtime = new Date(util.inspect(stats.mtime))
			var now = new Date();
			var elapsed = now.getTime() - mtime.getTime();
			if (elapsed > 600000) fs.unlinkSync(path);
		}
	});
});

uploadScanner.start();
app.set('view engine', 'ejs');
app.use('/uploads', express.static('uploads'))
//app.use(bodyParser.urlencoded({extended: true}));
const mongourl = keys.dburi;

app.get('/', function (req, res) {
	db.collection('messages').find().toArray(function(err, results) {
		console.log(results);
		const npages = results.length / 10;
		res.render('index.ejs', {messages:results, pages:npages});
	});
});

app.get('/api/messages', function (req, res) {
	console.log('Hit: /api/messages');
	db.collection('messages').find().toArray(function(err, results) {
		console.log(results);
		res.send(results);
	});
});

app.post('/api/messages', upload.single('file'), function (req, res) {
	if (req.file) req.body.filepath = req.file.path;
	db.collection('messages').save(req.body, (err, result) => {
		if (err) return console.log(err);
	});
	//console.log('posted: ' + req.body);
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
