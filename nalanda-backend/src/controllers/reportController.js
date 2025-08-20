const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const User = require("../models/User");

// @desc Most Borrowed Books
// @route GET /api/reports/most-borrowed
exports.getMostBorrowedBooks = async (req, res) => {
    try {
        const report = await Borrow.aggregate([
            { $group: { _id: "$bookId", borrowCount: { $sum: 1 } } },
            { $sort: { borrowCount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book",
                },
            },
            { $unwind: "$book" },
            {
                $project: {
                    _id: 0,
                    title: "$book.title",
                    author: "$book.author",
                    borrowCount: 1,
                },
            },
        ]);

        res.json({ mostBorrowedBooks: report });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Most Active Members
// @route GET /api/reports/active-members
exports.getActiveMembers = async (req, res) => {
    try {
        const report = await Borrow.aggregate([
            { $group: { _id: "$userId", totalBorrows: { $sum: 1 } } },
            { $sort: { totalBorrows: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 0,
                    name: "$user.name",
                    email: "$user.email",
                    totalBorrows: 1,
                },
            },
        ]);

        res.json({ activeMembers: report });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Book Availability Summary
// @route GET /api/reports/book-availability
exports.getBookAvailability = async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments();
        const borrowedBooks = await Borrow.countDocuments({ returnDate: null });

        const availability = {
            totalBooks,
            borrowedBooks,
            availableBooks: totalBooks - borrowedBooks,
        };

        res.json(availability);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
