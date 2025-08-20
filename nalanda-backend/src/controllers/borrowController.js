const Book = require("../models/Book");
const Borrow = require("../models/Borrow");

// @desc Borrow a book
// @route POST /api/borrow/:bookId
exports.borrowBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user._id;

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: "Book not found" });

        if (book.copies <= 0) {
            return res.status(400).json({ message: "No copies available" });
        }

        // Create borrow record
        const borrow = await Borrow.create({ userId, bookId });

        // Update book copies and borrowed count
        book.copies -= 1;
        book.borrowedCount += 1;
        await book.save();

        res.status(201).json({ message: "Book borrowed successfully", borrow });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Return a book
// @route POST /api/borrow/return/:bookId
exports.returnBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user._id;

        const borrow = await Borrow.findOne({
            userId,
            bookId,
            returnDate: null,
        });

        if (!borrow) {
            return res.status(400).json({ message: "No active borrow found for this book" });
        }

        borrow.returnDate = new Date();
        await borrow.save();

        // Update book copies
        const book = await Book.findById(bookId);
        book.copies += 1;
        await book.save();

        res.json({ message: "Book returned successfully", borrow });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Get borrow history for member
// @route GET /api/borrow/history
exports.getBorrowHistory = async (req, res) => {
    try {
        const userId = req.user._id;

        const history = await Borrow.find({ userId })
            .populate("bookId", "title author ISBN")
            .sort({ borrowDate: -1 });

        res.json({ count: history.length, history });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
