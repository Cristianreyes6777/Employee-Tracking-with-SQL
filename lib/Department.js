const connection = require('../db/connection');

class Department {
    // View all departments
    viewAll() {
        return connection.promise().query("SELECT * FROM department");
    }

    // Add a department
    add(name) {
        return connection.promise().query("INSERT INTO department (name) VALUES (?)", [name]);
    }

    // Delete a department
    delete(departmentId) {
        return connection.promise().query("DELETE FROM department WHERE id = ?", [departmentId]);
    }
    
}

module.exports = Department;
