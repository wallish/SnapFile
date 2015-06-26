var mysql = require('../core/database')
var moment = require('moment');

function Folders () {


	
}

Folders.prototype.select = function (whereclause,cb){
	mysql.getConnection(function(connectionerr, connection) {
		if(connectionerr) throw connectionerr;
		var query = '';
		switch(whereclause){
			case "all":
				query='SELECT fo.name, fo.creator, count(fi.id) as files, sum(fi.downloadCount) as downloads from Folders fo LEFT JOIN Files fi ON fo.id=fi.idFolder where fo.deleted=0 GROUP BY fo.id';
				break;
			case "todelete":
				query='SELECT name, icon FROM Folders where UNIX_TIMESTAMP(dateinsert)+expire <= UNIX_TIMESTAMP(NOW()) AND deleted=0';
				break;
			default:
				query='SELECT fo.id, fo.name, fo.creator, sum(fi.downloadCount) as downloads from Folders fo LEFT JOIN Files fi ON fo.id=fi.idFolder where '+whereclause+' AND fo.deleted=0 GROUP BY fo.id';
		}
		//console.log(query);
		var result = connection.query(query, function (err, rows, fields) {
	 		if (err) throw err;
	 		connection.release();
	  		cb(rows);
		});

	});
}

Folders.prototype.insert = function (datas){
	mysql.getConnection(function(connectionerr, connection) {
		var fields = [];
		var values = [];
		for( data in datas ) {
			fields.push(data);
			values.push(datas[data]);
		}
		var query ="INSERT INTO Folders ("+fields.join()+",dateinsert) VALUES ('"+values.join("','")+"','"+moment().format('YYYY-MM-DD HH:mm:ss')+"')";
		console.log(query);
		connection.query(query, function(err, rows, fields) {
			if (err) throw err;
			connection.release();
		  	console.log(rows);
		});
		 
		//mysql().end();
	});
}

Folders.prototype.delete = function (name){
	mysql.getConnection(function(connectionerr, connection) {
	 
		connection.query("UPDATE Folders SET deleted=1 where name='"+name+"' AND deleted=0", function(err, rows, fields) {
	 		if (err) throw err;
		 	connection.release();
			console.log(rows);
		});
	});
}

module.exports = new Folders();

