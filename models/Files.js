var mysql = require('../core/database');
var moment = require('moment');


function Files () {

}

Files.prototype.select = function (folder, cb){

	mysql.getConnection(function(connectionerr, connection) {
		connection.query('SELECT fi.id, fi.idFolder, fi.originalName, fi.creator, fi.type, fi.downloadCount, DATE_FORMAT(fi.dateinsert, \'%d-%m-%Y %H:%i:%s\') as dateinsert, fi.expire from Files fi LEFT JOIN Folders fo ON fi.idFolder=fo.id WHERE fo.name="'+folder+'" AND fi.deleted=0 AND fo.deleted=0', function (err, rows, fields) {
		  	if (err) throw err;
		 	//console.log(rows);
	 		cb(rows);
			connection.release();	
		});
	});
}

Files.prototype.insert = function(data){
	mysql.getConnection(function(connectionerr, connection) {
	 
		connection.query("INSERT INTO Files (originalName, creator, type, downloadcount, expire, dateinsert, idFolder) VALUES ('"+data.originalName+"','"+data.creator+"','"+data.type+"','"+data.downloadcount+"','"+data.expire+"','"+moment().format('YYYY-MM-DD HH:mm:ss')+"', (SELECT id FROM Folders where name='"+data.folder+"' AND deleted=0))", function(err, rows, fields) {
			if (err) throw err;
		 	connection.release();
			//console.log(rows);
		});
	});
}

Files.prototype.update = function(name, field){
	mysql.getConnection(function(connectionerr, connection) {
	 
		connection.query("UPDATE Files SET "+field+" where originalName='"+name+"' AND deleted=0", function(err, rows, fields) {
	  		if (err) throw err;
		 	connection.release();
	  		//console.log(rows);
		});
	});
}

module.exports = new Files();
