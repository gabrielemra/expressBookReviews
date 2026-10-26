const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Registrar um novo usuário
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "Usuário registrado com sucesso. Faça o login."});
        } else {
            return res.status(404).json({message: "Usuário já existe!"});
        }
    }
    return res.status(404).json({message: "Erro ao registrar o usuário."});
});

// Tarefa 1 & Tarefa 10: Obter a lista de livros disponíveis na loja usando Async-Await
public_users.get('/', async function (req, res) {
    try {
        // Simulando chamada assíncrona ou retornando diretamente via Promise/Async
        return res.status(200).send(JSON.stringify(books, null, 4));
    } catch (error) {
        return res.status(500).json({message: "Erro ao obter os livros"});
    }
});

// Tarefa 2 & Tarefa 11: Obter os detalhes do livro com base no ISBN usando Async-Await
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const getBookByIsbn = new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject({status: 404, message: "Livro não encontrado"});
            }
        });
        
        let book = await getBookByIsbn;
        return res.status(200).json(book);
    } catch (error) {
        return res.status(error.status || 500).json({message: error.message});
    }
});
  
// Tarefa 3 & Tarefa 12: Obter os detalhes do livro com base no autor usando Async-Await
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const getBookByAuthor = new Promise((resolve, reject) => {
            let filtered_books = [];
            let keys = Object.keys(books);
            keys.forEach((key) => {
                if(books[key].author === author) {
                    filtered_books.push(books[key]);
                }
            });
            if(filtered_books.length > 0) {
                resolve(filtered_books);
            } else {
                reject({status: 404, message: "Autor não encontrado"});
            }
        });

        let filtered_books = await getBookByAuthor;
        return res.status(200).json(filtered_books);
    } catch (error) {
        return res.status(error.status || 500).json({message: error.message});
    }
});

// Tarefa 4 & Tarefa 13: Obter todos os livros com base no título usando Async-Await
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const getBookByTitle = new Promise((resolve, reject) => {
            let filtered_books = [];
            let keys = Object.keys(books);
            keys.forEach((key) => {
                if(books[key].title === title) {
                    filtered_books.push(books[key]);
                }
            });
            if(filtered_books.length > 0) {
                resolve(filtered_books);
            } else {
                reject({status: 404, message: "Título não encontrado"});
            }
        });

        let filtered_books = await getBookByTitle;
        return res.status(200).json(filtered_books);
    } catch (error) {
        return res.status(error.status || 500).json({message: error.message});
    }
});

// Tarefa 5: Obter as avaliações de um livro com base no ISBN
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({message: "Livro não encontrado"});
    }
});

module.exports.general = public_users;