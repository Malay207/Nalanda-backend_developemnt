# 📚 Nalanda Library Management System (Backend)

A backend system for managing a library, built with **Node.js, Express, MongoDB, and GraphQL**.  
Supports **user authentication, role-based access, book management, borrowing/returning, and reporting via MongoDB aggregation**.

---

## 🚀 Tech Stack
- **Node.js + Express** – Server framework  
- **MongoDB** – Database
- **JWT Authentication** – Secure user login  
- **REST API + GraphQL** – Dual API support  
- **Role-based Access Control** – Admin & Member  

---

## 📂 Project Structure
```
src/
 ├── config/         # DB & JWT configuration
 ├── controllers/    # REST API controllers
 ├── graphql/        # GraphQL schema & resolvers
 ├── middleware/     # Authentication & role middlewares
 ├── models/         # Mongoose schemas
 ├── routes/         # REST API routes
 ├── utils/          # Utilities (error handler, helpers)
 ├── app.js          # Express app
 └── server.js       # Server entry point
```

---

## ⚙️ Setup & Run

### 1️⃣ Clone repo & install dependencies
```bash
git clone https://github.com/your-username/nalanda-library-backend.git
cd nalanda-library-backend
npm install
```

### 2️⃣ Configure environment variables
Create `.env` file in root:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/nalanda
JWT_SECRET=yourSecretKey
```

### 3️⃣ Start server
```bash
# Development
npm run dev   # runs with nodemon

# Production
npm start
```

Server will run at 👉 `http://localhost:5000`

---

## ✨ Features
- 👤 **User Authentication**
  - Register & Login with JWT
  - Roles: **Admin**, **Member**

- 📚 **Book Management**
  - Add, List, Update, Delete books (Admin only)

- 🔄 **Borrow & Return System**
  - Members can borrow and return books
  - Tracks available copies

- 📊 **Reports (Aggregation)**
  - Most Borrowed Books
  - Active Members
  - Book Availability (Total, Borrowed, Available)

- 🌐 **GraphQL API**
  - Alternative to REST for queries/mutations

---

## 📡 REST API Endpoints

### 🔑 Auth
- **POST** `/api/auth/register` → Register user  
- **POST** `/api/auth/login` → Login user  

### 📚 Books
- **POST** `/api/books` *(Admin)* → Add book  
- **GET** `/api/books` → List all books  

### 🔄 Borrow / Return
- **POST** `/api/borrow/borrow` → Borrow a book  
- **POST** `/api/borrow/return` → Return a book  

### 📊 Reports
- **GET** `/api/reports/most-borrowed` → Most borrowed books  
- **GET** `/api/reports/active-members` → Active members  
- **GET** `/api/reports/book-availability` → Availability summary  

---

## 🌐 GraphQL API

All GraphQL queries and mutations are available at:  
👉 `http://localhost:5000/graphql`

### Example: Register
```graphql
mutation {
  register(name: "John Doe", email: "john@example.com", password: "123456", role: "Admin") {
    id
    name
    email
    role
  }
}
```

### Example: Login
```graphql
mutation {
  login(email: "john@example.com", password: "123456") {
    token
    user { id name role }
  }
}
```

### Example: Add Book (Admin)
```graphql
mutation {
  addBook(title: "The Alchemist", author: "Paulo Coelho", isbn: "1234567890", publicationDate: "1988-01-01", genre: "Fiction", copies: 5) {
    id
    title
    author
    copies
  }
}
```

### Example: Reports
```graphql
{
  bookAvailability {
    totalBooks
    borrowedBooks
    availableBooks
  }
}
```

---

## 🧪 Testing
- Use the included **Postman collection** (`Nalanda.postman_collection.json`)  
- Or test GraphQL directly at: `http://localhost:5000/graphql`  

---

## 📊 Reports via MongoDB Aggregation
- **Most Borrowed Books:** Sorted by borrow count  
- **Active Members:** Users with highest borrow activity  
- **Book Availability:** Aggregated counts of total, borrowed, available  
