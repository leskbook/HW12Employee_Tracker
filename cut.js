//View by Department ----------------------------------------------------------------------------------------------------------------------

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
  
  //View by Role -----------------------------------------------------------------------------------------------------------
  
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
  
  //View all Employees ------------------------------------------------------------------------------------------------------------
  
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
  
  //View by Manager ---------------------------------------------------------------------------------------------------------------------------
  
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
  
  //Add new Role -----------------------------------------------------------------------------------------------------------------
  function addRole() {
    
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Enter title?'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Salary for the role?'
        },
        {
            name: 'department',
            type: 'list',
            message: 'Select the department for the role?',
            choices: departmentId.getDepartment(`name`)
        }
    ]).then(function (answers) {
        
        const departmentId = department.getDepartment(answers.department);      
        const queryIsExist = "select title from role where title='" + answers.title + "' and department_id=" + departmentId;      
        connection.query(queryIsExist, function (err, res) {
          if (err)
            throw err;        
          if (res.length) {           
            console.log(chalk.bgBlueBright.black(answers.title + " role already exists for the department.."));
            
           start();
          }
          else {          
            const query = "insert into role(title,salary,department_id)values('" + answers.title + "'," + answers.salary + "," + departmentId + ")";          
            connection.query(query, function (err, res) {
              if (err)
                throw err;            
              console.log(chalk.bgbgGreenBright.black("sucessfully added role."));            
              getRole("name");            
              start();
            });
          }
        });
      });
  }
  
  function addDepartment() {
    inquirer.prompt({
      type: 'input',
      name: 'departmentName',
      message: 'New department name?:',
    })
      .then(function (answer) {
        let query = 'INSERT INTO department (name) VALUES (?)';
        connection.query(query, answer.departmentName, function (err, res) {
          if (err) throw err;
          console.log(chalk.yellowBright.bold(`====================================================================================`));
          console.log(chalk.bgGreenBright(`Department successfully added `));
          console.log(chalk.yellowBright.bold(`====================================================================================`));
                      
        })
        viewDepartments();
  
      })
  
  };
  
  
  //Add new Employee --------------------------------------------------------------------------------------------------------------
  
  function addEmployee() {
    inquirer.prompt([
      {
        type: 'input',
        name: 'fistName',
        message: "What is the employee's first name?",
        validate: addFirstName => {
          if (addFirstName) {
            return true;
          } else {
            console.log('Please enter a first name');
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: addLastName => {
          if (addLastName) {
            return true;
          } else {
            console.log('Please enter a last name');
            return false;
          }
        }
      }
    ])
      .then(answer => {
        const crit = [answer.fistName, answer.lastName]
        const roleSql = `SELECT role.id, role.title FROM role`;
        connection.query(roleSql, (error, data) => {
          if (error) throw error;
          const roles = data.map(({ id, title }) => ({ name: title, value: id }));
          inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles
            }
          ])
            .then(roleChoice => {
              const role = roleChoice.role;
              crit.push(role);
              const managerSql = `SELECT * FROM employee`;
              connection.query(managerSql, (error, data) => {
                if (error) throw error;
                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                  .then(managerChoice => {
                    const manager = managerChoice.manager;
                    crit.push(manager);
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                      VALUES (?, ?, ?, ?)`;
                    connection.query(sql, crit, (error) => {
                      if (error) throw error;
                      console.log(chalk.yellowBright.bold(`====================================================================================`));
                      console.log(chalk.bgGreenBright(`Employee successfully added `));
                      console.log(chalk.yellowBright.bold(`====================================================================================`));
                      viewEmployees();
  
                    });
                  });
              });
            });
        });
      });
  };
  
  //Remove Employee -------------------------------------------------------------------------------------------------------------------------
  
  function removeEmployee() {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;
    connection.query(sql, (error, response) => {
      if (error) throw error;
      let employeeNamesArray = [];
      response.forEach((employee) => { employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`); });
      inquirer
        .prompt([
          {
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee would you like to remove?',
            choices: employeeNamesArray
          }
        ])
        .then((answer) => {
          let employeeId;
  
          response.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });
  
          let sql = `DELETE FROM employee WHERE employee.id = ?`;
          connection.query(sql, [employeeId], (error) => {
            if (error) throw error;
            console.log(chalk.yellowBright.bold(`====================================================================================`));
            console.log(chalk.bgGreenBright(`Employee Successfully Removed`));
            console.log(chalk.yellowBright.bold(`====================================================================================`));
            viewEmployees();
          });
        });
    });
  };
  
  //Remove Department ------------------------------------------------------------------------------------------------------------------------
  
  function deleteDepartment() {
    let sql = `SELECT department.id, department.name FROM department`;
    connection.query(sql, function (error, response) {
      if (error) throw error;
      let departmentNamesArray = [];
      response.forEach((department) => { departmentNamesArray.push(department.name); });
  
      inquirer
        .prompt([
          {
            name: 'chosenDept',
            type: 'list',
            message: 'Which department would you like to remove?',
            choices: departmentNamesArray
          }
        ])
        .then(function (answer) {
          let departmentId;
  
          response.forEach(function (department) {
            if (answer.chosenDept === department.name) {
              departmentId = department.id;
            }
          });
  
          let sql = `DELETE FROM department WHERE department.id = ?`;
          connection.query(sql, [departmentId], function (error) {
            if (error) throw error;
            console.log(chalk.yellowBright.bold(`====================================================================================`));
            console.log(chalk.bgGreenBright(`Department Successfully Removed`));
            console.log(chalk.yellowBright.bold(`====================================================================================`));
            viewDepartments();
          });
        });
    });
  };
  
  //Update Role -------------------------------------------------------------------------------------------------------------------------------
  
  function updateRole() {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
                    FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
    connection.query(sql, (error, response) => {
      if (error)
        throw error;
      let employeeNamesArray = [];
      response.forEach((employee) => { employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`); });
  
      let sql = `SELECT role.id, role.title FROM role`;
      connection.query(sql, (error, response) => {
        if (error)
          throw error;
        let rolesArray = [];
        response.forEach((role) => { rolesArray.push(role.title); });
  
        inquirer
          .prompt([
            {
              name: 'chosenEmployee',
              type: 'list',
              message: 'Which employee has a new role?',
              choices: employeeNamesArray
            },
            {
              name: 'chosenRole',
              type: 'list',
              message: 'What is their new role?',
              choices: rolesArray
            }
          ])
          .then((answer) => {
            let newTitleId, employeeId;
  
            response.forEach((role) => {
              if (answer.chosenRole === role.title) {
                newTitleId = role.id;
              }
            });
  
            response.forEach((employee) => {
              if (answer.chosenEmployee ===
                `${employee.first_name} ${employee.last_name}`) {
                employeeId = employee.id;
              }
            });
  
            let sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
            connection.query(
              sqls,
              [newTitleId, employeeId],
              (error) => {
                if (error)
                  throw error;
                console.log(chalk.yellowBright.bold(`====================================================================================`));
                console.log(chalk.bgGreenBright(`Employee Role Updated`));
                console.log(chalk.yellowBright.bold(`====================================================================================`));
                viewRole();
              }
            );
          });   
              
                
                
              });
          });
        };
      
  