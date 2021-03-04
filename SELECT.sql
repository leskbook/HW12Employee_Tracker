SELECT
  *
FROM
  employee
  INNER JOIN role ON employee.role_id = role.id
  INNER JOIN department ON role.department_id = department.id


  