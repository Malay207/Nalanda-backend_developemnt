const express = require("express");
const {
    borrowBook,
    returnBook,
    getBorrowHistory
} = require("../controllers/borrowController");

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const router = express.Router();

// Borrowing operations (Members only)
router.post("/:bookId", auth, role(["Member"]), borrowBook);
router.post("/return/:bookId", auth, role(["Member"]), returnBook);
router.get("/history", auth, role(["Member"]), getBorrowHistory);

module.exports = router;
