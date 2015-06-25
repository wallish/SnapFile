var mysql = require('../core/database');
var moment = require('moment');


function Files () {

}

Files.prototype.select = function (folder, cb){
	mysql().connect();
	 
	mysql().query('SELECT fi.id, fi.idFolder, fi.originalName, fi.creator, fi.type, fi.idFolder, fi.downloadCount, fi.dateinsert, fi.expire from Files fi LEFT JOIN Folders fo ON fi.idFolder=fo.id WHERE fo.name="'+folder+'" AND fi.deleted=0', function (err, rows, fields) {
	  	if (err) throw err;
	 	console.log(rows);
	  	cb(rows)
	});
	 
	mysql().end();
}

Files.prototype.insert = function(data){
	mysql().connect();
	 
	mysql().query("INSERT INTO Files (originalName, creator, type, downloadcount, expire, dateinsert, idFolder) VALUES ('"+data.originalName+"','"+data.creator+"','"+data.type+"','"+data.downloadcount+"','"+data.expire+"','"+moment().format('YYYY-MM-DD HH:mm:ss')+"', (SELECT id FROM Folders where name='"+data.folder+"'))", function(err, rows, fields) {
	  if (err) throw err;
	 
	  console.log(rows);
	});
	 
	mysql().end();
}

Files.prototype.update = function(id, data){
	mysql().connect();
	 
	mysql().query("UPDATE Files SET deleted=1 where id="+id, function(err, rows, fields) {
	  if (err) throw err;
	 
	  console.log(rows);
	});
	 
	mysql().end();
}

module.exports = new Files();
