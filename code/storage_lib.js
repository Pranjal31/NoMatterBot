var chalk = require('chalk');
var mysql = require('mysql');
var lib = require('./lib.js');

//Retrieve mysql server and user credentials
var mysqlServer = lib.config.dbServer;
var dbUserId = lib.config.dbUserId;
var dbUserPwd = lib.config.dbUserPwd;
var db = lib.config.dbName;

//Function to create connection to DB server, returns connection object
function createConnDB()
{
	var conn = mysql.createConnection({
		host: mysqlServer,
		user: dbUserId,
		password: dbUserPwd,
		database: db
	  });

	conn.connect(function(err) {
		if (err) throw err;
		//console.log("Connected!");
	  });

	return conn;
}

//Function to end connection to DB server
function endConnDB(conn)
{
	conn.end(function(err)
  	{
    	if (err) throw err;
    	//console.log("Connection Ended!");
  });
}

//Function to make query to DB and return the results of the query
async function makeQuery(sqlQuery, values)
{
	try
	{
		conn = createConnDB();

		return new Promise(function(resolve, reject) {
			conn.query(sqlQuery, values, (err, results, fields) => {
				endConnDB(conn);
				
				if (err)
				{
					//console.log(chalk.red(err));
					reject(err);
				}
				else
				{
					resolve(results);
				}
			  });
		});
	}
	catch(err)
	{
		throw err;
	}
}

//Function to insert Mattermost username into username table
async function addMMUID(ghUname, mmUname) {
	var sqlQuery = `INSERT INTO userNames (ghUName, mmUname) VALUES (?, ?)`;
	
	try
	{
		var queryResult = await makeQuery(sqlQuery, [ghUname, mmUname]);
		console.log(queryResult);
	}
	catch(err)
	{
		console.log(chalk.red(err));
	}

}

//Function to insert Mattermost username into username table
async function addChannelId(mmUname, channelId) {
	var sqlQuery = `INSERT INTO channelIDs (mmUName, chId) VALUES (?, ?)`;
	
	try
	{
		var queryResult = await makeQuery(sqlQuery, [mmUname, channelId]);
		console.log(queryResult);
	}
	catch(err)
	{
		console.log(chalk.red(err));
	}
}

//Function to insert Mattermost username into username table
async function addSkill(skill) {
	var sqlQuery = `INSERT INTO skills (skillName) VALUES (?)`;
	
	try
	{
		var queryResult = await makeQuery(sqlQuery, skill);
		console.log(queryResult);
	}
	catch(err)
	{
		console.log(chalk.red(err));
	}
}

//Function to insert Mattermost username into username table.
async function addUserSkill(ghUname, skill) {
	var sqlQuery = `INSERT INTO userSkills (ghUName, skill) VALUES (?, ?)`;
	
	try
	{
		var queryResult = await makeQuery(sqlQuery, [ghUname, skill]);
		console.log(queryResult);
	}
	catch(err)
	{
		console.log(chalk.red(err));
	}
}

//Function to get Mattermost username coressponding to a GitHub username
async function getMMUID(ghUname) {
	var sqlQuery = `SELECT U.mmUName FROM userNames U WHERE U.ghUName = ?`;
	
	try
	{
		var queryResult = await makeQuery(sqlQuery, ghUname);
		if(queryResult.length == 0)
		{
			throw `DataBaseError: No Entry found for ${ghUname}!`;
		}
		
		console.log(queryResult[0].mmUName);
		return queryResult[0].mmUName;
	}
	catch(err)
	{
		console.log(chalk.red(err));
	}
}

//Function to get Mattermost channelId
async function getChannelId(mmUname) {
	var sqlQuery = `SELECT C.chId FROM channelIDs C WHERE C.mmUName = ?`;
	
	try
	{
		var queryResult = await makeQuery(sqlQuery, mmUname);
		if(queryResult.length == 0)
		{
			throw `DataBaseError: No Entry found for ${mmUname}!`;
		}
		
		console.log(queryResult[0].chId);
		return queryResult[0].chId;
	}
	catch(err)
	{
		console.log(chalk.red(err));
	}
}

//Function to get skills corresponding to GitHub user
async function getUserSkills(ghUname) {
	var sqlQuery = `SELECT S.skill FROM userSkills S WHERE S.ghUName = ?`;
	var skills = [];
	try
	{
		var queryResult = await makeQuery(sqlQuery, ghUname);
		//console.log(queryResult[0].skill);
		if(queryResult.length == 0)
		{
			throw `DataBaseError: No Entry found for ${ghUname}!`;
		}

		for(i = 0; i < queryResult.length; i++)
		{
			skills.push(queryResult[i].skill);
		}

		console.log(skills);
		return skills;
	}
	catch(err)
	{
		console.log(chalk.red(err));
	}
}

//Function to update Mattermost username
async function updatemmUID(ghUName, newmmUName) {
	var sqlQuery = `UPDATE userNames Set mmUName = ? WHERE ghUName = ?`;
	
	try
	{
		var queryResult = await makeQuery(sqlQuery, [newmmUName, ghUName]);
		console.log(queryResult);
	}
	catch(err)
	{
		console.log(chalk.red(err));
	}
}

//Function to update channelID corresponding to a Mattermost user
async function updateChId(mmUName, newChId) {
	var sqlQuery = `UPDATE channelIDs Set chId = ? WHERE mmUName = ?`;
	
	try
	{
		var queryResult = await makeQuery(sqlQuery, [newChId, mmUName]);
		console.log(queryResult);
	}
	catch(err)
	{
		console.log(chalk.red(err));
	}
}

//Function to delete GitHub user from Database
async function removeghUName(ghUname) {
	var sqlQuery = `DELETE FROM userNames WHERE ghUName = ?`;
	
	try
	{
		var queryResult = await makeQuery(sqlQuery, ghUname);
		console.log(queryResult);
	}
	catch(err)
	{
		console.log(chalk.red(err));
	}
}

//Function to delete Mattermost username from Database
async function removemmUName(mmUname) {
	var sqlQuery = `DELETE FROM channelIDs WHERE mmUName = ?`;
	
	try
	{
		var queryResult = await makeQuery(sqlQuery, mmUname);
		console.log(queryResult);
	}
	catch(err)
	{
		console.log(chalk.red(err));
	}
}

//Function to delete a skill from Database
async function removeSkill(skill) {
	var sqlQuery = `DELETE FROM skills WHERE skillName = ?`;
	
	try
	{
		var queryResult = await makeQuery(sqlQuery, skill);
		console.log(queryResult);
	}
	catch(err)
	{
		console.log(chalk.red(err));
	}
}

//Function to delete a user's skill from Database
async function removeUserSkill(ghUname, skill) {
	var sqlQuery = `DELETE FROM userSkills WHERE ghUName = ? AND skill = ?`;
	
	try
	{
		var queryResult = await makeQuery(sqlQuery, [ghUname, skill]);
		console.log(queryResult);
	}
	catch(err)
	{
		console.log(chalk.red(err));
	}
}

module.exports.addMMUID = addMMUID;
module.exports.addChannelId = addChannelId;
module.exports.addSkill = addSkill;
module.exports.addUserSkill = addUserSkill;
module.exports.getMMUID = getMMUID;
module.exports.getChannelId = getChannelId;
module.exports.getUserSkills = getUserSkills;
module.exports.updatemmUID = updatemmUID;
//module.exports.updateChId = updateChId;
module.exports.removeghUName = removeghUName;
//module.exports.removemmUName = removemmUName;
module.exports.removeSkill = removeSkill;
module.exports.removeUserSkill = removeUserSkill;