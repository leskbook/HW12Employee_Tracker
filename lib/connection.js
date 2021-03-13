const mysql = require('mysql');
var connection ={
    host: "localhost",    
    port: 3306,    
    user: "root",   
    password: "myP@ssword",    
    database: "employee_db"
};
module.exports.db_connect=connection;