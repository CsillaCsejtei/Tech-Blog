# Full Stack Tech Blog Application

## Description

A full-stack blogging platform built with Node.js, Express.js, MySQL, and Sequelize. Users can register, log in, read, filter by categories, create, edit, and delete their own blog posts. The app features user authentication and persistent storage with a MySQL database.


### Installation Steps

1. **Copy the `.env.example` file** and rename it to `.env`.
2. **Open MySQL in the terminal:**

```bash
mysql -u root -p
```

3. **Run the following command to set up the database:**

```bash
source db/schema.sql;
```

4. **Exit MySQL**

```bash
quit;
```

5. **Update the .env file and set DB_PASSWORD to your MySQL password.**
6. **Install dependencies**

```bash
npm install
```

7. **Seed the database with test data:**

```bash
npm run seed
```

8. **Run the application**

```bash
npm start
```

9. **Open the application in your browser:**

```browser
http://localhost:3010
```

### Usage:

After launching the app, users can:
- Register, log in and log out securely
- Create blog posts
- Edit or delete their own posts
- View all posts filtered by category

All actions are saved to the MySQL database and immediately reflected in the app.

### Deployment:

This application is deployed on Render.
🔗 Live site: 
🔗 GitHub repo: https://github.com/CsillaCsejtei
#### Licence:

This project is licensed under the MIT License.

#### Author:

Csilla Csejtei


