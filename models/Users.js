var mysql = require('../core/database');

function Users () {
	
}

Users.prototype.select = function (cb){
	mysql.getConnection(function(connectionerr, connection) {
	
		var result = connection.query('SELECT * from Users', function (err, rows, fields) {
	 		if (err) throw err;
		 
	  		cb(rows);
		});
	});
	 
}

module.exports = new Users();