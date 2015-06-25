var mysql = require('../core/database')
var moment = require('moment');

function Folders () {


	
}

Folders.prototype.select = function (cb){
	mysql().connect(); 
	
	var result = mysql().query('SELECT * from Folders where deleted=0', function (err, rows, fields) {
 		if (err) throw err;
	 
  		cb(rows);
	});
	 
	mysql().end();

	return result;
}

Folders.prototype.insert = function (data){
	mysql().connect();
	 
	mysql().query("INSERT INTO Folders (name, creator, icon, dateinsert) VALUES ('"+data.name+"','"+data.creator+"','"+data.icon+"','"+moment().format('YYYY-MM-DD HH:mm:ss')+"')", function(err, rows, fields) {
		if (err) throw err;

	  	console.log(rows);
	});
	 
	mysql().end();
}

Folders.prototype.delete = function (name){
	mysql().connect();
	 
	mysql().query("UPDATE Folders SET deleted=1 where name='"+name+"'", function(err, rows, fields) {
	  if (err) throw err;
	 
	  console.log(rows);
	});
	 
	mysql().end();
}

module.exports = new Folders();

