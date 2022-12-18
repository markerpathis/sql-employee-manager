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

// const { default: inquirer } = require("inquirer");
const fs = require("fs");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
require("dotenv").config();

const queryAllRoles = fs.readFileSync("db/queryAllRoles.sql").toString();

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

const promptInitial = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "inputTask",
    choices: ["View All Departments", "View All Roles", "View All Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "Quit"],
  },
];

const promptAddEmployee = [
  {
    type: "input",
    message: "Employee's First Name:",
    name: "inputEmployeeFirstName",
  },
  {
    type: "input",
    message: "Employee's Last Name:",
    name: "inputEmployeeLastName",
  },
  {
    type: "list",
    message: "Employee's Role:",
    name: "inputEmployeeRole",
    choices: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    type: "list",
    message: "Employee's Manager:",
    name: "inputEmployeeManager",
    choices: [1, 3, 5, 7],
  },
];

function initialQuestions() {
  inquirer.prompt(promptInitial).then(function (answers) {
    const input = answers;
    console.log("finsihed");
    console.log(input);
    if (answers.inputTask === "View All Departments") {
      viewDepartments();
    } else if (answers.inputTask === "View All Roles") {
      viewRoles();
    } else if (answers.inputTask === "View All Employees") {
      viewEmployees();
    } else if (answers.inputTask === "Add Employee") {
      addEmployee();
    } else {
      process.exit(0);
    }
  });
}

function addEmployee() {
  inquirer.prompt(promptAddEmployee).then(function (answers) {
    const input = answers;
    console.log("finsihed");
    console.log(input);
    db.query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answers.inputEmployeeFirstName}", "${answers.inputEmployeeLastName}", ${answers.inputEmployeeRole}, ${answers.inputEmployeeManager})`,
      (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result);
        initialQuestions();
      }
    );
  });
}

function viewDepartments() {
  db.query(`SELECT * FROM department`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    initialQuestions();
  });
}

function viewRoles() {
  db.query(`${queryAllRoles}`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    initialQuestions();
  });
}

function viewEmployees() {
  db.query(`SELECT * FROM employee`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    initialQuestions();
  });
}

function init() {
  initialQuestions();
}

init();
