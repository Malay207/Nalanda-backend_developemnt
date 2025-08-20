const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    ISBN: { type: String, required: true, unique: true },
    publicationDate: { type: Date, required: true },
    genre: { type: String },
    copies: { type: Number, required: true },
    borrowedCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
