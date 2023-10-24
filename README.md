# ShoppingApp

Clothes shopping app which uses C# and .Net for the backend and postgres for the DB, Whereas the frontend is made with Typescript/React. Utilizes MVC structure, CRUD and UI/UX elements, with added Docker configuration.
---------------------------
Build locally:

Install postgres
Create DB called ShoppingApp
Run init.sql
Run Entity Framework Migrations for ApplicationDBContext.cs
Add DB connection string to appsettings.json

Build and run using docker:

Install docker image using docker-compose up --build

---------------------------
Login info to test admin management abilities:

string userName = "admin";
string password = "Admin@123";
