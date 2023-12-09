const connection = require('../db/connection');

class Role {
    // View all roles
    viewAll() {
        return connection.promise().query(
            "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id"
        );
    }

    // Add a role
    add(title, salary, departmentId) {
        return connection.promise().query(
            "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
            [title, salary, departmentId]
        );
    }

    // Calculate total utilized budget of a department
    calculateBudget(departmentId) {
        return connection.promise().query(
            "SELECT department.name, SUM(role.salary) AS total_budget FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.id = ?",
            [departmentId]
        );
    }

    // Delete a role
    delete(roleId) {
        return connection.promise().query("DELETE FROM role WHERE id = ?", [roleId]);
    }


}

module.exports = Role;
