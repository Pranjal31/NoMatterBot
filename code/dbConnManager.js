var mysql = require('mysql');

var dbConfig = {}

//Read DB related environment variables
dbConfig.dbServer = process.env.DBSERVERURL;
dbConfig.dbUserId = process.env.DBUSER;
dbConfig.dbUserPwd = process.env.DBUSERPWD;
dbConfig.dbName = process.env.DBNAME;
dbConfig.dbConnLimit = parseInt(process.env.DBCONNLIMIT);

if( !dbConfig.dbServer || !dbConfig.dbUserId || !dbConfig.dbUserPwd || !dbConfig.dbName || 
	!dbConfig.dbConnLimit)
{
	console.log(`Please set your environment variables with appropriate values.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}

var dbConnPool  = mysql.createPool({
  connectionLimit : dbConfig.dbConnLimit,
  host            : dbConfig.dbServer,
  user            : dbConfig.dbUserId,
  password        : dbConfig.dbUserPwd,
  database        : dbConfig.dbName
});


function endDBConn()
{
    dbConnPool.end(function (err) {
        if(err) console.log(err);
        // all connections in the pool have ended
      });
}

module.exports.dbConnPool = dbConnPool;
module.exports.endDBConn = endDBConn;

