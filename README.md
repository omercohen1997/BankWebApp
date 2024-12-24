# OC Bank Web Application

OC Bank is a secure role-based access banking application with functionalities like signup, login, send money, watching transactions.
This application includes user authentication and authorization, transaction management, and error handling.
* Backend: Node.js, Express.js, MongoDB
* FrontEnd: React.js, Axios


## Project Structure
```bash
BankWebApp/
    ├── Backend/                # Backend server-side code
    │   ├── controllers/        # Handling the logic for different routes
    │   ├── models/             # Mongoose models defining database schemas
    │   ├── routes/             # Route definitions for the server API endpoints
    │   ├── config/             # Configuration files (e.g., database connection, cors)
    │   ├── logs/               # Logs track errors and requests for monitoring
    │   ├── middleware/         # Handles authentication, role verification, and logging between requests
    │   ├── services/           # Handle external tasks like sending emails
    │   ├── utils/              # Helper functions and regular expressions
    │   └── server.js           # Main server file to start the backend application
    │
    ├── frontend/               # Frontend client-side code
    │   ├── public/             # Public assets like images and the main HTML file
    │   ├── src/                # Main source code for the React application
    │   │   ├── components/     # Reusable React components
    │   │   ├── context/        # Stores the AuthProvider for managing authentication context
    │   │   ├── api/            # Custom configuration to make HTTP requests to the server
    │   │   ├── App/            # Sets up routes and handles navigation
    │   │   └── index.js        # Main React app component
    │
    └── README.md
```
## Features
* Signup: User can signup with email, password, phone number. The user will receive passcode in his email
  in order to handle user authentication.

* Login: User can login to the app by entering email and passowrd. After that JWT will be created and added to the browser cookie.
  
* Money Transactions: Users can send money to other registered users with ACID-compliant operations for reliable transactions.
  
# Prerequisites
Before running the application, ensure you have the following installed:
Node.js 
MongoDB
npm

1. Clone the repository:
```bash
git clone git clone https://github.com/omercohen1997/BankWebApp.git
``` 
2. Navigate to the project directory:
```bash
cd BankWebApp
```

3. Install Dependencies:
* Navigate to the Backend directory and install dependencies:
```bash
cd Backend
npm install
   ```

* Navigate to the Frontend directory and install dependencies:
```bash
cd ../Frontend
npm install
 ```

4. Set Up Environment Variables:
    This project uses a .env file to store sensitive configuration data. You need to create a .env file in the Backend directory and populate it with your own values.
    Note: Do not commit the .env file to git or any other version control. This file should be included in the .gitignore to prevent it from being uploaded to GitHub.
    
### Port
The port which your applicaiton will run (default is 3500)

```bash
PORT=<server_port>
```

### Database Configuration
The connection string for your MongoDB 
```bash
DATABASE_URI=<your_mongodb_connection_string>
```
 ### JWT Configuration
This variable stores the secret key used to sign and verify JSON Web Tokens (JWT) for user authentication and authorization. The secret key ensures that
the tokens are secure and cannot be tampered with.
You can easily generate a long, random, and strong string by running this in your terminal:

```bash
 node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
 ```

```bash
JWT_ACCESS_TOKEN=<your_jwt_access_token_secret_key>
```
### Email Configuration
For sending an email with passcode to a user after he signup inorder to verify him.
```bash
EMAIL_USER=<your_email_address>
EMAIL_PASSWORD=<your_email_password>
 ```

# API Endpoints
### Authentication Routes
* POST /auth/login: Log in a user.
* POST /auth/register: Register a new user.
* POST /auth/logout: logout from the application.

### User Management Routes 
* GET /users/balance: Get the user balance.
* PUT /users/change-password: Update user passowrd.
         
### User Transaction Routes 
* GET /transactions: Retrieve all user transactions.
* POST /transactions/send-money: Send money to another user.

### Admin Routes
* GET /users/all-users: Retrieve all the users information.
* DELETE /users/:id: Delete user information by id.
* GET /users/:id: Get user by id.
* POST /users/create-admin: Create new admin.
* GET /users/all-transactions: Retrieve all the users transactions.
* GET /transactions/:id: Get user transcation by id.



