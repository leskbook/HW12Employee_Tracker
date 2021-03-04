const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
require('console.table');
const figlet = require('figlet');



const connection = mysql.createConnection({
  multipleStatements: true,
  host: "localhost",
  port: 3306,
  user: "root",
  password: 'myP@ssword',
  database: "employee_db"
});


connection.connect(function (err) {
  if (err) throw err;
  console.log(chalk.bgGreenBright.black('connected as id ' + connection.threadId));
  console.log('');
  console.log(chalk.green.bold(`====================================================================================`));
  console.log(``);
  console.log(chalk.yellowBright.bold(figlet.textSync('Employee Tracker')));
  console.log(``);
  console.log(`                                                          ` + chalk.magentaBright.bold('Created By: Leslie Book using figlet'));
  console.log(``);
  console.log(chalk.green.bold(`====================================================================================`));
  start();
});

function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Manage?",
      choices: [
        "View all employees",
        "View employee by department",
        "View all roles",
        "View by manager",
        "Add an employee",
        "Add a department",
        "Add a role",
        "Delete Department",
        "Delete Role",
        "Delete Employee",
        "Update employee role",
        "Update employee manager",
        "View budget by department",
        "Exit"
      ]
    })
    .then(function (answer) {
      if (answer.action === 'View all employees') {
        viewEmployees();
      } else if (answer.action === 'View employee by department') {
        viewDepartments();
      } else if (answer.action === 'View all roles') {
        viewRole();
      } else if (answer.action === 'View by manager') {
        viewByManager();
      } else if (answer.action === 'Add an employee') {
        addEmployee();
      } else if (answer.action === 'Add a department') {
        addDepartment();
      } else if (answer.action === 'Add a role') {
        addRole();
      } else if (answer.action === 'Delete Department') {
        deleteDepartment();
      } else if (answer.action === 'Delete Role') {
        deleteRole();
      } else if (answer.action === 'Delete Employee') {
        deleteEmployee();
      } else if (answer.action === 'Update employee role') {
        updateRole();
      } else if (answer.action === 'Update employee manager') {
        updateManager();
      } else if (answer.action === 'View budget by department') {
        viewBudget();
      } else if (answer.action === 'Exit') {
        connection.end();
      }
    })
}
function viewDepartments() {
  const query = `SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name
  FROM employee
  LEFT JOIN role ON (role.id = employee.role_id)
  LEFT JOIN department ON (department.id = role.department_id)
  ORDER BY department.name;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.log(chalk.bgRedBright.black('VIEW EMPLOYEE BY DEPARTMENT'));
    console.log('\n');
    console.table(res);
    start();
  });
};

function viewRole() {
  const query = `SELECT role.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY role.title;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.log(chalk.bgRedBright.black('VIEW EMPLOYEE BY ROLE'));
    console.log('\n');
    console.table(res);
    start();
  });
};

function viewEmployees() {
  const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employee
  LEFT JOIN employee manager on manager.id = employee.manager_id
  INNER JOIN role ON (role.id = employee.role_id)
  INNER JOIN department ON (department.id = role.department_id)
  ORDER BY employee.id;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.log(chalk.bgRedBright.black('VIEW ALL EMPLOYEES'));
    console.log('\n');
    console.table(res);
    start();
  });
};
function viewByManager() {
  const query = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
  FROM employee
  LEFT JOIN employee manager on manager.id = employee.manager_id
  INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
  INNER JOIN department ON (department.id = role.department_id)
  ORDER BY manager;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.log(chalk.bgRedBright.black('VIEW EMPLOYEE BY MANAGER'));
    console.log('\n');
    console.table(res);
    start();
  });
};
function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "New department name?: ",
    })
    .then(function (answer) {
      var query = "INSERT INTO department (name) VALUES ( ? )";
      connection.query(query, answer.department, function (err, res) {
        console.log(chalk.bgGreenBright.black(`Department added: ${(answer.department).toUpperCase()}.`))
      })
      viewDepartments();
    })
}
function addRole() {
  inquirer
    .prompt({
      name: "role",
      type: "input",
      message: "New role?: ",
    })
    .then(function (answer) {
      var query = "INSERT INTO role (name) VALUES ( ? )";
      connection.query(query, answer.role, function (err, res) {
        console.log(chalk.bgGreenBright.black(`Role added: ${(answer.role).toUpperCase()}.`))
      })
      viewRole();
    })
}

async function addEmployee() {
  const addname = await inquirer.prompt(askName());
  connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
    if (err) throw err;
    const { role } = await inquirer.prompt([
      {
        name: 'role',
        type: 'list',
        choices: () => res.map(res => res.title),
        message: 'What is the employee role?: '
      }
    ]);
    let roleId;
    for (const row of res) {
      if (row.title === role) {
        roleId = row.id;
        continue;
      }
    }
    connection.query('SELECT * FROM employee', async (err, res) => {
      if (err) throw err;
      let choices = res.map(res => `${res.first_name} ${res.last_name}`);
      choices.push('none');
      let { manager } = await inquirer.prompt([
        {
          name: 'manager',
          type: 'list',
          choices: choices,
          message: 'Choose the employee Manager: '
        }
      ]);
      let managerId;
      let managerName;
      if (manager === 'none') {
        managerId = null;
      } else {
        for (const data of res) {
          data.fullName = `${data.first_name} ${data.last_name}`;
          if (data.fullName === manager) {
            managerId = data.id;
            managerName = data.fullName;
            console.log(managerId);
            console.log(managerName);
            continue;
          }
        }
      }
      console.log(chalk.bgGreenBright.black('Employee has been added. Please view all employee to verify...'));
      connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: addname.first,
          last_name: addname.last,
          role_id: roleId,
          manager_id: parseInt(managerId)
        },
        (err, res) => {
          if (err) throw err;
          viewEmployees();
        })
    })
  })

}

function updateRole() {
  connection.query('SELECT * FROM employee', function (err, result) {
    if (err) throw (err);
    inquirer
      .prompt([
        {
          name: "employeeName",
          type: "list",
          message: "Which employee's role is changing?",
          choices: function () {
            employeeArray = [];
            result.forEach(result => {
              employeeArray.push(
                result.last_name
              );
            })
            return employeeArray;
          }
        }
      ])

      .then(function (answer) {
        console.log(answer);
        const name = answer.employeeName;

        connection.query("SELECT * FROM role", function (err, res) {
          inquirer
            .prompt([
              {
                name: "role",
                type: "list",
                message: "What is their new role?",
                choices: function () {
                  rolesArray = [];
                  res.forEach(res => {
                    rolesArray.push(
                      res.title)

                  })
                  return rolesArray;
                }
              }
            ]).then(function (rolesAnswer) {
              const role = rolesAnswer.role;
              console.log(rolesAnswer.role);
              connection.query('SELECT * FROM role WHERE title = ?', [role], function (err, res) {
                if (err) throw (err);
                let roleId = res[0].id;
                let query = "UPDATE employee SET role_id ? WHERE last_name ?";
                let values = [roleId, name]
                console.log(values);
                connection.query(query, values,
                  function (err, res, fields) {
                    console.log(chalk.greenBright.black(`You have updated ${name}'s role to ${role}.`))
                  })
                viewEmployees();
              })
            })
        })


      })
  })

}
function remove(input) {
  const promptQ = {
    yes: "yes",
    no: "no I don't (view all employees on the main option)"
  };
  inquirer.prompt([
    {
      name: "action",
      type: "list",
      message: "In order to proceed an employee, an ID must be entered. View all employees to get" +
        " the employee ID. Do you know the employee ID?",
      choices: [promptQ.yes, promptQ.no]
    }
  ]).then(answer => {
    if (input === 'delete' && answer.action === "yes") removeEmployee();
    else if (input === 'role' && answer.action === "yes") updateRole();
    else viewAllEmployees();



  });
};
async function removeEmployee() {

  const answer = await inquirer.prompt([
    {
      name: "first",
      type: "input",
      message: "Enter ID of the employee you want to remove:  "
    }
  ]);

  connection.query('DELETE FROM employee WHERE ?',
    {
      id: answer.first
    },
    function (err) {
      if (err) throw err;
    }
  )
  console.log(chalk.greenBright.black('Employee has been removed'));
  prompt();

};
function askId() {
  return ([
    {
      name: "name",
      type: "input",
      message: "What is the employe ID?:  "
    }
  ]);
}
async function deleteRole() {
  const employeeId = await inquirer.prompt(askId());

  connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async function (err, res) {
      if (err)
        throw err;
      let { role } = await inquirer.prompt([
        {
          name: 'role',
          type: 'list',
          choices: () => res.map(res => res.title),
          message: 'What is the role you wish to delete: '
        }
      ]);
      let roleId;
      for (const row of res) {
        if (row.title === role) {
          roleId = row.id;
          continue;
        }
      }      
        connection.query('DELETE FROM role WHERE ?',
        {
            id: answer.first
        },

        function (err) {
            if (err) throw err;
                 }
        )
        console.log(chalk.greenBright.black('Role has been deleted..'));
        prompt();
      });
    
}

function askName() {
  return ([
    {
      name: "first",
      type: "input",
      message: "first name: "
    },
    {
      name: "last",
      type: "input",
      message: "last name: "
    }
  ])
}