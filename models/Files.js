var mysql = require('../core/database')


function Files () {

}

Files.prototype.select = function (folder, cb){
	mysql().connect();
	 
	mysql().query('SELECT * from Files WHERE idFolder='+folder, function (err, rows, fields) {
	  if (err) throw err;
	 
	  cb(rows)
	});
	 
	mysql().end();
}

Files.prototype.insert = function(data){
	mysql().connect();
	 
	mysql().query("INSERT INTO Files (uri, originalName, creator, type, downloadcount, expire) VALUES ("+data.uri+","+data.originalName+","+data.creator+","+data.type+","+data.downloadcount+","+data.expire+")", function(err, rows, fields) {
	  if (err) throw err;
	 
	  console.log(rows);
	});
	 
	mysql().end();
}

Files.prototype.delete = function(id){
	mysql().connect();
	 
	mysql().query("DELETE FROM Files where id="+id, function(err, rows, fields) {
	  if (err) throw err;
	 
	  console.log(rows);
	});
	 
	mysql().end();
}

module.exports = new Files();
