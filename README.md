Setup Application - 

1) Clone github repository
2) Install all dependencies - npm i
3) Create .env file
4) Add data in .env file
5) Run command - npm start
6) Attached api documentation with email.
7) Used aws RDS service for database.
8) Base url - localhost:3000
9) Created CICD Pipline for this Application.


.env

PORT = 3000
DB = game_management_db
USER= rajatkhobragade
PASSWORD = rajatrajat12
HOST = database-1.c5miqk2sydop.ap-south-1.rds.amazonaws.com
SECRET = 314563BHGfhjgf5623vghfds


Base Url - localhost:3000

User routes - 
Register(POST) - /users/register
Login (POST)- /users/login
Get Profile (GET)- /users/profile

Game routes

Create Game (POST)- /games/game
Get All Game (GET) - /games/game
Update Game (PUT) - /games/game/:id
Delete Game (Delete) - /games/game/:id

Score route

Add Score(POST) - /scores/score
Get All Scores By Users (GET)- /scores/score/user/:userId
Get All Scores By Game (GET)- /scores/score/user/:gameId
