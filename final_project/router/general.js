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
      if (isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify({books}, null, 4)));
  });

  get_books.then(() => console.log("Promise for Task 10 resolved"));
});

// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const get_book_details = new Promise((resolve, reject) => {
    let book = books[isbn];
    if (book) {
      resolve(res.send(JSON.stringify(book, null, 4)));
    } else {
      reject(res.status(404).json({message: "Book not found"}));
    }
  });

  get_book_details
    .then(() => console.log("Promise for Task 11 resolved"))
    .catch((err) => console.log("Book not found"));
});
  
// Get book details based on author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  
  const get_books_by_author = new Promise((resolve, reject) => {
    let keys = Object.keys(books);
    let filtered_books = keys
      .filter(key => books[key].author === author)
      .map(key => books[key]);

    if (filtered_books.length > 0) {
      resolve(filtered_books);
    } else {
      reject({ message: "No books found by this author" });
    }
  });

  get_books_by_author
    .then((result) => {
      res.send(JSON.stringify(result, null, 4));
      console.log("Promise for Task 12 resolved");
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

// Get book details based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  
  const get_books_by_title = new Promise((resolve, reject) => {
    let keys = Object.keys(books);
    let filtered_books = keys
      .filter(key => books[key].title === title)
      .map(key => books[key]);

    if (filtered_books.length > 0) {
      resolve(filtered_books);
    } else {
      reject({ message: "No books found with this title" });
    }
  });

  get_books_by_title
    .then((result) => {
      res.send(JSON.stringify(result, null, 4));
      console.log("Promise for Task 13 resolved");
    })
    .catch((err) => {
      res.status(404).json(err);
    });
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
