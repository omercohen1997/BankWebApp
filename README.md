# OC Bank Web Application

OC Bank is a secure role-based access banking application with functionalities like signup, login, transactions.

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
         
