DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
);
CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  departments_id INT,
  FOREIGN KEY (departments_id) REFERENCES departments(id)
);
CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  manager_id INT,
  roles_id INT,
  FOREIGN KEY (roles_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);
INSERT INTO departments (name) VALUE ("Engineering");
INSERT INTO departments (name) VALUE ("Legal");
INSERT INTO departments (name) VALUE ("Finance");
INSERT INTO departments (name) VALUE ("Sales");
INSERT INTO roles (title, salary, departments_id) VALUE ("Lead Engineer", 150000, 1);
INSERT INTO roles (title, salary, departments_id) VALUE ("Software Engineer", 120000, 1);
INSERT INTO roles (title, salary, departments_id) VALUE ("Legal Team Lead", 180000, 2);
INSERT INTO roles (title, salary, departments_id) VALUE ("Lawyer", 190000, 2);
INSERT INTO roles (title, salary, departments_id) VALUE ("Accountant", 125000, 3);
INSERT INTO roles (title, salary, departments_id) VALUE ("CPA", 90000, 3);
INSERT INTO roles (title, salary, departments_id) VALUE ("Sales Lead", 100000, 4);
INSERT INTO roles (title, salary, departments_id) VALUE ("Salesperson", 80000, 1);
INSERT INTO employees (first_name, last_name, manager_id, roles_id) VALUE ("John", "Doe", null, 2);
INSERT INTO employees (first_name, last_name, manager_id, roles_id) VALUE ("Walter", "White", 1, 1);
INSERT INTO employees (first_name, last_name, manager_id, roles_id) VALUE ("Jessie", "Pinkman", 1, 4);
INSERT INTO employees (first_name, last_name, manager_id, roles_id) VALUE ("Skylar", "White", 1, 3);
INSERT INTO employees (first_name, last_name, manager_id, roles_id) VALUE ("Saul", "Goodman", 1, 2);
SELECT *
FROM departments;
SELECT *
FROM roles;
SELECT *
FROM employees;