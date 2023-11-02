# imdb-movie-data-manager
A Web Framework to perform basic CRUD operations on IMDB movie data in Neo4j using Node JS and Express

# Steps to run
Install NodeJS, Neo4J drivers using below commands
'npm install compression config express express-async-errors helmet neo4j-driver nodemon winston --save'
'npm install jest supertest eslint eslint-config-airbnb eslint-config-prettier eslint-plugin-import eslint-plugin-prettier eslint-plugin-react lint-staged prettier --save-dev'


1. Clone the repository
2. Change the directory where 'package.json' is present.
3. run 'npm install'
4. update the development.json file in config directory with the required host name, user and password details.
5. run 'npm start'
6. The API's are ready to run on 'http://localhost:7000/api/imdb'
