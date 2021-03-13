const inquirer = require('inquirer');
const CreateQuestions = require('../server');
const connect = require('./connection');
const department = require('./department');
const mysql = require('mysql');
const chalk = require('chalk');

//Add Role

function addRole() {    
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Role title:'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Salary:'
        },
        {
            name: 'department',
            type: 'list',
            message: 'Department for the role:',
            choices: department.getDepartment("name")
        }
    ]).then(answers => {         
        let connection = mysql.createConnection(connect.db_connect);          
        const departmentId = department.getDepartment(answers.department);        
        const queryIsExist = "select title from role where title='" + answers.title + "' and department_id=" + departmentId;
       
        connection.query(queryIsExist, function (err, res) {
            if (err) throw err;            
            if (res.length) {
                console.log(chalk.green.bold(`====================================================================================`));
                console.log(chalk.bgGreenBright.black(answers.title + " role already exists for the department.."));
                console.log(chalk.green.bold(`====================================================================================`));                
                CreateQuestions.CreateQuestions();
            }
            else {                
                const query = "insert into role(title,salary,department_id)values('" + answers.title + "'," + answers.salary + "," + departmentId + ")";                
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.log(chalk.green.bold(`====================================================================================`));
                    console.log(chalk.bgGreenBright.black("Successfully added role."));  
                    console.log(chalk.green.bold(`====================================================================================`));                  
                    getRole("name");                   
                    CreateQuestions.CreateQuestions();
                });
            }
        })
    });
}
let roleValues = [];
let role = []; 
function getRole(value) {    
    let connection = mysql.createConnection(connect.db_connect);      
    if (value == "name") {
        roleValues.length = 0;
        role.length = 0;
        let value = [];        
        const query = `select *
    from role`;
       
        connection.query(query, function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {                
                roleValues.push(res[i]);
                value.push(res[i].title);
                role.push(res[i].title);
            }
        });        
        return (value);
    }
    else if (value == "view") {
        let value = [];        
        const query = `select r.id,r.title,r.salary,d.name
          from role r inner join department d
          on r.department_id=d.id
          order by id asc`;
        
        connection.query(query, function (err, res) {
            if (err) throw err;
            if (res.length) {                
                for (let i = 0; i < res.length; i++) {
                    value.push({ Id: res[i].id, Title: res[i].title, Salary: res[i].salary, Department_name: res[i].name });
                }
                console.log(chalk.yellowBright.bold(`====================================================================================`));                
                console.table(value);         
                console.log(chalk.yellowBright.bold(`====================================================================================`));       
                CreateQuestions.CreateQuestions();
            }            
            else {
                console.log(chalk.green.bold(`====================================================================================`));
                console.log(chalk.bgGreenBright.black("No role data"));
                console.log(chalk.green.bold(`====================================================================================`));                
                CreateQuestions.CreateQuestions();
            }
        });
    }    
    else {
        let id = "";
        roleValues.forEach(element => {
            
            if (element.title == value) {
                id = element.id;
            }
        });

        return id;
    }    
    connection.end();
}

//Remove Role

const removeRole = () => {
    
    if (role.length) {        
        inquirer.prompt([
            {
                name: 'roleName',
                type: 'list',
                message: 'Role to delete:',
                choices: role
            }
        ]).then(answers => {            
            const query = "select id from role where title='" + answers.roleName + "'";            
            let connection = mysql.createConnection(connect.db_connect);
            let id = 0;
            
            connection.query(query, function (err, data) {
                if (err) throw err;                
                id = data[0].id;
                if (data.length) {                    
                    const queryRole = "select id from employee where role_id=" + id;
                    
                    connection.query(queryRole, function (err, data) {
                        if (err) throw err;
                       
                        if (data.length) {

                            console.log(chalk.green.bold(`====================================================================================`));
                            console.log(chalk.bgGreenBright.black("Employee exist for the role. Role can not be deleted"));
                            console.log(chalk.green.bold(`====================================================================================`));                            
                            CreateQuestions.CreateQuestions();
                        }
                        
                        else { 
                            const query1 = `SET FOREIGN_KEY_CHECKS = 0 ;`                            
                            const query2 = `delete from role where id=${id}`;
                          
                            connection.query(query1, function (err, res) {
                                if (err) throw err;                                
                                connection.query(query2, function (err, res) {
                                    if (err) throw err;
                                    console.log(chalk.green.bold(`====================================================================================`));               
                                    console.log(chalk.bgGreenBright.black("Successfully deleted role\n"));
                                    console.log(chalk.green.bold(`====================================================================================`));                                    
                                    getRole("name");                                                                    
                                    CreateQuestions.CreateQuestions();
                                });
                            });
                        }
                    });
                }
            });
        });
    }    
    else {
        console.log(chalk.green.bold(`====================================================================================`));
        console.log(chalk.bgGreenBright.black("No record of role"));
        console.log(chalk.green.bold(`====================================================================================`));        
        CreateQuestions.CreateQuestions();
    }
}

getRole("name");

module.exports.addRole = addRole;
module.exports.getRole = getRole;
module.exports.removeRole = removeRole;