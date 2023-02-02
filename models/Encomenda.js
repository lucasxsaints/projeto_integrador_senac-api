const mongoose = require("mongoose");

const Encomenda = mongoose.model("Encomenda", {
    bloco: String,
    andar: String,
    apartamento: String,
    data_entrada: {
        type: Date,
        default: new Date(),
    },
    data_saida: Date,
    ativo: {
        type: Boolean,
        default: true,
    }
});

module.exports = Encomenda;