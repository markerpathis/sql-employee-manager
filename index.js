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
let allManagersObj = [];
let allManagers = [];

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

    db.query(
      `SELECT CONCAT(mgr.first_name, " ", mgr.last_name) AS manager FROM employee emp LEFT JOIN employee mgr ON emp.manager_id = mgr.id WHERE mgr.id > 0 GROUP BY mgr.first_name, mgr.last_name;`,
      (err, result) => {
        if (err) {
          console.log(err);
        }
        allManagersObj = result;
        allManagers = allManagersObj.map(function (obj) {
          return obj.manager;
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
          } else if (answers.inputTask === "Add Department") {
            addDepartment();
          } else {
            process.exit(0);
          }
        });
      }
    );
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
      choices: allManagers,
    },
  ];

  inquirer.prompt(promptAddEmployee).then(function (answers) {
    let employeeRole = "";
    let employeeMgr = "";
    // Query used to search the role text from the inquirer answer and return the role ID to be used in the insert query below
    db.query(`SELECT role.id FROM role WHERE role.title = "${answers.inputEmployeeRole}"`, (err, result) => {
      if (err) {
        console.log(err);
      }
      employeeRole = result[0].id;

      db.query(
        `SELECT mgr.id as id FROM employee emp LEFT JOIN employee mgr ON emp.manager_id = mgr.id WHERE CONCAT(mgr.first_name, " ", mgr.last_name) = "${answers.inputEmployeeManager}" GROUP BY mgr.id;`,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          employeeMgr = result[0].id;

          db.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answers.inputEmployeeFirstName}", "${answers.inputEmployeeLastName}", ${employeeRole}, ${employeeMgr})`,
            (err, result) => {
              if (err) {
                console.log(err);
              }

              initialQuestions();
            }
          );
        }
      );
    });
  });
}

function addDepartment() {
  const promptAddDepartment = [
    {
      type: "input",
      message: "Department Name:",
      name: "inputDepartmentName",
    },
  ];

  inquirer.prompt(promptAddDepartment).then(function (answers) {
    db.query(`INSERT INTO department (name) VALUES ("${answers.inputDepartmentName}")`, (err, result) => {
      if (err) {
        console.log(err);
      }

      initialQuestions();
    });
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
