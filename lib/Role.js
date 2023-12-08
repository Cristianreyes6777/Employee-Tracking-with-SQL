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
}

module.exports = Role;
