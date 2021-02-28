USE employee_db;

INSERT INTO department (name) VALUES ("Engineering");
INSERT INTO department (name) VALUES ("Sales");
INSERT INTO department (name) VALUES ("Financial");
INSERT INTO department (name) VALUES ("Legal");

INSERT INTO role (title, salary, department_id) VALUES ("Lead Engineer", 120, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Sales Associate", 50, 2);
INSERT INTO role (title, salary, department_id) VALUES ("CPA", 50, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Lawyer", 100, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Paralegal", 100, 4);

INSERT INTO employee (first_name, last_name, role_id) VALUES ("Leslie", "Book", 2);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Walter", "White", 1);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Jessie", "Pinkman", 3);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Skylar", "White", 4);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Saul", "Goodman", 5);
