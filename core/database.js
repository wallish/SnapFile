var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'nodejs'
});



function select(){
	connection.connect();
	 
	connection.query('SELECT * from Files', function(err, rows, fields) {
	  if (err) throw err;
	 
	  console.log(rows);
	});
	 
	connection.end();
}

function insert(data){
	connection.connect();
	 
	connection.query("INSERT INTO Files (uri, originalName, creator, type) VALUES ("+data.uri+","+data.originalName+","+data.creator+","+data.type+")", function(err, rows, fields) {
	  if (err) throw err;
	 
	  console.log(rows);
	});
	 
	connection.end();
}

function delete(id){
	connection.connect();
	 
	connection.query("DELETE FROM Files where id="+id, function(err, rows, fields) {
	  if (err) throw err;
	 
	  console.log(rows);
	});
	 
	connection.end();
}