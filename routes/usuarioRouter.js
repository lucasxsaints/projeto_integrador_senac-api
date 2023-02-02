const router = require('express').Router();
const auth = require('../services/auth');
const multer = require('multer');

const Usuario = require('../models/Usuario');

router.post("/usuario/add", async function (req, res) {
    try {
        // Receber e montar o usuário
        const usuario = monteUsuario(req);
        // Validar os dados;
        validUsuario(usuario);
        // Verifica se usuário já existe
        await verifyUsuarioExist(usuario.email);
        usuario.senha = await auth.createNewPass(usuario.senha);
        await Usuario.create(usuario);
        res.status(200).json({ message: "Cadastrado!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/usuario/list", async function (req, res) {
    try {
        let usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar!" });
    }
});

router.get("/usuario/:id", async function (req, res) {
    try {
        let idUsuario = req.params.id;
        let usuario = await Usuario.findOne({ _id: idUsuario });
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar!" });
    }
});

router.patch("/usuario/:id", async function (req, res) {
    try {
        // Receber e montar o usuário
        let idUsuario = req.params.id;
        const usuario = monteUsuario(req);
        // Validar os dados;
        validUsuario(usuario, true);
        const updateUsuario = await Usuario.updateOne({ _id: idUsuario }, usuario);
        if (updateUsuario.matchedCount > 0) {
            res.status(200).json({ message: "Atualizado!" });
            return;
        } else {
            throw new Error("Erro ao atualizar!");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/usuario/:id", async function (req, res) {
    try {
        let idUsuario = req.params.id;
        let usuario = await Usuario.findOne({ _id: idUsuario });
        if (!Usuario) {
            throw new Error("Erro ao remover o usuario!");
        }
        let deletUsuario = await Usuario.deleteOne({ _id: idUsuario });
        if (deletUsuario.deletedCount > 0) {
            res.status(200).json({ message: "Removido!" });
            return;
        } else {
            throw new Error("Erro ao remover o usuario!");
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/usuario/login", async function (req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({ error: "Usuário sem acesso!" });
        }

        const usuario = await Usuario.findOne({ email: email, ative: true });
        if (!usuario) {
            return res.status(401).json({ error: "Usuário sem acesso!" });
        }
        await auth.comparePasswords(password, usuario.senha);
        const token = auth.createToken(usuario);
        return res.status(200).json({ message: "Usuário logado!", token: token });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ error: "Error ao entrar!" });
    }
});

// const storage = multer.memoryStorage();
// const upload = multer({ storage })
// router.post('/usuario/upload', upload.array('file'), async function (req, res) {
//     try {
//         //const UsuarioAuth = await auth.checkToken(req, res);
//         const UsuarioID = req.body.Usuario;
//         const files = [];
//         for (let file of req.files) {
//             files.push('data:' + file.mimetype + ';base64,' + file.buffer.toString('base64'));
//         };
//         const UsuarioUpdate = await Usuario.updateOne({ _id: UsuarioID }, { foto: files });
//         if (req.files && UsuarioUpdate.matchedCount > 0) {
//             let dataSend = { upload: true, files: files };
//             return res.status(200).json(dataSend);
//         }
//         return res.status(500).json({ error: "Erro ao enviar os arquivos!" });
//     } catch (error) {
//         return res.status(500).json({ error: "Erro ao enviar os arquivos!" + error.message });
//     }
// })

// Functions 
function monteUsuario(req) {
    const {
        nome,
        email,
        senha,
        telefone,
        apartamento,
        bloco,
        andar,
    } = req.body;

    const Usuario = {
        nome,
        email,
        senha,
        telefone,
        apartamento,
        bloco,
        andar
    };
    return Usuario;
}

function validUsuario(Usuario, update = false) {
    let error = 0;

    if (!update)
        if (!Usuario.email) {
            error++;
            //res.status(422).json({ message: "E-mail obrigatório!" });
            //return
        }

    if (!Usuario.nome) {
        error++;
        //res.status(422).json({ message: "Nome obrigatório!" });
        //return;
    }

    if (!Usuario.senha) {
        error++;
        //res.status(422).json({ message: "Senha obrigatório!" });
        //return;
    }

    if (error > 0) {
        throw new Error('Error ao cadastrar ou usuário já cadastrado!');
    }
}

async function verifyUsuarioExist(email) {
    let usuario = await Usuario.exists({ email: email });
    if (usuario) {
        throw new Error('Error ao cadastrar ou usuário já cadastrado!');
    }
}

module.exports = router;