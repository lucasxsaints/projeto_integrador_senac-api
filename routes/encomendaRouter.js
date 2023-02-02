const router = require('express').Router();
const auth = require('../services/auth');
const Encomenda = require('../models/Encomenda');

router.post("/encomenda/add", async function (req, res) {
    try {
        const encomenda = monteEncomenda(req);
        validEncomenda(encomenda);
        await Encomenda.create(encomenda);
        res.status(200).json({ message: "Cadastrado!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/encomenda/list/:bloco/:andar/:apartamento", async function (req, res) {
    try {
        let bloco = req.params.bloco;
        let andar = req.params.andar;
        let apartamento = req.params.apartamento;
        let Encomenda = await Encomenda.find(
            { bloco: bloco, andar: andar, apartamento: apartamento, data_saida: !null },
        );
        res.status(200).json(Encomenda);
    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar!" });
    }
});

router.get("/encomenda/:id", async function (req, res) {
    try {
        let idEncomenda = req.params.id;
        let Encomenda = await Encomenda.findOne({ _id: idEncomenda });
        res.status(200).json(Encomenda);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar!" });
    }
});

router.patch("/encomenda/:id", async function (req, res) {
    try {
        // Receber e montar o usuário
        let idEncomenda = req.params.id;
        const Encomenda = monteEncomenda(req);
        // Validar os dados;
        validEncomenda(Encomenda, true);
        const updateEncomenda = await Encomenda.updateOne({ _id: idEncomenda }, Encomenda);

        if (updateEncomenda.matchedCount > 0) {
            res.status(200).json({ message: "Atualizado!" });
            return;
        } else {
            throw new Error("Erro ao atualizar!");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/encomenda/:id", async function (req, res) {
    try {
        let idEncomenda = req.params.id;
        let Encomenda = await Encomenda.findOne({ _id: idEncomenda });

        if (!Encomenda) {
            throw new Error("Erro ao remover o Encomenda!");
        }

        let deleteEncomenda = await Encomenda.deleteOne({ _id: idEncomenda });
        if (deleteEncomenda.deletedCount > 0) {
            res.status(200).json({ message: "Removido!" });
            return;
        } else {
            throw new Error("Erro ao remover o Encomenda!");
        }
        res.status(200).json(Encomenda);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Functions 
function monteEncomenda(req) {
    const {
        bloco,
        andar,
        apartamento,
        data_entrada,
        data_saida
    } = req.body;

    const Encomenda = {
        bloco,
        andar,
        apartamento,
        data_entrada,
        data_saida
    };
    return Encomenda;
}

function validEncomenda(Encomenda, update = false) {
    let error = 0;
    if (!update)
        if (!Encomenda.andar) {
            error++;
            //res.status(422).json({ message: "E-mail obrigatório!" });
            //return
        }

    if (!Encomenda.bloco) {
        error++;
        //res.status(422).json({ message: "Nome obrigatório!" });
        //return;
    }

    if (!Encomenda.apartamento) {
        error++;
        //res.status(422).json({ message: "Senha obrigatório!" });
        //return;
    }

    if (error > 0) {
        throw new Error('Error ao cadastrar ou usuário já cadastrado!');
    }
}

// async function verifyEncomendaExist(cep, idUsuario) {
//     let Encomenda = await Encomenda.exists({ cep: cep, id_Usuario: idUsuario });
//     if (Encomenda) {
//         throw new Error('Error ao cadastrar ou usuário já cadastrado!');
//     }
// }

module.exports = router;