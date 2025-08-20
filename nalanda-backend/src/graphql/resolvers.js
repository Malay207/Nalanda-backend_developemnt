const User = require("../models/User");
const Book = require("../models/Book");
const Borrow = require("../models/Borrow");
const bcrypt = require("bcryptjs");
const { generateToken, verifyToken } = require("../config/jwt");

const resolvers = (req) => ({
    // Queries
    books: async ({ genre, author, page = 1, limit = 10 }) => {
        let filter = {};
        if (genre) filter.genre = genre;
        if (author) filter.author = author;

        return await Book.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit));
    },

    book: async ({ id }) => await Book.findById(id),

    borrowHistory: async (args, context) => {
        if (!req.user) throw new Error("Unauthorized");
        return await Borrow.find({ userId: req.user._id }).populate("bookId");
    },

    mostBorrowedBooks: async () => {
        const result = await Borrow.aggregate([
            { $group: { _id: "$bookId", borrowCount: { $sum: 1 } } },
            { $sort: { borrowCount: -1 } },
            { $limit: 5 },
        ]);

        return await Book.find({ _id: { $in: result.map(r => r._id) } });
    },

    activeMembers: async () => {
        const result = await Borrow.aggregate([
            { $group: { _id: "$userId", totalBorrows: { $sum: 1 } } },
            { $sort: { totalBorrows: -1 } },
            { $limit: 5 },
        ]);

        return await User.find({ _id: { $in: result.map(r => r._id) } });
    },

    bookAvailability: async () => {
        const totalBooks = await Book.countDocuments();
        const borrowedBooks = await Borrow.countDocuments({ returnDate: null });
        return { totalBooks, borrowedBooks, availableBooks: totalBooks - borrowedBooks };
    },

    // Mutations
    register: async ({ name, email, password, role }) => {
        const existing = await User.findOne({ email });
        if (existing) throw new Error("User already exists");

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, role: role || "Member" });
        return user;
    },

    login: async ({ email, password }) => {
        const user = await User.findOne({ email });
        if (!user) throw new Error("Invalid credentials");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        return generateToken({ id: user._id, role: user.role });
    },

    addBook: async ({ title, author, ISBN, publicationDate, genre, copies }) => {
        const book = await Book.create({ title, author, ISBN, publicationDate, genre, copies });
        return book;
    },

    updateBook: async ({ id, ...updates }) => {
        return await Book.findByIdAndUpdate(id, updates, { new: true });
    },

    deleteBook: async ({ id }) => {
        await Book.findByIdAndDelete(id);
        return "Book deleted successfully";
    },

    borrowBook: async ({ bookId }) => {
        if (!req.user) throw new Error("Unauthorized");
        const book = await Book.findById(bookId);
        if (!book || book.copies <= 0) throw new Error("Book unavailable");

        const borrow = await Borrow.create({ userId: req.user._id, bookId });
        book.copies -= 1;
        book.borrowedCount += 1;
        await book.save();
        return borrow;
    },

    returnBook: async ({ bookId }) => {
        if (!req.user) throw new Error("Unauthorized");

        const borrow = await Borrow.findOne({ userId: req.user._id, bookId, returnDate: null });
        if (!borrow) throw new Error("No active borrow found");

        borrow.returnDate = new Date();
        await borrow.save();

        const book = await Book.findById(bookId);
        book.copies += 1;
        await book.save();

        return borrow;
    },
});

module.exports = resolvers;
