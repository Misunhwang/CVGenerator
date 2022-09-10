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

app.get('home', function(req, res, next) {
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

app.get('/addRole', function(req, res, next) {
	res.render('addRole', {title: 'Add Role'});
});

app.get('/addCertification', function(req, res, next) {
	res.render('addCertification', {title: 'Add Certification'});
});

app.get('/addEducation', function(req, res, next) {
	res.render('addEducation', {title: 'Add Education'});
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

app.post('/addRole', function(req, res, next) {
  var role = req.body.role;

	console.log(role);

	var sql = `SELECT * FROM role WHERE rolename="${role}"`;
	console.log(sql);
	db.query(sql, function (err, result) {
		if (err) throw err;
		console.log(result);

		if(result.length > 0) {
			console.log(role + " role already exists");
		} else {
			sql = `INSERT INTO role (rolename) VALUES ("${role}")`;
			console.log(sql);
		  db.query(sql, function(err, result) {
		    if (err) throw err;
		    console.log('record inserted');
				res.render('home');
		  });
		}
	});
});

app.post('/addCertification', function(req, res, next) {
	var userid = req.body.userid;
	var certificationname = req.body.certification;
  var organization = req.body.organization;
  var issueYear = req.body.issueYear;
	var issueMonth = req.body.issueMonth;
	var description = req.body.description;

	var sql = `INSERT INTO certification (userid, certificationname, organization, issueYear, issueMonth, description)
						 VALUES ("${userid}", "${certificationname}", "${organization}", "${issueYear}", "${issueMonth}", "${description}")`;
	console.log(sql);
	db.query(sql, function(err, result) {
		if (err) throw err;
		console.log('record inserted');
		res.render('home');
	});
});

app.post('/addEducation', function(req, res, next) {
	var userid = req.body.userid;
	var schoolname = req.body.schoolname;
	var country = req.body.country;
  var coursename = req.body.coursename;
	var degree = req.body.degree;
  var startYear = req.body.startYear;
	var startMonth = req.body.startMonth;
	var notFinish = req.body.notFinish;
	var special = req.body.special;
	var sql = "";

	if(notFinish == "on") {
		sql = `INSERT INTO education (userid, schoolname, country, coursename, degree, startYear, startMonth, special)
					 VALUES ("${userid}", "${schoolname}", "${country}", "${coursename}", "${degree}", "${startYear}", "${startMonth}", "${special}")`;
	} else {
		var endYear = req.body.endYear;
		var endMonth = req.body.endMonth;
		var grade = req.body.grade;

		sql = `INSERT INTO education (userid, schoolname, country, coursename, degree, startYear, startMonth, special, endYear, endMonth, grade)
					 VALUES ("${userid}", "${schoolname}", "${country}", "${coursename}", "${degree}", "${startYear}", "${startMonth}", "${special}", "${endYear}", "${endMonth}", "${grade}")`;
	}
	console.log(sql);
	db.query(sql, function(err, result) {
		if (err) throw err;
		console.log('record inserted');
		res.render('home');
	});
});

app.listen(5500);
console.log('CV Generator is running on port 5500');
