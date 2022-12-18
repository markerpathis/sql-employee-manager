// INQUIRER
// PROMPT1 - view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

// view all departments
/////////// presented with a formatted table, inlcuding...
/////////// department names
/////////// department id's

// view all roles
/////////// presented with a formatted table, inlcuding...
/////////// the job title
/////////// role id
/////////// the department that role belongs to
/////////// salary for that role

// view all employees
/////////// presented with a formatted table showing employee data, including...
/////////// employee ids
/////////// first names
/////////// last names
/////////// job titles
/////////// departments
/////////// salaries
/////////// managers that the employees report to

// add a department
/////////// prompted to enter...
/////////// name of the department
/////////// ...department is added to the database

// add a role
/////////// prompted to enter...
/////////// name of the role
/////////// salary
/////////// department for the role
/////////// ... role is added to the database

// add an employee
/////////// prompted to enter....
/////////// first name
/////////// last name
/////////// role
/////////// ... employee is added to database

// update an employee role
/////////// select an employee to update
/////////// select a new role to assign to the employee

// What do we need...
// dotenv to hide password
// db folder
/////////// schema.sql - to set up the database and tables for department role and employee
/////////// seeds.sql - to prepopulate the db
// index.js
/////////// prepared statements to populate the tables

const mysql = require("mysql2");
require("dotenv").config();

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: process.env.PASSWORD,
    database: "company_db",
  },
  console.log(`Connected to the courses_db database.`)
);
