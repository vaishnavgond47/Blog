# BloggingMERN

A MERN Stack Blogging Project with Redux Store.

In this application:
- Admin can Add, Edit, Delete any Posts, Comments, Users.
- Users can Sign In to read full articles.

## Admin Login

To log in as an Admin, you need to manually set the Admin entry to `true` in MongoDB.

## Admin Credentials for deployed porject

- **Email:** pranjal@123
- **Password:** pranjal

## Installation Process

1. git clone https://github.com/Pranjal-2004/bloggingmern.git
2. cd bloggingmern
3. cd client
4. npm install
5. cd ..
6. cd api
7. npm install

## Create a .env file in the api directory and add the following credentials:
- MONGO=<Your MongoDB URL>
- JWT_SECRET=<Your JWT Secret>

## Running the Application
1. Terminal 1:
 - cd client
 - npm run dev
2. Terminal 2:
 - cd api
 - node index.js




