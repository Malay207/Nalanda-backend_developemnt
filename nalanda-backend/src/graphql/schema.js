const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    ISBN: String!
    publicationDate: String!
    genre: String
    copies: Int!
    borrowedCount: Int
  }

  type Borrow {
    id: ID!
    user: User!
    book: Book!
    borrowDate: String!
    returnDate: String
  }

  type Query {
    books(genre: String, author: String, page: Int, limit: Int): [Book]
    book(id: ID!): Book
    borrowHistory: [Borrow]
    mostBorrowedBooks: [Book]
    activeMembers: [User]
    bookAvailability: BookAvailability
  }

  type Mutation {
    register(name: String!, email: String!, password: String!, role: String): User
    login(email: String!, password: String!): String
    addBook(title: String!, author: String!, ISBN: String!, publicationDate: String!, genre: String, copies: Int!): Book
    updateBook(id: ID!, title: String, author: String, ISBN: String, publicationDate: String, genre: String, copies: Int): Book
    deleteBook(id: ID!): String
    borrowBook(bookId: ID!): Borrow
    returnBook(bookId: ID!): Borrow
  }

  type BookAvailability {
    totalBooks: Int!
    borrowedBooks: Int!
    availableBooks: Int!
  }
`);

module.exports = schema;
