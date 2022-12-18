SELECT role.id AS id, title, department.name AS department, salary
FROM role
JOIN department ON role.department_id = department.id
ORDER BY role.id ASC;