// src/app.js
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const errorHandler = require("./utils/errorHandler");
const graphqlMiddleware = require("./graphql/index");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const borrowRoutes = require("./routes/borrowRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/graphql", graphqlMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/reports", reportRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
