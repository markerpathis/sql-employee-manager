-- ORDER BY mgr.first_name ASC

-- SELECT emp.id AS id, emp.first_name, emp.last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(mgr.first_name, " ", mgr.last_name) AS Manager
-- FROM employee emp
-- JOIN role ON emp.role_id = role.id
-- JOIN department ON role.department_id = department.id
-- LEFT JOIN employee mgr ON emp.manager_id = mgr.id
-- ORDER BY emp.id ASC;

-- SELECT emp.id AS id, emp.first_name, emp.last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(mgr.first_name, " ", mgr.last_name) AS Manager
-- FROM employee emp
-- JOIN role ON emp.role_id = role.id
-- JOIN department ON role.department_id = department.id
-- LEFT JOIN employee mgr ON emp.manager_id = mgr.id
-- ORDER BY emp.id ASC;
