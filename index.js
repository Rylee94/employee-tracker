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

// VIEW ALL DEPARTMENTS
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

// VIEW ALL ROLES
function viewAllRoles() {
  dbConnection.query(
    "SELECT roles.id, roles.title, roles.salary, departments.dep_name AS department FROM roles JOIN departments ON roles.department_id = departments.id",
    function (err, res) {
      if (err) throw err;
      console.log("roles error");
      const table = cTable.getTable(res);
      console.log(table);
      startPrompt();
    }
  );
}

// VIEW ALL EMPLOYEES
function viewAllEmployees() {
  dbConnection.query(
    "SELECT employee.id AS employee_id, employee.first_name, employee.last_name, roles.title, roles.salary, departments.dep_name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.roles_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employee manager ON employee.manager_id = manager.id",
    function (err, res) {
      if (err) throw err;
      console.log("error");
      const table = cTable.getTable(res);
      console.log(table);
      startPrompt();
    }
  );
}

// ADD NEW DEPARTMENT
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What department would you like to add?",
      },
    ])
    .then(function (res) {
      let query = dbConnection.query(
        "INSERT INTO departments SET ?",
        {
          dep_name: res.name,
        },
        function (err, result) {
          if (err) throw err;
          console.log("Department added successfully!");
          startPrompt();
        }
      );
    });
}

// ADD NEW ROLE
function addRole() {
  // Retrieve department names and IDs from the database
  dbConnection.query(
    "SELECT id, dep_name FROM departments",
    function (err, departments) {
      if (err) throw err;

      // Map department names to their corresponding IDs
      const departmentChoices = departments.map((department) => ({
        name: department.dep_name,
        value: department.id,
      }));

      inquirer
        .prompt([
          {
            name: "title",
            type: "input",
            message: "What is the title of the new role?",
          },
          {
            name: "salary",
            type: "input",
            message: "What is the salary of the new role?",
          },
          {
            name: "department_id",
            type: "list", // Use a list to display department choices
            message: "What department will the new role be a part of?",
            choices: departmentChoices,
          },
        ])
        .then(function (res) {
          // Convert salary to a numeric value without commas
          const salary = parseFloat(res.salary.replace(",", ""));

          dbConnection.query(
            "INSERT INTO roles SET ?",
            {
              title: res.title,
              salary: res.salary,
              department_id: res.department_id,
            },
            function (err, result) {
              if (err) throw err;
              console.log("Role added successfully!");
              startPrompt();
            }
          );
        });
    }
  );
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "Enter employee's first name",
      },
      {
        name: "last_name",
        type: "input",
        message: "Enter employee's last name",
      },
      {
        name: "roles",
        type: "input",
        message: "Enter employee's role",
      },
      {
        name: "manager_id",
        type: "input",
        message: "Enter employee's manager",
      },
    ])
    .then(function (res) {
      let query = dbConnection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: res.first_name,
          last_name: res.last_name,
          roles_id: res.roles,
          manager_id: res.manager_id,
        },
        function (err, result) {
          if (err) throw err;
          console.log("Employee added successfully!");
          startPrompt();
        }
      );
    });
}

function updateEmployee() {
  // Retrieve employee names and IDs from the database
  dbConnection.query(
    "SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name FROM employee",
    function (err, employees) {
      if (err) throw err;

      // Map employee names to their corresponding IDs
      const employeeChoices = employees.map((employee) => ({
        name: employee.employee_name,
        value: employee.id,
      }));

      // Retrieve role titles and IDs from the database
      dbConnection.query("SELECT id, title FROM roles", function (err, roles) {
        if (err) throw err;

        // Map role titles to their corresponding IDs
        const roleChoices = roles.map((role) => ({
          name: role.title,
          value: role.id,
        }));

        inquirer
          .prompt([
            {
              name: "employee_id",
              type: "list",
              message: "Select the employee whose role you want to update:",
              choices: employeeChoices,
            },
            {
              name: "new_role_id",
              type: "list",
              message: "Select the new role for the employee:",
              choices: roleChoices,
            },
          ])
          .then(function (res) {
            dbConnection.query(
              "UPDATE employee SET roles_id = ? WHERE id = ?",
              [res.new_role_id, res.employee_id],
              function (err, result) {
                if (err) throw err;
                console.log("Employee role updated successfully!");
                startPrompt();
              }
            );
          });
      });
    }
  );
}

startPrompt();
