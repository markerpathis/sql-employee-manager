const fs = require("fs");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
require("dotenv").config();

const queryAllRoles = fs.readFileSync("db/queryAllRoles.sql").toString();
const queryAllDepartments = fs.readFileSync("db/queryAllDepartments.sql").toString();
const queryAllEmployees = fs.readFileSync("db/queryAllEmployees.sql").toString();

let allRolesObj = [];
let allRoles = [];

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

function initialQuestions() {
  db.query(`SELECT role.title AS title FROM role;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    allRolesObj = result;
    //update from array of objects to an array to be used by inquirer
    allRoles = allRolesObj.map(function (obj) {
      return obj.title;
    });

    const promptInitial = [
      {
        type: "list",
        message: "What would you like to do?",
        name: "inputTask",
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "Quit"],
      },
    ];

    inquirer.prompt(promptInitial).then(function (answers) {
      const input = answers;
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
  });
}

function addEmployee() {
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
      choices: allRoles,
    },
    {
      type: "list",
      message: "Employee's Manager:",
      name: "inputEmployeeManager",
      choices: [1, 3, 5, 7],
    },
  ];

  inquirer.prompt(promptAddEmployee).then(function (answers) {
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

function returnRole() {
  db.query(`SELECT GROUP_CONCAT(CONCAT('"', role.title,'"' )) as title FROM role;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("IN FUNCTION: ", result[0].title);
    return result[0].title;
  });
}

function viewDepartments() {
  db.query(`${queryAllDepartments}`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    initialQuestions();
  });
}

function viewRoles() {
  returnRole();
  db.query(`${queryAllRoles}`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    initialQuestions();
  });
}

function viewEmployees() {
  db.query(`${queryAllEmployees}`, (err, result) => {
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
