var express = require('express');
var path = require('path');
var db=require('./dbConfig');

var app = express();

var userid = "sunny";

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Get home page */
app.get('/', function(req, res, next) {
	res.render('home', {title: 'Home'});
});

app.get('/personalinfo', function(req, res, next) {
	var sql = `SELECT * FROM user WHERE userid="${userid}"`;
	console.log(sql);
	db.query(sql, function (err, result) {
		if (err) throw err;
		console.log(result);
		res.render('personalinfo', {title: 'View Personal Info', userInfo: result});
	});
});

app.post('/personalinfo', function(req, res, next) {
  //var userid = req.body.userid;
  var phone = req.body.phone;
  var email = req.body.email;
  var linkedin = req.body.linkedin;
	var website = req.body.website;
	var objective = req.body.objective;

	console.log(userid);

  var sql = `UPDATE user SET phone="${phone}", email="${email}",
						 linkedin="${linkedin}", website="${website}", objective="${objective}"
						 WHERE userid="${userid}"`;
	console.log(sql);
  db.query(sql, function(err, result) {
    if (err) throw err;
    console.log('record Updated');
		res.redirect('/personalinfo');
  });
});

app.listen(5500);
console.log('CV Generator is running on port 5500');
