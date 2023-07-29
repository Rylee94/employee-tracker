DROP DATABASE IF EXISTS employeeTracker;
CREATE DATABASE employeeTracker;

USE employeeTracker;
 
-- DEPARTMENT TABLE
CREATE TABLE departments (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
dep_name VARCHAR(30)
);

-- DEPARTMENT TABLE
CREATE TABLE roles (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30),
salary DECIMAL(10.2),
department_id INT,
FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- EMPLOYEE TABLE
CREATE TABLE employee (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30),
last_name VARCHAR(30),
roles_id INT,
manager_id INT,
FOREIGN KEY (roles_id) REFERENCES roles(id)
);

