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
		//console.log(resultRole);

//		sql = `SELECT * FROM job WHERE userid="${userid}"`;
		sql = `SELECT job.*, jobrole.roleid, role.rolename FROM job ` +
					`INNER JOIN jobrole ON job.jobid=jobrole.jobid and jobrole.ismain=1 and job.userid="${userid}" ` +
					`INNER JOIN role ON jobrole.roleid = role.roleid;`;
		console.log(sql);
		db.query(sql, function (err, resultJob) {
			if (err) throw err;
			//console.log(resultJob);

/*
			var jobSet = new Set();


			Object.keys(resultJob).forEach(function(key) {
				console.log(key);
	      var row = resultJob[key];

//				var subrolevalues = "";

//				get_subrole(row.jobid, function(result) {
//					subrolevalues = result;
//					console.log("result : " + result);
//				});
//				console.log("subrolevalues : " + subrolevalues);


	      console.log(row.jobid + "----------------------");
				sql = `select role.* from role inner join jobrole on role.roleid=jobrole.roleid and jobid=${row.jobid} and ismain=0`;
				console.log(sql);
				row.subroles = db.query(sql, function (err, result, next) {
					if (err) throw err;
					console.log(result);

					txt = "";
					if(result.length > 0) {
						if(result.length == 1) {
							txt = result[0].rolename;
						}
						else {
							for(var i=0; i<result.length-1; i++) {
								txt += result[i].rolename + ",";
							}
							txt += result[result.length-1].rolename;
						}
					}

					return txt;

					//console.log("txt in : " + txt);
				});

				//console.log("txt out : " + txt);
				row.subroles = subrolevalues;
				jobSet.add(row);

			});

			console.log("jobSet.....");
			console.log(jobSet);
*/

			sql = `SELECT jobrole.jobid, jobrole.ismain, jobrole.roleid, role.rolename ` +
						`FROM jobrole inner join job on jobrole.jobid = job.jobid and job.userid="${userid}" ` +
						`inner join role WHERE jobrole.roleid = role.roleid order by 1, 2 desc;`;
			console.log(sql);
			db.query(sql, function (err, resultJobrole) {
				if (err) throw err;
				//console.log(resultJobrole);
				res.render('mapRole', {title: 'Map Role to Career', rolelist: resultRole, joblist: resultJob, jobrolelist: resultJobrole});
			});

			//res.render('mapRole', {title: 'Map Role to Career', rolelist: resultRole, joblist: jobSet});
		});
	});
});

/*
function get_subrole(jobid, callback) {
	console.log(jobid + "----------------------");
	var sql0 = `select role.* from role inner join jobrole on role.roleid=jobrole.roleid and jobid=${jobid} and ismain=0`;
	console.log(sql0);
	db.query(sql0, function (err, result) {
		if (err) throw err;
		console.log(result);

		var txt = "";
		if(result.length > 0) {
			if(result.length == 1) {
				txt = result[0].rolename;
			}
			else {
				for(var i=0; i<result.length-1; i++) {
					txt += result[i].rolename + ",";
				}
				txt += result[result.length-1].rolename;
			}
		}

		console.log("txt in get_subrole : " + txt);
		return callback(txt);

	});
}
*/

app.get('/viewCareer', function(req, res, next) {
	var selectedrole = req.query.roleid;

	if(typeof selectedrole == "string") {
		selectedrole = Number(selectedrole);
	} else {
		selectedrole = 0;
	}

	var sql = `SELECT * FROM role`;
	console.log(sql);
	db.query(sql, function (err, resultRole) {
		if (err) throw err;
		//console.log(resultRole);

		sql = `SELECT job.*, jobrole.roleid, role.rolename FROM job ` +
					`INNER JOIN jobrole ON job.jobid=jobrole.jobid and jobrole.ismain=1 and job.userid="${userid}" ` +
					`INNER JOIN role ON jobrole.roleid = role.roleid`;
		if(selectedrole > 0) {
			sql += ` INNER JOIN (SELECT DISTINCT JOBID FROM JOBROLE WHERE roleid=${selectedrole}) distjob on job.jobid = distjob.jobid`;
			//sql += ` AND jobrole.roleid = ${selectedrole}`;
		}
		console.log(sql);
		db.query(sql, function (err, resultJob) {
			if (err) throw err;
			console.log(resultJob);

 			sql = `SELECT jobrole.jobid, jobrole.ismain, jobrole.roleid, role.rolename ` +
						`FROM jobrole inner join job on jobrole.jobid = job.jobid and job.userid="${userid}" ` +
						`inner join role ON jobrole.roleid = role.roleid`;
			if(selectedrole > 0) {
				sql += ` INNER JOIN (SELECT DISTINCT JOBID FROM JOBROLE WHERE roleid=${selectedrole}) distjob on job.jobid = distjob.jobid`;
				//sql += ` AND jobrole.roleid = ${selectedrole}`;
			}
			sql += ` order by 1, 2 desc`;
			console.log(sql);
			db.query(sql, function (err, resultJobrole) {
				if (err) throw err;
				console.log(resultJobrole);

				sql = `SELECT * FROM education WHERE userid="${userid}" `;
				console.log(sql);
				db.query(sql, function (err, resultEducation) {
					if (err) throw err;
					console.log(resultEducation);

					sql = `SELECT * FROM certification WHERE userid="${userid}" `;
					console.log(sql);
					db.query(sql, function (err, resultCertification) {
						if (err) throw err;
						console.log(resultCertification);
						res.render('viewCareer', {title: 'View Career', rolelist: resultRole, joblist: resultJob, jobrolelist: resultJobrole, educationlist: resultEducation, certificationlist: resultCertification, selectedrole: selectedrole});
					});

					//res.render('viewCareer', {title: 'View Career', rolelist: resultRole, joblist: resultJob, jobrolelist: resultJobrole, educationlist: resultEducation});
				});

				//res.render('viewCareer', {title: 'View Career', rolelist: resultRole, joblist: resultJob, jobrolelist: resultJobrole});
			});
		});
	});
});

app.get('/previewCV', function(req, res, next) {
	var selectedrole = req.query.roleid;

	if(typeof selectedrole == "string") {
		selectedrole = Number(selectedrole);
	} else {
		selectedrole = 0;
	}

	var sql = `SELECT * FROM user where userid="${userid}"`;
	console.log(sql);
	db.query(sql, function (err, resultUser) {
		if (err) throw err;
		console.log(resultUser);

		sql = `SELECT job.*, jobrole.roleid, role.rolename FROM job ` +
					`INNER JOIN jobrole ON job.jobid=jobrole.jobid and jobrole.ismain=1 and job.userid="${userid}" ` +
					`INNER JOIN role ON jobrole.roleid = role.roleid`;
		if(selectedrole > 0) {
			sql += ` INNER JOIN (SELECT DISTINCT JOBID FROM JOBROLE WHERE roleid=${selectedrole}) distjob on job.jobid = distjob.jobid`;
			//sql += ` AND jobrole.roleid = ${selectedrole}`;
		}
		console.log(sql);
		db.query(sql, function (err, resultJob) {
			if (err) throw err;
			console.log(resultJob);

 			sql = `SELECT jobrole.jobid, jobrole.ismain, jobrole.roleid, role.rolename ` +
						`FROM jobrole inner join job on jobrole.jobid = job.jobid and job.userid="${userid}" ` +
						`inner join role ON jobrole.roleid = role.roleid`;
			if(selectedrole > 0) {
				sql += ` INNER JOIN (SELECT DISTINCT JOBID FROM JOBROLE WHERE roleid=${selectedrole}) distjob on job.jobid = distjob.jobid`;
				//sql += ` AND jobrole.roleid = ${selectedrole}`;
			}
			sql += ` order by 1, 2 desc`;
			console.log(sql);
			db.query(sql, function (err, resultJobrole) {
				if (err) throw err;
				console.log(resultJobrole);

				sql = `SELECT * FROM education WHERE userid="${userid}" `;
				console.log(sql);
				db.query(sql, function (err, resultEducation) {
					if (err) throw err;
					console.log(resultEducation);

					sql = `SELECT * FROM certification WHERE userid="${userid}" `;
					console.log(sql);
					db.query(sql, function (err, resultCertification) {
						if (err) throw err;
						console.log(resultCertification);

						sql = `SELECT distinct skill FROM jobskill WHERE userid="${userid}" `;
						console.log(sql);
						db.query(sql, function (err, resultSkill) {
							if (err) throw err;
							console.log(resultSkill);

							sql = `SELECT rolename FROM role WHERE roleid="${selectedrole}" `;
							console.log(sql);
							db.query(sql, function (err, resultRole) {
								if (err) throw err;
								console.log(resultRole);
								res.render('previewCV', {title: 'Preview CV', personalInfo: resultUser[0],
																															joblist: resultJob,
																															jobrolelist: resultJobrole,
																															educationlist: resultEducation,
																															certificationlist: resultCertification,
																															skilllist: resultSkill,
																															selectedrole: resultRole[0].rolename});
							});
						});

						//res.render('previewCV', {title: 'Preview CV', personalInfo: resultUser, joblist: resultJob, jobrolelist: resultJobrole, educationlist: resultEducation, certificationlist: resultCertification, selectedrole: selectedrole});
					});

					//res.render('viewCareer', {title: 'View Career', rolelist: resultRole, joblist: resultJob, jobrolelist: resultJobrole, educationlist: resultEducation});
				});

				//res.render('viewCareer', {title: 'View Career', rolelist: resultRole, joblist: resultJob, jobrolelist: resultJobrole});
			});
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

app.post('/mapRole', function(req, res, next) {
	var userid = req.body.userid;
	var roleid = req.body.role;
	var rolejoblist = req.body.jobrole;
	var sql = "";

	console.log("selected role.... " + roleid);
	console.log("selected role's job.... " + rolejoblist);
	console.log("typeof role's job.... " + typeof rolejoblist);
	console.log(rolejoblist);

	var rolejobArray = [];

	if(typeof rolejoblist == "object") { //if checked is two or more
		rolejoblist.forEach(function(jobid) {
			rolejobArray.push(Number(jobid));
		});
	} else {
		if(typeof rolejoblist == "string") { //if checked is one
			rolejobArray.push(Number(rolejoblist));
		}
	}

	//console.log(rolejobArray);

/*
	var temp = "1,2,3,";
	var testArray = temp.split(",");
	console.log(testArray.length);
	testArray = testArray.slice(0, -1);
	console.log(testArray.length);
	console.log(testArray);
*/

	sql = `SELECT jobrole.jobid FROM jobrole inner join job on jobrole.jobid = job.jobid and job.userid="${userid}" and jobrole.roleid = ${roleid}`;

	console.log(sql);
	db.query(sql, function(err, result) {
		if (err) throw err;

		var resultjobArray = [];
		for(var i=0; i<result.length; i++) {
			console.log(result[i].jobid + "----------");
			resultjobArray.push(result[i].jobid);

			//if result value doesn't exist in rolejobArray, it means user wants to delete relation job & role
			if(!rolejobArray.includes(result[i].jobid)) {
				sql = `DELETE FROM jobrole WHERE jobid = ${result[i].jobid} AND roleid = ${roleid} `;
				console.log(sql);
				db.query(sql, function(err2, result2) {
					if (err2) throw err2;
					console.log("Delete is successful");
				});
			}
		}

		for(var j=0; j<rolejobArray.length; j++) {
			console.log(rolejobArray[j] + "----------");

			//if result value doesn't exist in rolejobArray, it means user wants to add relation job & role
			if(!resultjobArray.includes(rolejobArray[j])) {
				sql = `INSERT INTO jobrole (jobid, roleid, ismain) VALUES (${rolejobArray[j]}, ${roleid}, 0)`;
				console.log(sql);
				db.query(sql, function(err2, result2) {
					if (err2) throw err2;
					console.log("Insert is successful");
				});
			}
		}

		res.render('home');
	});
});

app.post('/viewCareer', function(req, res, next) {
	var userid = req.body.userid;
	var roleid = req.body.role;
	var formname = req.body.formname;
	var buttonname = req.body.submit;

	console.log(userid + " : " + roleid + " : " + formname + " : " + buttonname);

	if(formname == "searchForm") {
		if(buttonname == "search") {
			res.redirect('/viewCareer?roleid=' + roleid);
		} else if (buttonname == "preview") {
			res.redirect('/previewCV?roleid=' + roleid);
		}
	}
	/*

	var rolejoblist = req.body.jobrole;
	var sql = "";

	console.log("selected role.... " + roleid);
	console.log("selected role's job.... " + rolejoblist);
	console.log("typeof role's job.... " + typeof rolejoblist);
	console.log(rolejoblist);

	var rolejobArray = [];

	if(typeof rolejoblist == "object") { //if checked is two or more
		rolejoblist.forEach(function(jobid) {
			rolejobArray.push(Number(jobid));
		});
	} else {
		if(typeof rolejoblist == "string") { //if checked is one
			rolejobArray.push(Number(rolejoblist));
		}
	}
*/
	//console.log(rolejobArray);

/*
	var temp = "1,2,3,";
	var testArray = temp.split(",");
	console.log(testArray.length);
	testArray = testArray.slice(0, -1);
	console.log(testArray.length);
	console.log(testArray);
*/
/*
	sql = `SELECT jobrole.jobid FROM jobrole inner join job on jobrole.jobid = job.jobid and job.userid="${userid}" and jobrole.roleid = ${roleid}`;

	console.log(sql);
	db.query(sql, function(err, result) {
		if (err) throw err;

		var resultjobArray = [];
		for(var i=0; i<result.length; i++) {
			console.log(result[i].jobid + "----------");
			resultjobArray.push(result[i].jobid);

			//if result value doesn't exist in rolejobArray, it means user wants to delete relation job & role
			if(!rolejobArray.includes(result[i].jobid)) {
				sql = `DELETE FROM jobrole WHERE jobid = ${result[i].jobid} AND roleid = ${roleid} `;
				console.log(sql);
				db.query(sql, function(err2, result2) {
					if (err2) throw err2;
					console.log("Delete is successful");
				});
			}
		}

		for(var j=0; j<rolejobArray.length; j++) {
			console.log(rolejobArray[j] + "----------");

			//if result value doesn't exist in rolejobArray, it means user wants to add relation job & role
			if(!resultjobArray.includes(rolejobArray[j])) {
				sql = `INSERT INTO jobrole (jobid, roleid, ismain) VALUES (${rolejobArray[j]}, ${roleid}, 0)`;
				console.log(sql);
				db.query(sql, function(err2, result2) {
					if (err2) throw err2;
					console.log("Insert is successful");
				});
			}
		}

		res.render('home');
	});
	*/
});

app.listen(5500);
console.log('CV Generator is running on port 5500');
