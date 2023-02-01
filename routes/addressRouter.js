const router = require('express').Router();
const auth = require('../services/auth');
const Address = require('../models/Address');

router.post("/address/add", async function (req, res) {
    try {

        const address = monteAddress(req);
        validAddress(address);
        await verifyAddressExist(address.cep, address.id_user);
        await Address.create(address);
        res.status(200).json({ message: "Cadastrado!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/address/list/:id", async function (req, res) {
    try {
        let idUser = req.params.id;
        let address = await Address.find({ id_user: idUser });
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar!" });
    }
});

router.get("/address/:id", async function (req, res) {
    try {
        let idAddress = req.params.id;
        let address = await Address.findOne({ _id: idAddress });
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar!" });
    }
});

router.patch("/address/:id", async function (req, res) {
    try {
        // Receber e montar o usuário
        let idAddress = req.params.id;
        const address = monteAddress(req);
        // Validar os dados;
        validAddress(address, true);
        const updateAddress = await address.updateOne({ _id: idAddress }, address);

        if (updateAddress.matchedCount > 0) {
            res.status(200).json({ message: "Atualizado!" });
            return;
        } else {
            throw new Error("Erro ao atualizar!");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/address/:id", async function (req, res) {
    try {
        let idAddress = req.params.id;
        let address = await address.findOne({ _id: idAddress });

        if (!address) {
            throw new Error("Erro ao remover o address!");
        }

        let deleteAddress = await address.deleteOne({ _id: idAddress });
        if (deleteAddress.deletedCount > 0) {
            res.status(200).json({ message: "Removido!" });
            return;
        } else {
            throw new Error("Erro ao remover o address!");
        }
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Functions 
function monteAddress(req) {
    const {
        cep,
        logradouro,
        bairro,
        localidade,
        uf,
        numero,
        complemento,
        id_user,
        padrao

    } = req.body;

    const address = {
        cep,
        logradouro,
        bairro,
        localidade,
        uf,
        numero,
        complemento,
        id_user,
        padrao
    };

    return address;
}

function validAddress(address, update = false) {
    let error = 0;

    if (!update)
        if (!address.cep) {
            error++;
            //res.status(422).json({ message: "E-mail obrigatório!" });
            //return
        }

    if (!address.logradouro) {
        error++;
        //res.status(422).json({ message: "Nome obrigatório!" });
        //return;
    }

    if (!address.bairro) {
        error++;
        //res.status(422).json({ message: "Senha obrigatório!" });
        //return;
    }

    if (error > 0) {
        throw new Error('Error ao cadastrar ou usuário já cadastrado!');
    }
}

async function verifyAddressExist(cep, idUser) {
    let address = await Address.exists({ cep: cep, id_user: idUser });
    if (address) {
        throw new Error('Error ao cadastrar ou usuário já cadastrado!');
    }
}

module.exports = router;