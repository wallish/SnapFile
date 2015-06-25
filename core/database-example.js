var mysql      = require('mysql');

var connection = function(){
return mysql.createConnection({
  host     : '',
  user     : '',
  password : '',
  database : ''
})};

module.exports = connection;