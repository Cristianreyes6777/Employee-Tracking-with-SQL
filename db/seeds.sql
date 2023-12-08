-- Insert into department
INSERT INTO department (name)
VALUES 
('Engineering'),
('Human Resources'),
('Marketing'),
('Sales');

-- Insert into role
INSERT INTO role (title, salary, department_id)
VALUES 
('Software Engineer', 70000, 1),
('Senior Software Engineer', 90000, 1),
('HR Manager', 75000, 2),
('Marketing Coordinator', 60000, 3),
('Sales Representative', 55000, 4);

-- Insert into employee
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Jane', 'Doe', 1, NULL),
('John', 'Smith', 2, NULL),
('Emily', 'Johnson', 3, NULL),
('Michael', 'Brown', 4, NULL),
('David', 'Wilson', 5, 1);
