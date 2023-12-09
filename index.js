const inquirer = require("inquirer");
const db = require('./db/connection');
const Department = require('./lib/Department');
const Role = require('./lib/Role');
const Employee = require('./lib/Employee');
const mysql = require("mysql2");


function mainMenu() {
    inquirer
        .prompt({
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Add a Manager",
                "Update an employee role",
                "View Employees by Manager",
                "View Employees by Department",
                "Delete Departments | Roles | Employees",
                "Exit",
            ],
        })
        .then((answer) => {
            switch (answer.action) {
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
                case "Add a Manager":
                    addManager();
                    break;
                case "Update an employee role":
                    updateEmployeeRole();
                    break;
                case "View Employees by Manager":
                    viewEmployeesByManager();
                    break;
                case "View Employees by Department":
                    viewEmployeesByDepartment();
                    break;
                case "Delete Departments | Roles | Employees":
                    deleteDepartmentsRolesEmployees();
                    break;
                case "Exit":
                    db.end();
                    console.log("Goodbye!");
                    break;
            }
        });
}

function viewAllDepartments() {
    const department = new Department();
    department.viewAll()
        .then(([rows]) => {
            console.table(rows);
        })
        .then(() => mainMenu())
        .catch(err => console.error(err));
}

function viewAllRoles() {
    const role = new Role();
    role.viewAll()
        .then(([rows]) => {
            console.table(rows);
        })
        .then(() => mainMenu())
        .catch(err => console.error(err));
}

function viewAllEmployees() {
    const employee = new Employee();
    employee.viewAll()
        .then(([rows]) => {
            console.table(rows);
        })
        .then(() => mainMenu())
        .catch(err => console.error(err));
}

function addDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'What is the name of the department?',
    }).then(answer => {
        const department = new Department();
        return department.add(answer.name);
    }).then(() => {
        console.log('Department added successfully');
        mainMenu();
    }).catch(err => console.error(err));
}

function addRole() {
    
    const department = new Department();
    department.viewAll().then(([departments]) => {
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));

        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the title of the role?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary for the role?',
            },
            {
                type: 'list',
                name: 'departmentId',
                message: 'Which department does the role belong to?',
                choices: departmentChoices
            }
        ]).then(answers => {
            const role = new Role();
            return role.add(answers.title, answers.salary, answers.departmentId);
        }).then(() => {
            console.log('Role added successfully');
            mainMenu();
        }).catch(err => console.error(err));
    });
}


function deleteDepartmentsRolesEmployees() {
    inquirer.prompt({
        type: 'list',
        name: 'entity',
        message: 'What would you like to delete?',
        choices: [
            'Department',
            'Role',
            'Employee',
        ],
    }).then(answer => {
        switch (answer.entity) {
            case 'Department':
                deleteDepartment();
                break;
            case 'Role':
                deleteRole();
                break;
            case 'Employee':
                deleteEmployee();
                break;
            default:
                console.log(`Invalid entity: ${answer.entity}`);
                mainMenu();
                break;
        }
    });

}

function deleteDepartment() {
    const department = new Department();
    department.viewAll().then(([departments]) => {
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));

        return inquirer.prompt({
            type: 'list',
            name: 'departmentId',
            message: 'Which department would you like to delete?',
            choices: departmentChoices
        });
    }).then(answer => {
        return department.delete(answer.departmentId);
    }).then(() => {
        console.log('Department deleted successfully');
        mainMenu();
    }).catch(err => console.error(err));
}

function deleteRole() {
    const role = new Role();
    role.viewAll().then(([roles]) => {
        const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
        }));

        return inquirer.prompt({
            type: 'list',
            name: 'roleId',
            message: 'Which role would you like to delete?',
            choices: roleChoices
        });
    }).then(answer => {
        return role.delete(answer.roleId);
    }).then(() => {
        console.log('Role deleted successfully');
        mainMenu();
    }).catch(err => console.error(err));
}

function deleteEmployee() {
    const employee = new Employee();
    employee.viewAll().then(([employees]) => {
        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        return inquirer.prompt({
            type: 'list',
            name: 'employeeId',
            message: 'Which employee would you like to delete?',
            choices: employeeChoices
        });
    }).then(answer => {
        return employee.delete(answer.employeeId);
    }).then(() => {
        console.log('Employee deleted successfully');
        mainMenu();
    }).catch(err => console.error(err));
}



function addEmployee() {
    // Get roles and managers for choices
    const role = new Role();
    const employee = new Employee();
    Promise.all([role.viewAll(), employee.viewAll()]).then(([[roles], [employees]]) => {
        const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
        }));

        const managerChoices = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
        managerChoices.unshift({ name: "None", value: null });

        return inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?",
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?",
            },
            {
                type: 'list',
                name: 'roleId',
                message: "What is the employee's role?",
                choices: roleChoices
            },
            {
                type: 'list',
                name: 'managerId',
                message: "Who is the employee's manager?",
                choices: managerChoices
            }
        ]);
    }).then(answers => {
        return employee.add(answers.firstName, answers.lastName, answers.roleId, answers.managerId);
    }).then(() => {
        console.log('Employee added successfully');
        mainMenu();
    }).catch(err => console.error(err));
}



mainMenu();
