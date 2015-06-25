var mysql = require('../core/database');

function Users () {
	
}

Users.prototype.select = function (cb){
	mysql().connect(); 
	
	var result = mysql().query('SELECT * from Users', function (err, rows, fields) {
 		if (err) throw err;
	 
  		cb(rows);
	});
	 
	mysql().end();

	return result;
}

module.exports = new Users();