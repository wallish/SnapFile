var mysql = require('../core/database')


function Folders () {


	
}

Folders.prototype.select = function (){
	mysql().connect();
	 
	mysql().query('SELECT * from Folders', function(err, rows, fields) {
	  if (err) throw err;
	 
	  console.log(rows);
	});
	 
	mysql().end();
}

Folders.prototype.insert = function (data){
	mysql().connect();
	 
	mysql().query("INSERT INTO Folders (name, user, icon, dateinsert) VALUES ("+data.name+","+data.user+","+data.icon+","+data.dateinsert+")", function(err, rows, fields) {
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

