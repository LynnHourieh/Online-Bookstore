# Online-Bookstore
Description: Online bookstore application where users can browse and purchase books. 
## PROJECT :
this project is a MERN stack 
frontend : React
Backend: Express js , node js
Database: Mongodb

## RUN LOCALLY
### 1. Clone repository :
git clone https://github.com/LynnHourieh/Online-Bookstore.git

### 2.Create .env file

duplicate .env.example in backend folder and rename it to .env

### 3. Setup MongoDB

- In .env file update MONGODB_URI=mongodb+srv://your-db-connection

### 4. Run Backend

```
$ cd backend
$ npm install
$ npm start
```

### 5. Run Frontend

```
# open new terminal
$ cd frontend
$ npm install
$ npm start
```

### 6. Seed Users and Products

- Run this on browser: http://localhost:5000/api/seed
-it will return users and products

### 7. To sign in as admin 
-email : Harley@gmail.com
-password: 123456789