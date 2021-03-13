const inquirer = require('inquirer');
 const department=require('./lib/department');
const role=require('./lib/role');
const employee=require('./lib/employee');
const chalk = require('chalk');
require('console.table');
const figlet = require('figlet'); 

  console.log('');
  console.log(chalk.green.bold(`====================================================================================`));
  console.log(``);
  console.log(chalk.yellowBright.bold(figlet.textSync('Employee Tracker')));
  console.log(``);
  console.log('');
  console.log(``);
  console.log(chalk.green.bold(`====================================================================================`));

function CreateQuestions(){
    //ask the user question 
    inquirer.prompt([
        {   
            name: 'choice',
            type: 'list',
            message: 'What you would like to do?',
            choices: ["View all Employees","View all Employees By Department","View all Employees by Manager","Update Employee Manager","add Employee","Remove Employee","View Department","Add Department","Remove Department","View Role","Add Role","Remove Role","Update Employee Role", "Total Salary based on Department","Exit"]
        }
    ]).then(answers => {
        if (answers.choice == 'View all Employees') {
            employee.allEmployee(answers);
        }
        else if (answers.choice == 'View all Employees By Department') {
            employee.employeeByDepartment();
        }
        else if (answers.choice == 'View all Employees by Manager') {
            employee.employeeByManager();
        }
        else if (answers.choice == 'add Employee') {
            employee.addEmployee();
        } 
        else if (answers.choice == 'Add Department') {
        department.addDepartment();
        }
        else if (answers.choice == 'Add Role') {
           role.addRole();
        }
        else if (answers.choice == 'View Department') {
             department.getDepartment("view");
        }
        else if (answers.choice == 'View Role') {
         role.getRole("view");
        }
        else if (answers.choice == 'Update Employee Role') {
            employee.updateEmployeeRole();
        }
        else if (answers.choice == 'Remove Employee') {
            employee.removeEmployee();
        }
        else if (answers.choice == 'Remove Department') {
            department.removeDepartment();
        }
        else if (answers.choice == 'Remove Role') {
            role.removeRole();
        }
        else if (answers.choice == 'Update Employee Manager') {
            employee.updateEmployeeManager();
        }
        else if (answers.choice == 'Total Salary based on Department') {
            department.salaryBasedOnDepartment();
        }
        else if(answers.choice == "Exit"){
                return process.exit(22);
        }
    });
}

const run = async () => {
 await CreateQuestions();
};
run();
module.exports.CreateQuestions=run;