const express = require("express");
const {
    addBook,
    updateBook,
    deleteBook,
    listBooks,
    getBookById
} = require("../controllers/bookController");

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const router = express.Router();

// Admin routes
router.post("/", auth, role(["Admin"]), addBook);
router.put("/:id", auth, role(["Admin"]), updateBook);
router.delete("/:id", auth, role(["Admin"]), deleteBook);

// Public routes
router.get("/", auth, listBooks);
router.get("/:id", auth, getBookById);

module.exports = router;
