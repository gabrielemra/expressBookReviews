const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // Verifica se a sessão contém a autorização
    if(req.session.authorization) {
        token = req.session.authorization['accessToken'];
        // Valida o token JWT
        jwt.verify(token, "access", (err, user)=>{
            if(!err){
                req.user = user;
                next(); // Permite prosseguir para a rota solicitada
            } else {
                return res.status(403).json({message: "Usuário não autenticado"})
            }
        });
    } else {
        return res.status(403).json({message: "Usuário não logado"})
    }
});
 
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));