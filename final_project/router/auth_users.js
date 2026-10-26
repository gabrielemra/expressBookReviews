const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Função para verificar se o usuário já existe
const isValid = (username)=>{ 
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

// Função para verificar se o usuário e senha correspondem aos registros
const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

// Tarefa 6: Registrar um novo usuário
regd_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "Usuário registrado com sucesso. Agora você pode fazer o login."});
        } else {
            return res.status(404).json({message: "Usuário já existe!"});
        }
    }
    return res.status(404).json({message: "Erro ao registrar o usuário. Forneça o nome de usuário e a senha."});
});

// Tarefa 7: Fazer login como um usuário registrado
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Erro no login. Forneça o nome de usuário e a senha."});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken,
            username
        }
        return res.status(200).json({message: "Usuário logado com sucesso!"});
    } else {
        return res.status(208).json({message: "Credenciais inválidas. Verifique usuário e senha."});
    }
});

// Tarefa 8: Adicionar ou modificar uma resenha de livro
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!review) {
        return res.status(400).json({message: "A resenha não foi fornecida nos parâmetros (query)."});
    }

    if (books[isbn]) {
        let book = books[isbn];
        book.reviews[username] = review;
        return res.status(200).json({message: "Resenha adicionada/modificada com sucesso!"});
    } else {
        return res.status(404).json({message: "Livro não encontrado."});
    }
});

// Tarefa 9: Excluir uma resenha de livro
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books[isbn]) {
        let book = books[isbn];
        if (book.reviews[username]) {
            delete book.reviews[username];
            return res.status(200).json({message: "Resenha excluída com sucesso!"});
        } else {
            return res.status(404).json({message: "Nenhuma resenha encontrada para este usuário neste livro."});
        }
    } else {
        return res.status(404).json({message: "Livro não encontrado."});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;