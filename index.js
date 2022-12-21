// Packages needed for this application
const fs = require("fs");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
require("dotenv").config();

// Reads and returns the content of the queryAll sql files to be used in the viewDepartments, viewRoles, viewEmployees functions
const queryAllRoles = fs.readFileSync("db/queryAllRoles.sql").toString();
const queryAllDepartments = fs.readFileSync("db/queryAllDepartments.sql").toString();
const queryAllEmployees = fs.readFileSync("db/queryAllEmployees.sql").toString();

// Emptry arrays to be used in the sql SELECT queries. The obj versions are used to save the array of objects, which are then mapped to the other fields
let allRolesObj = [];
let allRoles = [];
let allManagersObj = [];
let allManagers = [];
let allDepartmentsObj = [];
let allDepartments = [];
let allEmployeesObj = [];
let allEmployees = [];

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
  // db queries are included in initialQuestions so the results can be used to populte the inquirer lists where necessary

  // Query to SELECT the role titles, to be used in the inquirer prompts for promptAddEmployee and promptUpdateEmployeeRole
  db.query(`SELECT role.title AS title FROM role;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    allRolesObj = result;
    //update from array of objects to an array to be used by inquirer
    allRoles = allRolesObj.map(function (obj) {
      return obj.title;
    });

    // Query to SELECT the manager names, to be used in the inquirer prompts for promptAddEmployee
    db.query(
      `SELECT CONCAT(mgr.first_name, " ", mgr.last_name) AS manager FROM employee emp LEFT JOIN employee mgr ON emp.manager_id = mgr.id WHERE mgr.id > 0 GROUP BY mgr.first_name, mgr.last_name;`,
      (err, result) => {
        if (err) {
          console.log(err);
        }
        // the SELECT query returns an array of objects which needs to be mapped to another array to be used by inquirer
        allManagersObj = result;
        allManagers = allManagersObj.map(function (obj) {
          return obj.manager;
        });

        // Query to SELECT the department names, to be used in the inquirer prompts for promptAddRole
        db.query(`SELECT name FROM department ORDER BY name ASC;`, (err, result) => {
          if (err) {
            console.log(err);
          }
          // the SELECT query returns an array of objects which needs to be mapped to another array to be used by inquirer
          allDepartmentsObj = result;
          allDepartments = allDepartmentsObj.map(function (obj) {
            return obj.name;
          });

          // query to SELECT the employee names, to be used in the inquirer prompts for promptUpdateEmployeeRole
          db.query(`SELECT CONCAT(first_name, " ", last_name) AS name FROM employee ORDER BY first_name ASC `, (err, result) => {
            if (err) {
              console.log(err);
            }
            // the SELECT query returns an array of objects which needs to be mapped to another array to be used by inquirer
            allEmployeesObj = result;
            allEmployees = allEmployeesObj.map(function (obj) {
              return obj.name;
            });

            // Initial inquirer prompts to determine what the user wants to view, add, or update
            const promptInitial = [
              {
                type: "list",
                message: "What would you like to do?",
                name: "inputTask",
                choices: ["View All Departments", "View All Roles", "View All Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "Quit"],
              },
            ];

            // calls the functions to view, add, or update based on the answer from promptInitial
            inquirer.prompt(promptInitial).then(function (answers) {
              switch (answers.inputTask) {
                case "View All Departments":
                  viewDepartments();
                  break;
                case "View All Roles":
                  viewRoles();
                  break;
                case "View All Employees":
                  viewEmployees();
                  break;
                case "Add Employee":
                  addEmployee();
                  break;
                case "Add Department":
                  addDepartment();
                  break;
                case "Add Role":
                  addRole();
                  break;
                case "Update Employee Role":
                  updateEmployee();
                  break;
                default:
                  process.exit(0);
              }
            });
          });
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

      // Query to search the manager id based on the manager name select, which is then used in the insert query below
      db.query(
        `SELECT mgr.id as id FROM employee emp LEFT JOIN employee mgr ON emp.manager_id = mgr.id WHERE CONCAT(mgr.first_name, " ", mgr.last_name) = "${answers.inputEmployeeManager}" GROUP BY mgr.id;`,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          employeeMgr = result[0].id;

          // inserts the new employee in the db
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

// function to gather the department name from the user and insert it into the database
function addDepartment() {
  const promptAddDepartment = [
    {
      type: "input",
      message: "Department Name:",
      name: "inputDepartmentName",
    },
  ];

  // query to INSERT the new department into the db
  inquirer.prompt(promptAddDepartment).then(function (answers) {
    db.query(`INSERT INTO department (name) VALUES ("${answers.inputDepartmentName}")`, (err, result) => {
      if (err) {
        console.log(err);
      }

      initialQuestions();
    });
  });
}

function addRole() {
  const promptAddRole = [
    {
      type: "input",
      message: "Role Name:",
      name: "inputRoleName",
    },
    {
      type: "input",
      message: "Role Salary:",
      name: "inputRoleSalary",
    },
    {
      type: "list",
      message: "Role's Department:",
      name: "inputRoleDepartment",
      choices: allDepartments,
    },
  ];

  inquirer.prompt(promptAddRole).then(function (answers) {
    let department = "";
    // query to SELECT the id of the department based on the department select in inquirer
    db.query(`SELECT id FROM department WHERE name = "${answers.inputRoleDepartment}"`, (err, result) => {
      if (err) {
        console.log(err);
      }
      department = result[0].id;

      // query to INSERT the new role into the db
      db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answers.inputRoleName}", "${answers.inputRoleSalary}", ${department})`, (err, result) => {
        if (err) {
          console.log(err);
        }
        initialQuestions();
      });
    });
  });
}

function updateEmployee() {
  const promptUpdateEmployeeRole = [
    {
      type: "list",
      message: "Employee to update:",
      name: "inputUpdatedEmployeeName",
      choices: allEmployeesObj,
    },
    {
      type: "list",
      message: "Employee's updated role:",
      name: "inputUpdatedEmployeeRole",
      choices: allRoles,
    },
  ];

  inquirer.prompt(promptUpdateEmployeeRole).then(function (answers) {
    let role = "";
    // query to SELECT the role id based on the role selected in inquirier
    db.query(`SELECT id FROM role WHERE title = "${answers.inputUpdatedEmployeeRole}"`, (err, result) => {
      if (err) {
        console.log(err);
      }
      role = result[0].id;

      // query to UPDATE the selected employee's role
      db.query(`UPDATE employee SET role_id = ${role} WHERE CONCAT(first_name, " ", last_name) = "${answers.inputUpdatedEmployeeName}"`, (err, result) => {
        if (err) {
          console.log(err);
        }
        initialQuestions();
      });
    });
  });
}

// the three View function below
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
