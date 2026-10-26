# Express Book Reviews

API REST em Node.js e Express para consulta de livros e gerenciamento de resenhas, com registro e login de usuários via JWT. Projeto final do curso *Developing Back-End Apps with Node.js and Express* (IBM, via Coursera).

## O que a API faz

**Rotas públicas**
- Listar todos os livros
- Buscar livro por ISBN
- Buscar livros por autor
- Buscar livros por título
- Consultar as resenhas de um livro
- Registrar novo usuário

**Rotas protegidas (exigem login)**
- Fazer login e receber um token JWT
- Adicionar ou modificar uma resenha
- Excluir a própria resenha

O arquivo `general.js` contém as consultas aos livros com chamadas assíncronas.

## O que pratiquei

- Criação de rotas com Express
- Autenticação com JWT e sessões
- Rotas protegidas por middleware
- Chamadas assíncronas em Node.js
- Testes de API com cURL

## Observação

Projeto de estudo, feito a partir do template da IBM Skills Network.
