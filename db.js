var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'P@ssw0rd',
  database: 'assignment'
});

connection.connect();

module.exports = {
    connection
};