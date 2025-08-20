const express = require("express");
const {
    getMostBorrowedBooks,
    getActiveMembers,
    getBookAvailability
} = require("../controllers/reportController");

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const router = express.Router();

// Reports (Admins only)
router.get("/most-borrowed", auth, role(["Admin"]), getMostBorrowedBooks);
router.get("/active-members", auth, role(["Admin"]), getActiveMembers);
router.get("/book-availability", auth, role(["Admin"]), getBookAvailability);

module.exports = router;
