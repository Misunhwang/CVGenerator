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
	var sql = `SELECT * FROM role ORDER BY rolename`;
	console.log(sql);
	db.query(sql, function (err, result) {
		if (err) throw err;
		console.log(result);
		res.render('addCareer', {title: 'Add Career', rolelist: result});
	});
});

app.get('/mapRole', function(req, res, next) {
	var sql = `SELECT * FROM role ORDER BY rolename`;
	console.log(sql);
	db.query(sql, function (err, resultRole) {
		if (err) throw err;

		sql = `SELECT job.*, jobrole.roleid, role.rolename FROM job ` +
					`INNER JOIN jobrole ON job.jobid=jobrole.jobid and jobrole.ismain=1 and job.userid="${userid}" ` +
					`INNER JOIN role ON jobrole.roleid = role.roleid ` +
					`ORDER BY job.startyear desc, job.startmonth desc`;
		console.log(sql);
		db.query(sql, function (err, resultJob) {
			if (err) throw err;

			sql = `SELECT jobrole.jobid, jobrole.ismain, jobrole.roleid, role.rolename ` +
						`FROM jobrole inner join job on jobrole.jobid = job.jobid and job.userid="${userid}" ` +
						`inner join role WHERE jobrole.roleid = role.roleid order by 1, 2 desc;`;
			console.log(sql);
			db.query(sql, function (err, resultJobrole) {
				if (err) throw err;

				res.render('mapRole', {title: 'Map Role to Career', rolelist: resultRole, joblist: resultJob, jobrolelist: resultJobrole});
			});
		});
	});
});

app.get('/viewCareer', function(req, res, next) {
	var selectedrole = req.query.roleid;

	if(typeof selectedrole == "string") {
		selectedrole = Number(selectedrole);
	} else {
		selectedrole = 0;
	}

	var sql = `SELECT * FROM role ORDER BY rolename`;
	console.log(sql);
	db.query(sql, function (err, resultRole) {
		if (err) throw err;

		sql = `SELECT job.*, jobrole.roleid, role.rolename FROM job ` +
					`INNER JOIN jobrole ON job.jobid=jobrole.jobid and jobrole.ismain=1 and job.userid="${userid}" ` +
					`INNER JOIN role ON jobrole.roleid = role.roleid `;
		if(selectedrole > 0) {
			sql += `INNER JOIN (SELECT DISTINCT JOBID FROM JOBROLE WHERE roleid=${selectedrole}) distjob on job.jobid = distjob.jobid `;
		}
		sql += `ORDER BY job.startyear desc, job.startmonth desc`;
		console.log(sql);
		db.query(sql, function (err, resultJob) {
			if (err) throw err;

 			sql = `SELECT jobrole.jobid, jobrole.ismain, jobrole.roleid, role.rolename ` +
						`FROM jobrole inner join job on jobrole.jobid = job.jobid and job.userid="${userid}" ` +
						`inner join role ON jobrole.roleid = role.roleid`;
			if(selectedrole > 0) {
				sql += ` INNER JOIN (SELECT DISTINCT JOBID FROM JOBROLE WHERE roleid=${selectedrole}) distjob on job.jobid = distjob.jobid`;
			}
			sql += ` order by 1, 2 desc`;
			console.log(sql);
			db.query(sql, function (err, resultJobrole) {
				if (err) throw err;

				sql = `SELECT * FROM education WHERE userid="${userid}" ` +
							`ORDER BY startyear desc, startmonth desc`;
				console.log(sql);
				db.query(sql, function (err, resultEducation) {
					if (err) throw err;

					sql = `SELECT * FROM certification WHERE userid="${userid}" ` +
								`ORDER BY issueyear desc, issuemonth desc`;
					console.log(sql);
					db.query(sql, function (err, resultCertification) {
						if (err) throw err;

						res.render('viewCareer', {title: 'View Career', rolelist: resultRole, joblist: resultJob, jobrolelist: resultJobrole, educationlist: resultEducation, certificationlist: resultCertification, selectedrole: selectedrole});
					});
				});
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
					`INNER JOIN role ON jobrole.roleid = role.roleid `;
		if(selectedrole > 0) {
			sql += `INNER JOIN (SELECT DISTINCT JOBID FROM JOBROLE WHERE roleid=${selectedrole}) distjob on job.jobid = distjob.jobid `;
			//sql += ` AND jobrole.roleid = ${selectedrole}`;
		}
		sql += `ORDER BY job.startyear desc, job.startmonth desc`;
		console.log(sql);
		db.query(sql, function (err, resultJob) {
			if (err) throw err;
			console.log(resultJob);

 			sql = `SELECT jobrole.jobid, jobrole.ismain, jobrole.roleid, role.rolename ` +
						`FROM jobrole inner join job on jobrole.jobid = job.jobid and job.userid="${userid}" ` +
						`inner join role ON jobrole.roleid = role.roleid`;
			if(selectedrole > 0) {
				sql += ` INNER JOIN (SELECT DISTINCT JOBID FROM JOBROLE WHERE roleid=${selectedrole}) distjob on job.jobid = distjob.jobid`;
			}
			sql += ` order by 1, 2 desc`;
			console.log(sql);
			db.query(sql, function (err, resultJobrole) {
				if (err) throw err;
				console.log(resultJobrole);

				sql = `SELECT * FROM education WHERE userid="${userid}" ` +
							`ORDER BY startyear desc, startmonth desc`;
				console.log(sql);
				db.query(sql, function (err, resultEducation) {
					if (err) throw err;

					sql = `SELECT * FROM certification WHERE userid="${userid}" `;
								`ORDER BY issueyear desc, issuemonth desc`;
					console.log(sql);
					db.query(sql, function (err, resultCertification) {
						if (err) throw err;

						sql = `SELECT distinct skill FROM jobskill WHERE userid="${userid}" `;
						console.log(sql);
						db.query(sql, function (err, resultSkill) {
							if (err) throw err;

							if(selectedrole > 0) {
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
							} else {
								res.render('previewCV', {title: 'Preview CV', personalInfo: resultUser[0],
																															joblist: resultJob,
																															jobrolelist: resultJobrole,
																															educationlist: resultEducation,
																															certificationlist: resultCertification,
																															skilllist: resultSkill,
																															selectedrole: ""});
							}
						});
					});
				});
			});
		});
	});
});

app.get('/editCareer', function(req, res, next) {
	var selectedjob = Number(req.query.jobid);

	var sql = `SELECT * FROM role ORDER BY rolename`;
	console.log(sql);
	db.query(sql, function (err, resultRole) {
		if (err) throw err;

		sql = `SELECT job.*, jobrole.roleid FROM job ` +
					`INNER JOIN jobrole ON job.jobid=jobrole.jobid and jobrole.ismain=1 and job.jobid=${selectedjob} `;
		console.log(sql);
		db.query(sql, function (err, resultJob) {
			if (err) throw err;

 			sql = `SELECT roleid FROM jobrole WHERE ismain=0 and jobid=${selectedjob} `;
			console.log(sql);
			db.query(sql, function (err, resultSubrole) {
				if (err) throw err;

				res.render('editCareer', {title: 'Edit Career', rolelist: resultRole, jobInfo: resultJob[0], subrolelist: resultSubrole});
			});
		});
	});
});

app.get('/editEducation', function(req, res, next) {
	var selectedEdu = Number(req.query.educationid);

	var sql = `SELECT * FROM education WHERE educationid=${selectedEdu}`;
	console.log(sql);
	db.query(sql, function (err, result) {
		if (err) throw err;
		res.render('editEducation', {title: 'Edit Education', educationInfo: result[0]});
	});
});

app.get('/editCertification', function(req, res, next) {
	var selectedCert = Number(req.query.certificationid);

	var sql = `SELECT * FROM certification WHERE certificationid=${selectedCert}`;
	console.log(sql);
	db.query(sql, function (err, result) {
		if (err) throw err;
		res.render('editCertification', {title: 'Edit Certification', certificationInfo: result[0]});
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

app.post('/editCertification', function(req, res, next) {
	var userid = req.body.userid;
	var certificationid = req.body.certificationid;
	var certificationname = req.body.certification;
  var organization = req.body.organization;
  var issueYear = req.body.issueYear;
	var issueMonth = req.body.issueMonth;
	var description = req.body.description;

	var sql = `UPDATE certification SET certificationname="${certificationname}", organization="${organization}", ` +
						`issueYear="${issueYear}", issueMonth="${issueMonth}", description="${description}" ` +
						`WHERE certificationid=${certificationid}`;
	console.log(sql);
	db.query(sql, function(err, result) {
		if (err) throw err;
		console.log('record Updated');
		res.redirect('/viewCareer');
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

app.post('/editEducation', function(req, res, next) {
	var userid = req.body.userid;
	var educationid = req.body.educationid;
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
		sql = `UPDATE education SET schoolname="${schoolname}", country="${country}", ` +
					`coursename="${coursename}", degree="${degree}", ` +
					`startYear="${startYear}", startMonth="${startMonth}", special="${special}" ` +
					`WHERE educationid=${educationid}`;
	} else {
		var endYear = req.body.endYear;
		var endMonth = req.body.endMonth;
		var grade = req.body.grade;

		sql = `UPDATE education SET schoolname="${schoolname}", country="${country}", ` +
					`coursename="${coursename}", degree="${degree}", ` +
					`startYear="${startYear}", startMonth="${startMonth}", special="${special}", ` +
					`endYear="${endYear}", endMonth="${endMonth}", grade="${grade}" ` +
					`WHERE educationid=${educationid}`;
	}
	console.log(sql);
	db.query(sql, function(err, result) {
		if (err) throw err;
		console.log('record Updated');
		res.redirect('/viewCareer');
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
		res.render('home');
	});
});

app.post('/editCareer', function(req, res, next) {
	var userid = req.body.userid;
	var jobid = req.body.jobid;
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

	//1. Update career information into 'job' table
	console.log("1. Update career information into 'job' table...............");
	if(notFinish == "on") {
		sql = `UPDATE job SET employmenttype="${emptype}", companyname="${companyname}", country="${country}", ` +
					`startYear="${startYear}", startMonth="${startMonth}", ` +
					`description="${description}", detail1="${detail1}", ` +
					`detail2="${detail2}" , detail3="${detail3}", skills="${skills}" ` +
					`WHERE jobid=${jobid}`;
	} else {
		var endYear = req.body.endYear;
		var endMonth = req.body.endMonth;

		sql = `UPDATE job SET employmenttype="${emptype}", companyname="${companyname}", country="${country}", ` +
					`startYear="${startYear}", startMonth="${startMonth}", ` +
					`endYear="${endYear}", endMonth="${endMonth}", ` +
					`description="${description}", detail1="${detail1}", ` +
					`detail2="${detail2}" , detail3="${detail3}", skills="${skills}" ` +
					`WHERE jobid=${jobid}`;
	}
	console.log(sql);

	db.query(sql, function(err, result) {
		if (err) throw err;
		console.log('job record updated');
	});

	//2. Insert multi skills into 'jobskill' table. It will use user's Skill summary

	sql = `DELETE FROM jobskill WHERE jobid=${jobid}`;

	console.log(sql);
	db.query(sql, function(err, result) {
		if (err) throw err;
		console.log("jobskill delete succeed");
	});

	console.log("skills : " + skills);
	var skillarray = skills.split(","); //split each skills

	for(var i=0; i<skillarray.length; i++) { //remove whitespace
		skillarray[i] = skillarray[i].trim();
	}

	var uniqueSkillarray = [ ...new Set(skillarray)]; //remove duplicate skill

	for(var j=0; j<uniqueSkillarray.length; j++) {
		console.log("for skill : " + uniqueSkillarray[j]);

		sql = `INSERT INTO jobskill (jobid, skill, userid)
					 VALUES (${jobid}, "${uniqueSkillarray[j]}", "${userid}")`;
		console.log(sql);
		db.query(sql, function(err, result) {
			if (err) throw err;
			console.log('jobskill record inserted');
		});
	}

	//3. Insert multi roles information into 'jobrole' table

	console.log("3. Update multi roles information into 'jobrole' table...............");

	sql = `DELETE FROM jobrole WHERE jobid=${jobid}`;

	console.log(sql);
	db.query(sql, function(err, result) {
		if (err) throw err;
		console.log("jobrole delete succeed");
	});

	var roleMap = [
		{roleid: mainrole, ismain: true},
		{roleid: subrole1, ismain: false},
		{roleid: subrole2, ismain: false},
		{roleid: subrole3, ismain: false}
	];

	var tempRole = [];
	roleMap.forEach(function(role) {
		console.log("each role for inserted jobid......" + jobid);
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

		sql = `SELECT * FROM jobrole WHERE jobid = ${jobid} and  roleid = ${role.roleid}`;
		console.log(sql);
	  db.query(sql, function(err, result) {
	    if(err) throw err;

			if(result.length == 0) {
				sql = `INSERT INTO jobrole (jobid, roleid, ismain)
							 VALUES (${jobid}, ${role.roleid}, ${role.ismain})`;
				console.log(sql);
				db.query(sql, function(err, result) {
					if (err) throw err;
					console.log('jobrole record inserted');
				});
			}
		});
	});

	res.redirect('/viewCareer');
});

app.post('/deleteCareer', function(req, res, next) {
	var userid = req.body.userid;
	var jobid = req.body.jobid;
	var sql = "";

	//1. Delete jobrole
	sql = `DELETE FROM jobrole WHERE jobid=${jobid}`;

	console.log(sql);
	res.redirect('/viewCareer');
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
	var jobid = req.body.jobid;
	var educationid = req.body.educationid;
	var certificationid = req.body.certificationid;
	var formname = req.body.formname;
	var buttonname = req.body.submit;

	console.log(userid + " : " + roleid + " : " + formname + " : " + buttonname + " : " + jobid + " : " + educationid + " : " + certificationid);

	if(formname == "searchForm") {
		if(buttonname == "search") {
			console.log("redirect viewCareer()");
			res.redirect('/viewCareer?roleid=' + roleid);
		} else if (buttonname == "preview") {
			console.log("redirect previewCV()");
			res.redirect('/previewCV?roleid=' + roleid);
		}
	} else if(formname == "careerForm") {
		if(buttonname == "editWork") {
			console.log("redirect editCareer()");
			res.redirect('/editCareer?jobid=' + jobid);
		} else if (buttonname == "deleteWork") {
			console.log("execute deleteCareer...");

			//1. Delete jobrole
			sql = `DELETE FROM jobrole WHERE jobid=${jobid}`;
			console.log(sql);
			db.query(sql, function(err, result) {
				if (err) throw err;
				console.log("jobrole delete succeed");
			});

			//2. Delete jobskill
			sql = `DELETE FROM jobskill WHERE jobid=${jobid}`;
			console.log(sql);
			db.query(sql, function(err, result) {
				if (err) throw err;
				console.log("jobskill delete succeed");
			});

			//3. Delete job
			sql = `DELETE FROM job WHERE jobid=${jobid}`;
			console.log(sql);
			db.query(sql, function(err, result) {
				if (err) throw err;
				console.log("job delete succeed");
			});

			res.redirect('/viewCareer');
		}
	} else if(formname == "educationForm") {
		if(buttonname == "editEducation") {
			console.log("redirect editEducation()");
			res.redirect('/editEducation?educationid=' + educationid);
		} else if (buttonname == "deleteEducation") {
			console.log("execute deleteEducation...");

			//Delete education
			sql = `DELETE FROM education WHERE educationid=${educationid}`;
			console.log(sql);
			db.query(sql, function(err, result) {
				if (err) throw err;
				console.log("education delete succeed");
			});

			res.redirect('/viewCareer');
		}
	} else if(formname == "certificationForm") {
		if(buttonname == "editCertification") {
			console.log("redirect editCertification()");
			res.redirect('/editCertification?certificationid=' + certificationid);
		} else if (buttonname == "deleteCertification") {
			console.log("execute deleteCertification...");

			//Delete certification
			sql = `DELETE FROM certification WHERE certificationid=${certificationid}`;
			console.log(sql);
			db.query(sql, function(err, result) {
				if (err) throw err;
				console.log("certification delete succeed");
			});

			res.redirect('/viewCareer');
		}
	}
});

app.listen(5500);
console.log('CV Generator is running on port 5500');
