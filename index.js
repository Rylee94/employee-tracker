// Import the inquirer library for handling user input
const inquirer = require("inquirer");
const mySQL = require("mysql");

// mySQL connection info
const dbConnection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "abc123",
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
        message: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])
    .then((answer) => {
      // Use a switch statement to handle different menu options
      switch (answer.menuOptions) {
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
}

// add
// functions
// for
// each
// prompt
// here

function viewAllDepartments() {
  dbConnection.query(
    "SELECT * FROM department ORDER BY id",
    function (err, res) {
      if (err) {
        console.log('fetch departments ERROR')
      }
      console.table(res);
      startPrompt();
    }
  );
}
