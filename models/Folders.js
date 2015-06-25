var mysql = require('../core/database')


function Folders () {


	
}

Folders.prototype.select = function (cb){
	mysql().connect(); 
	
	var result = mysql().query('SELECT * from Folders', function (err, rows, fields) {
 		if (err) throw err;
	 
  		//console.log(rows);
  		cb(rows);
	});
	 
	mysql().end();

	return result;
}

Folders.prototype.insert = function (data){
	mysql().connect();
	 
	mysql().query("INSERT INTO Folders (name, creator, icon, dateinsert) VALUES ("+data.name+","+data.creator+","+data.icon+","+Date.now()+")", function(err, rows, fields) {
		if (err) throw err;

	  	console.log(rows);
	});
	 
	mysql().end();
}

Folders.prototype.delete = function (id){
	mysql().connect();
	 
	mysql().query("DELETE FROM Folders where id="+id, function(err, rows, fields) {
	  if (err) throw err;
	 
	  console.log(rows);
	});
	 
	mysql().end();
}

module.exports = new Folders();

