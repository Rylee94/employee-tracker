// Import the inquirer library for handling user input
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

// mySQL connection info
const dbConnection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Anoka12!",
  database: "employeeTracker",
});

// Define the startPrompt function to prompt the user with a checkbox
function startPrompt() {
  // Use inquirer.prompt to show a checkbox with menu options
  inquirer
    .prompt([
      {
        type: "checkbox",
        name: "menuOptions",
        message: "Select an option:",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])
    .then((answer) => {
      answer.menuOptions.forEach((selectedOption) => {
        switch (selectedOption) {
          case "View all departments":
            viewAllDepartments();
            break;
          case "View all roles":
            viewAllRoles();
            break;
          case "View all employees":
            viewAllEmployees();
            break;
          case "Add a department":
            addDepartment();
            break;
          case "Add a role":
            addRole();
            break;
          case "Add an employee":
            addEmployee();
            break;
          case "Update an employee role":
            updateEmployee();
            break;
          default:
            console.log("Invalid option selected.");
        }
      });
    });
}

// add
// functions
// for
// each
// prompt
// here

function viewAllDepartments() {
  dbConnection.query(
    "SELECT * FROM departments ORDER BY id",
    function (err, res) {
      if (err) throw err;
      console.log("department error");
      const table = cTable.getTable(res);
      console.log(table);
      startPrompt();
    }
  );
}

function viewAllRoles() {
  dbConnection.query(
    "SELECT role.id, role.title, role.salary, departments.name AS department FROM role JOIN departments ON role.department_id = departments.id",
    function (err, res) {
      if (err) throw err;
      console.log("roles error");
      const table = cTable.getTable(res);
      console.log(table);
      startPrompt();
    }
  );
}

function viewAllEmployees() {
  dbConnection.query(
    "SELECT employee.id AS employee_id, employee.first_name, employee.last_name, role.title, role.salary, departments.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN departments ON role.department_id = departments.id LEFT JOIN employee manager ON employee.manager_id = manager.id",

    function (err, res) {
      if (err) throw err;
      console.log("error");
      const table = cTable.getTable(res);
      console.log(table);
      startPrompt();
    }
  );
}

startPrompt();
