<h1>DAOGEN</h1>

This project aim to easily generate an API from a MySQL database.

<h3>Step by step usage</h3>

Step1 => Install:

    npm i simple-dao-generator
    
    
Step2 => view all command you can use:
    
    DAOGEN --help
    
Step3 => If you create a totally new project, you need to start with:

    DAOGEN --init
    
It will create a .env for you where you need to inform your database connection

If your Database already exists you can go to Step 6

Step 4 => (Don't forget to write your database_name in .env)

	DAOGEN --createDatabase

Step 5 => For now this libs can't create table for you, so you need to create your table with SQL query
	

Step 6 => After you can use:
  
  	DAOGEN --createDAO
	
It will create DAO and Model for you from the table you have in your Database

Step 7 => If you want to use these DAO and Model in an API, we have a command for you to generate all the API and the routes to interact with your databases:

	DAOGEN --createServer
    
Congratulations !! 

Step 8 => If it works, you can finally use 

	nodemon ./src/server/app.js
	
Your API run on 127.0.0.1:3000 (if you want to change port, go in src/server/app.js)

For this example, we have a table with users:

<h3>Routes List </h3>

To get all users:

	127.0.0.1:3000/users/all
	
To get one user: [GET]
	
	127.0.0.1:3000/users/one/{id}
	
To create a new user: [POST]

	127.0.0.1:3000/users/new
	
	with a body where you find data related to your user (example.) :
	
		{
    		"lastName": "Jacques",
    		"firstName": "Jean",
    		"address" : "22 route du pape",
    		"city" : "Toulon"
		}

To delete a user :

	127.0.0.1:3000/users/delete/{id}
	
	
