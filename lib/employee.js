
const inquirer = require('inquirer');
const CreateQuestions = require('../server');
const connect = require('./connection');
const role = require('./role');
const department = require('./department');
const chalk = require('chalk');
const mysql = require('mysql');

//Add Employee

function addEmployee() {
        inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'First Name:'
        },
        {
            name: 'lastName',
            type: 'input',
            message: `Last Name`
        },
        {
            name: 'role',
            type: 'list',
            message: `Select the role?`,
            choices: role.getRole("name")
        }
    ]).then(answers => {           
        let connection = mysql.createConnection(connect.db_connect);        
        const getEmp = "select * from employee";
        connection.query(getEmp, function (err, res) {
            if (res.length) {
                
                inquirer.prompt([
                    {
                        name: 'Manager',
                        type: 'list',
                        message: `Select the Manager?`,
                        choices: manager
                    }]).then(ans => {                            
                        let connection = mysql.createConnection(connect.db_connect);                        
                        const managerId = getManager(ans.Manager);                       
                        const roleId = role.getRole(answers.role);                        
                        const query = "insert into employee(first_name,last_name,role_id,manager_id)values('" + answers.firstName + "','" + answers.lastName + "'," + roleId + "," + managerId + ")";                        
                        connection.query(query, function (err, res) {
                            if (err) throw err;
                            console.log(chalk.green.bold(`====================================================================================`));                            
                            console.log(chalk.yellowBright.black("Successfully added employee"));
                            console.log(chalk.green.bold(`====================================================================================`));

                            allEmployee("role");                            
                            getManager("name");                            
                            CreateQuestions.CreateQuestions();
                        });
                    });
            }
            
            else {                
                console.log(chalk.redBright.black.bold("No manager present"));               
                let connection = mysql.createConnection(connect.db_connect);                
                const managerId = 0;                
                const roleId = role.getRole(answers.role);                
                const query = `SET FOREIGN_KEY_CHECKS = 0 ;`;                
                const quer1 = "insert into employee(first_name,last_name,role_id,manager_id)values('" + answers.firstName + "','" + answers.lastName + "'," + roleId + "," + managerId + ")";                
                connection.query(query, function (err, res) {
                    if (err) throw err;                  
                    connection.query(quer1, function (err, res) {
                        console.log(chalk.green.bold(`====================================================================================`));                            
                        console.log(chalk.bgYellowBright.black("Successfully added employee"));
                        console.log(chalk.green.bold(`====================================================================================`));                                             
                        allEmployee("role");
                        
                        getManager("name");                       
                        CreateQuestions.CreateQuestions();
                    });

                });
            }

        });
    });
} 
let managerValue = [];
let manager = [];

//Get Manager

function getManager(value) {    
    let connection = mysql.createConnection(connect.db_connect);
    
    if (value == "name") {
        let values = [];
        managerValue.length = 0;
        manager.length = 0;        
        const query = `select *
    from employee`;
        
        connection.query(query, function (err, res) {
            if (err) throw err;            
            for (let i = 0; i < res.length; i++) {              
                values.push(res[i].first_name + " " + res[i].last_name);                
                managerValue.push(res[i]);
                manager.push(res[i].first_name + " " + res[i].last_name);
            }

        });
    }
    else {        
        let id = "";
        let split = value.split(" ");        
        managerValue.forEach(element => {
            if (element.first_name == split[0] && element.last_name == split[1]) {
                id = element.id;
            }
        });        
        return id;
    }
}
let employee = [];
let employeeDetails = [];
const allEmployee = (name) => {    
    let connection = mysql.createConnection(connect.db_connect);
    if (name == "role") {        
        const query = "select id ,first_name,last_name from employee";
        employee.length = 0;        
        connection.query(query, function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {                
                employee.push(res[i].first_name + " " + res[i].last_name);
                employeeDetails.push({ id: res[i].id, name: res[i].first_name + " " + res[i].last_name });

            }
        });       
        return employee;
    }
    else {        
        const query = `select e.id as id,e.first_name,e.last_name,r.title,d.name as department,r.salary,m.first_name as Manager_firstname,m.last_name as Manager_lastName
    from employee e inner join role r on e.role_id=r.id 
    inner join department d on r.department_id=d.id
    left join employee m on e.manager_id=m.id
    order by e.id asc`;
        let values = [];        
        connection.query(query, function (err, res) {
            if (err) throw err;
            if (res.length) {               
                for (let i = 0; i < res.length; i++) {
                    values.push({ Id: res[i].id, First_name: res[i].first_name, Last_name: res[i].last_name, Title: res[i].title, Department: res[i].department, Salary: res[i].salary, Manager: res[i].Manager_firstname + " " + res[i].Manager_lastName });
                } 
                console.log(chalk.yellowBright.bold(`====================================================================================`));               
                console.table(values); 
                console.log(chalk.yellowBright.bold(`====================================================================================`));               
                CreateQuestions.CreateQuestions();
            }
            else {
                console.log(chalk.yellowBright.bold(`====================================================================================`));                
                console.log(chalk.yellowBright.black("No record of employee"));  
                console.log(chalk.yellowBright.bold(`====================================================================================`));              
                CreateQuestions.CreateQuestions();
            }
        });
    }    
    connection.end();
}
function updateEmployeeRole() {   
    if (employee.length) {        
        inquirer.prompt([
            {
                name: 'employeeName',
                type: 'list',
                message: `Select employee to update`,
                choices: employee
            },            
            {
                name: 'role',
                type: 'list',
                message: `Select the new role for the employee`,
                choices: role.getRole("name")
            }
        ]).then(answers => {            
            let connection = mysql.createConnection(connect.db_connect);            
            const roleId = role.getRole(answers.role);
            let id = 0;            
            employeeDetails.forEach(element => {
                if (element.name == answers.employeeName) {                   
                    id = element.id;

                }
            });            
            const query = "update employee set role_id=" + roleId + " where id=" + id;            
            connection.query(query, function (err, res) {
                if (err) throw err;
                console.log(chalk.green.bold(`====================================================================================`));
                console.log(chalk.yellowBright.black("Employee successfully updated"));
                console.log(chalk.green.bold(`====================================================================================`));
                connection.end();               
                CreateQuestions.CreateQuestions();
            });
        });
    }    
    else {
        console.log(chalk.green.bold(`====================================================================================`));        
        console.log(chalk.yellowBright.black("No data for employee"));
        console.log(chalk.green.bold(`====================================================================================`));       
        CreateQuestions.CreateQuestions();
    }
}
//view all the employees -- by department
function employeeByDepartment() {
    
    let connection = mysql.createConnection(connect.db_connect);    
    const query = `select e.id as id,e.first_name,e.last_name,d.name as department
    from employee e inner join role r on e.role_id=r.id 
    inner join department d on r.department_id=d.id
    order by e.id asc`;
    
    connection.query(query, function (err, res) {
        if (err) throw err;
        let values = [];       
        for (let i = 0; i < res.length; i++) {
            values.push({ Id: res[i].id, First_name: res[i].first_name, Last_name: res[i].last_name, Department: res[i].department });
        }
        console.log(chalk.yellowBright.bold(`====================================================================================`));        
        console.table(values); 
        console.log(chalk.yellowBright.bold(`====================================================================================`));       
        CreateQuestions.CreateQuestions();
    });    
    connection.end();
}
//View all employees -- by manager
function employeeByManager() {
    
    let connection = mysql.createConnection(connect.db_connect);    
    const query = `select e.id as id,e.first_name,e.last_name,m.first_name as Manager_firstname,m.last_name as Manager_lastName
    from employee m inner join employee e on e.manager_id=m.id`;
    
    connection.query(query, function (err, res) {
        if (err) throw err;
        let values = [];        
        for (let i = 0; i < res.length; i++) {
            values.push({ Id: res[i].id, First_name: res[i].first_name, Last_name: res[i].last_name, Manager: res[i].Manager_firstname + " " + res[i].Manager_lastName });
        }
        console.log(chalk.yellowBright.bold(`====================================================================================`));        
        console.table(values);       
        console.log(chalk.yellowBright.bold(`====================================================================================`));
        CreateQuestions.CreateQuestions();
    });    
    connection.end();
}
//Remove employee

function removeEmployee() {    
    let connection = mysql.createConnection(connect.db_connect);
    
    if (employee.length) {        
        inquirer.prompt([
            {
                name: 'employeeName',
                type: 'list',
                message: `Employee to remove`,
                choices: employee
            },
        ]).then(answers => {            
            let id = 0;
            employeeDetails.forEach(element => {
                if (element.name == answers.employeeName) {                    
                    id = element.id;
                }
            });            
            const query1 = `SET FOREIGN_KEY_CHECKS = 0 ;`            
            const query2 = `delete from employee where id=${id}`;
            
            connection.query(query1, function (err, res) {
                if (err) throw err;
                
                connection.query(query2, function (err, res) {
                    if (err) throw err;                    
                    allEmployee("role");                    
                    getManager("name");
                    console.log(chalk.yellowBright.bold(`====================================================================================`));
                    console.log(chalk.bgGreenBright.black("Successfully deleted employee"));
                    console.log(chalk.yellowBright.bold(`====================================================================================`));                                       
                    CreateQuestions.CreateQuestions();
                });                
                connection.end();
            });
        });
    }    
    else {
        console.log(chalk.yellowBright.bold(`====================================================================================`));
        console.log(chalk.bgGreenBright.black("No employee to deleted"));
        console.log(chalk.yellowBright.bold(`====================================================================================`));        
        CreateQuestions.CreateQuestions();
    }
}
//Update employee manager 

function updateEmployeeManager() {
    
    if (employee.length) {       
        inquirer.prompt([
            {
                name: 'employeeName',
                type: 'list',
                message: `Employee?`,
                choices: employee
            },            
            {
                name: 'Manager',
                type: 'list',
                message: `Manager?`,
                choices: manager
            }
        ]).then(answers => {            
            let connection = mysql.createConnection(connect.db_connect);            
            const managerId = getManager(answers.Manager);
            let id = 0;            
            employeeDetails.forEach(element => {
                if (element.name == answers.employeeName) {
                    id = element.id;
                }
            });            
            const query = "update employee set manager_id=" + managerId + " where id=" + id;            
            connection.query(query, function (err, res) {
                if (err) throw err;
                console.log(chalk.yellowBright.bold(`====================================================================================`));
                console.log(chalk.bgGreenBright.black("Successfully updated employee's manager"));
                console.log(chalk.yellowBright.bold(`====================================================================================`));                        
                allEmployee("role");                
                CreateQuestions.CreateQuestions();                       
                connection.end();
            });
        });
    }
    else { 
        console.log(chalk.yellowBright.bold(`====================================================================================`));
        console.log(chalk.bgGreenBright.black("No employee data"));
        console.log(chalk.yellowBright.bold(`====================================================================================`));
        CreateQuestions.CreateQuestions();
    }
}

allEmployee("role");
getManager("name");

module.exports.allEmployee = allEmployee;
module.exports.addEmployee = addEmployee;
module.exports.updateEmployeeRole = updateEmployeeRole;
module.exports.employeeByDepartment = employeeByDepartment;
module.exports.employeeByManager = employeeByManager;
module.exports.removeEmployee = removeEmployee;
module.exports.updateEmployeeManager = updateEmployeeManager;