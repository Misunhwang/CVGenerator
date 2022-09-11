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

app.get('/addCareer', function(req, res, next) {
	var sql = `SELECT * FROM role`;
	console.log(sql);
	db.query(sql, function (err, result) {
		if (err) throw err;
		console.log(result);
		res.render('addCareer', {title: 'Add Career', rolelist: result});
	});
});

app.get('/mapRole', function(req, res, next) {
	var sql = `SELECT * FROM role`;
	console.log(sql);
	db.query(sql, function (err, resultRole) {
		if (err) throw err;
		console.log(resultRole);

		sql = `SELECT * FROM job WHERE userid="${userid}"`;
		console.log(sql);
		db.query(sql, function (err, resultJob) {
			if (err) throw err;
			console.log(resultJob);
			res.render('mapRole', {title: 'Map Role to Career', rolelist: resultRole, joblist: resultJob});
		});
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

app.post('/addCareer', function(req, res, next) {
	var userid = req.body.userid;
	var mainrole = req.body.mainRole;
	var emptype = req.body.emptype;
  var companyname = req.body.companyname;
	var country = req.body.country;
  var startYear = req.body.startYear;
	var startMonth = req.body.startMonth;
	var notFinish = req.body.notFinish;
	var description = req.body.description;
	var detail1 = req.body.detail1;
	var detail2 = req.body.detail2;
	var detail3 = req.body.detail3;
	var skills = req.body.skills;
	var subrole1 = req.body.subRole1;
	var subrole2 = req.body.subRole2;
	var subrole3 = req.body.subRole3;
	var sql = "";

	//1. Insert new career information into 'job' table
	console.log("1. Insert new career information into 'job' table...............");
	if(notFinish == "on") {
		sql = `INSERT INTO job (userid, employmenttype, companyname, country, startYear, startMonth, description, detail1, detail2, detail3, skills)
					 VALUES ("${userid}", "${emptype}", "${companyname}", "${country}", "${startYear}", "${startMonth}", "${description}", "${detail1}", "${detail2}", "${detail3}", "${skills}")`;
	} else {
		var endYear = req.body.endYear;
		var endMonth = req.body.endMonth;

		sql = `INSERT INTO job (userid, employmenttype, companyname, country, startYear, startMonth, description, detail1, detail2, detail3, skills, endYear, endMonth)
					 VALUES ("${userid}", "${emptype}", "${companyname}", "${country}", "${startYear}", "${startMonth}", "${description}", "${detail1}", "${detail2}", "${detail3}", "${skills}", "${endYear}", "${endMonth}")`;
	}
	console.log(sql);
	db.query(sql, function(err, result) {
		if (err) throw err;
		console.log('record inserted');

		//2. Insert multi roles information into 'jobrole' table
		console.log("2. Insert multi roles information into 'jobrole' table...............");
		var insertid = result.insertId;

		var roleMap = [
			{roleid: mainrole, ismain: true},
			{roleid: subrole1, ismain: false},
			{roleid: subrole2, ismain: false},
			{roleid: subrole3, ismain: false}
		];

		var tempRole = [];
		roleMap.forEach(function(role) {
			console.log("each role for inserted jobid......" + insertid);
			console.log(role);

			if(role.roleid == 0) {
				return;
			}

			for(var i=0; i<tempRole.length; i++) {
				if(tempRole[i] == role.roleid) {
					return;
				}
			}
			tempRole[tempRole.length] = role.roleid;

			sql = `SELECT * FROM jobrole WHERE jobid = ${insertid} and  roleid = ${role.roleid}`;
			console.log(sql);
		  db.query(sql, function(err, result) {
		    if(err) throw err;

				if(result.length == 0) {
					sql = `INSERT INTO jobrole (jobid, roleid, ismain)
								 VALUES (${insertid}, ${role.roleid}, ${role.ismain})`;
					console.log(sql);
					db.query(sql, function(err, result) {
						if (err) throw err;
						console.log('jobrole record inserted');
					});
				}
			});
		});

		//3. Insert multi skills into 'jobskill' table. It will use user's Skill summary
		console.log("3. Insert multi skills into 'jobskill' table. It will use user's Skill summary...............");
		console.log("skills : " + skills);
		var skillarray = skills.split(","); //split each skills

		for(var i=0; i<skillarray.length; i++) { //remove whitespace
			skillarray[i] = skillarray[i].trim();
		}

		var uniqueSkillarray = [ ...new Set(skillarray)]; //remove duplicate skill

		for(var j=0; j<uniqueSkillarray.length; j++) {
			console.log("for skill : " + uniqueSkillarray[j]);

			sql = `INSERT INTO jobskill (jobid, skill, userid)
						 VALUES (${insertid}, "${uniqueSkillarray[j]}", "${userid}")`;
			console.log(sql);
			db.query(sql, function(err, result) {
				if (err) throw err;
				console.log('jobskill record inserted');
			});
		}

/*
			sql = `SELECT * FROM jobskill WHERE jobid = ${insertid} and  skill = "${uniqueSkillarray[j]}"`;
			console.log(sql);
		  db.query(sql, function(err, result) {
		    if(err) throw err;

				if(result.length == 0) {
					sql = `INSERT INTO jobskill (jobid, skill, userid)
								 VALUES (${insertid}, "${uniqueSkillarray[j]}", "${userid}")`;
					console.log(sql);
					db.query(sql, function(err, result) {
						if (err) throw err;
						console.log('jobskill record inserted');
					});
				};
			});
*/

		res.render('home');
	});
});

app.listen(5500);
console.log('CV Generator is running on port 5500');
