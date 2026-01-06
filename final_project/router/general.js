const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Use JSON.stringify to format the books object neatly with 4-space indentation
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
    res.send(books[isbn]); // Send the book details associated with that ISBN
   });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; // Retrieve the author from parameters
    const keys = Object.keys(books); // Obtain all the keys for the 'books' object
    const filtered_books = []; // Array to store matching books

    // Iterate through the 'books' object
    keys.forEach((key) => {
        if (books[key].author === author) {
            filtered_books.push(books[key]);
        }
    });

    res.send(JSON.stringify(filtered_books, null, 4)); // Send matching books
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title; // Retrieve the title from parameters
    const keys = Object.keys(books); // Obtain all the keys for the 'books' object
    const filtered_books = []; // Array to store matching books
  
    // Iterate through the 'books' object
    keys.forEach((key) => {
      if (books[key].title === title) {
        filtered_books.push(books[key]);
      }
    });
  
    res.send(JSON.stringify(filtered_books, null, 4)); // Send matching books
  });

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
    const book = books[isbn]; // Find the book associated with that ISBN
  
    if (book) {
      res.send(JSON.stringify(book.reviews, null, 4)); // Send only the reviews section
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });

module.exports.general = public_users;
