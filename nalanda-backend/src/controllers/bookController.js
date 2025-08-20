const Book = require("../models/Book");

// @desc Add new book
// @route POST /api/books
exports.addBook = async (req, res) => {
    try {
        const { title, author, ISBN, publicationDate, genre, copies } = req.body;

        const bookExists = await Book.findOne({ ISBN });
        if (bookExists) {
            return res.status(400).json({ message: "Book with this ISBN already exists" });
        }

        const book = await Book.create({
            title,
            author,
            ISBN,
            publicationDate,
            genre,
            copies,
        });

        res.status(201).json({ message: "Book added successfully", book });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Update book
// @route PUT /api/books/:id
exports.updateBook = async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) return res.status(404).json({ message: "Book not found" });
        res.json({ message: "Book updated successfully", book: updatedBook });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Delete book
// @route DELETE /api/books/:id
exports.deleteBook = async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ message: "Book not found" });
        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc List books with filters + pagination
// @route GET /api/books
exports.listBooks = async (req, res) => {
    try {
        const { page = 1, limit = 10, genre, author } = req.query;

        let filter = {};
        if (genre) filter.genre = genre;
        if (author) filter.author = author;

        const books = await Book.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Book.countDocuments(filter);

        res.json({
            total,
            page: Number(page),
            limit: Number(limit),
            books,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Get book by ID
// @route GET /api/books/:id
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
