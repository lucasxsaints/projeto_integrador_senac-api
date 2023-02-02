// Inicio do codigo
const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const auth = require('./services/auth');

const app = express();

app.use(cors());

//Configurando Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Rotas
app.get("/", auth.checkToken, function (req, res) {
    console.log("Request:", req);
    res.status(200).json({ message: "Bem vindo!" });
});

app.use(express.static('./public'));
const UsuarioRouter = require("./routes/usuarioRouter");
const EncomendaRouter = require("./routes/encomendaRouter");

app.use(UsuarioRouter);
app.use(EncomendaRouter);

//Banco de Dados
mongoose.set('strictQuery', false);
mongoose.connect(process.env.URI)
    .then(result => {
        console.log("Conectado!");
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.error("Error: ", err.message);
    });
