const mongoose = require("mongoose");

const Address = mongoose.model("Address", {
    cep: String,
    logradouro: String,
    bairro: String,
    localidade: String,
    uf: String,
    numero: String,
    complemento: String,
    id_user: String,
    padrao: {
        type: Boolean,
        default: false,
    }
});

module.exports = Address;