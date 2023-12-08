const connection = require('../db/connection');

class Employee {
    // View all employees
    viewAll() {
        return connection.promise().query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id"
        );
    }

    // Add an employee
    add(firstName, lastName, roleId, managerId) {
        return connection.promise().query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
            [firstName, lastName, roleId, managerId]
        );
    }

    // Update an employee's role
    updateRole(employeeId, newRoleId) {
        return connection.promise().query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [newRoleId, employeeId]
        );
    }
}

module.exports = Employee;
