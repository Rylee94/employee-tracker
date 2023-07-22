-- Insert departments
INSERT INTO departments (name) VALUES
  ('Department 1'),
  ('Department 2'),
  ('Department 3');

-- Insert roles
INSERT INTO role (title, salary, department_id) VALUES
  ('Role 1', 50000.00, 1),
  ('Role 2', 60000.00, 1),
  ('Role 3', 70000.00, 2),
  ('Role 4', 80000.00, 2),
  ('Role 5', 90000.00, 3);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Michael', 'Johnson', 3, NULL),
  ('Emily', 'Williams', 4, 3);
