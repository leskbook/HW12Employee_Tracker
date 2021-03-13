create database employee_db;
use employee_db;

create table department(
id int not null auto_increment,
name varchar(50) not null,
primary key(id)
);

create table role(
id int NOT NULL auto_increment,
title varchar(50) not null,
salary decimal(10,5) NOT NULL,
department_id int,
primary key(id),
foreign key(department_id) references department(id)  
);

create table employee(
id int NOT NULL auto_increment,
first_name varchar(50) not null,
last_name varchar(50) NOT NULL,
role_id int,
manager_id int,
primary key(id),
foreign key(role_id) references role(id),
foreign key(manager_id) references employee(id) 
);