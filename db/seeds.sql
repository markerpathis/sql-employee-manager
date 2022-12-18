INSERT INTO department (name)
VALUES ('Engineering'),
       ('Finance'),
       ('Legal'),
       ('Sales');      

INSERT INTO role (title, salary, department_id)
VALUES ('Lead Engineer', 120000, 1),
       ('Software Engineer', 80000, 1),
       ('Senior Accountant', 100000, 2),      
       ('Accountant', 100000, 2),
       ('Legal Manager', 180000, 3),
       ('Lawyer', 150000, 3),
       ('Sales Lead', 100000, 4),          
       ('Salesperson', 80000, 4);          

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Tony', 'Hawk', 1, NULL),
       ('Bob', 'Burnquist', 2, 1),
       ('Kareem', 'Campbell', 3, NULL),
       ('Rune', 'Glifberg', 4, 3),
       ('Bucky', 'Lasek', 5, NULL),
       ('Chad', 'Muska', 6, 5),
       ('Andrew', 'Reynolds', 7, NULL),
       ('Geoff', 'Rowley', 8, 7),
       ('Elissa', 'Steamer', 2, 1),
       ('Jamie', 'Thomas', 2, 1);  

