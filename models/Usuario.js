const mongoose = require("mongoose");

const Usuario = mongoose.model("Usuario", {
    nome: String,
    email: {
        type: String,
        unique: true,
        required: true,
    },
    senha: String,
    telefone: String,
    apartamento: String,
    bloco: String,
    andar: String,
    perfil: {
        type: Number,
        default: 1 //roles: 0 = admin && 1 = usuario 
    },
    ative: {
        type: Boolean,
        default: true
    }
});

module.exports = Usuario;