# sql-employee-manager

[![License](https://img.shields.io/badge/License-MIT_License-blue.svg)](https://mit-license.org/)

## Description

The objective of this project was to create a command-line application that allows the user to complete the following tasks related to the company db:

- View All Departments or Add a Department
- View All Roles or Add a Role
- View All Employees, Add an Employee or Update an Employee's Role

This project uses inquirer to ask the user to select one of the tasks listed above. If one of the "View All" tasks is selected, a table with the selected information be shown in the terminal using console.table. However, console.table just handles the dispaly of the table, while mysql2 is used to connect to the database and run the queries. If the user selects one of the "Add" or "Update" tasks, they will be prompted to provide any necessary details. Any changes are then saved in the company_db database. 

There were a couple of challenges encountered while working on this project.
- When adding roles or employees, some of the inquirer list choices needed to be queried from the database. Initially when the database is queried using SELECT, it would return an array of objects which isn't compatible with inquirer. The array of objects would then need to be mapped to another array before it could be used.
- When selecting the list choices that were queried from the database, the text values were not in the format needed to be inserted into the database. The text value would need to be searched in the database to return the numeric id, which could then be used in the insert.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

## Installation

In order to use this application the user needs to install the Node dependencies with npm, by running the following command in their command-line - “npm install”.

## Usage

Once the dependencies are installed, the user should use mysql to run the schema.sql file to set up the database and tables. If the user would also like to input some test records to the tables, a seeds.sql file is also provided. After these steps, the user can enter the following command into the command-line to being seeing the prompts from inquirer - "node index.js".

A video walkthrough of the command-line application being used is included at the link below:<br />
https://user-images.githubusercontent.com/111654725/208801201-5adfde6c-ad71-4cc5-bf08-d970411c57a0.mp4

## License

This project is licensed under the terms of the MIT License. The license badge at the top of this README includes a link to the description of the license.

## Contributing

N/A

## Tests

N/A

## Questions

If you have any questions about this project, please reach out via email. <br />
Email: parkerjmathis@gmail.com
<br />
GitHub: (https://github.com/markerpathis)
