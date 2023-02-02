const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const auth = {
    createNewPass: async function (password) {
        const salt = await bcrypt.genSalt(12);
        return await bcrypt.hash(password, salt);
    },
    comparePasswords: async function (passwordUsuario, passwordDB) {
        const checkPass = await bcrypt.compare(passwordUsuario, passwordDB);
        if (!checkPass) {
            throw new Error("Senha invalida!");
        }
    },
    createToken: function (Usuario) {
        try {
            const secret = process.env.SECRET;
            const token = jwt.sign({
                id: Usuario._id,
                nome: Usuario.nome,
                perfil: Usuario.perfil
            }, secret);
            return token;
        } catch (error) {
            console.error("Error:", error);
            throw new Error("Erro ao montar o token!");
        }
    },
    checkToken: function (req, res, next) {
        try {
            const authHeader = req.headers.authorization;;
            const token = authHeader && authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({ error: "Usuário sem acesso!" });
            }
            const secret = process.env.SECRET;
            jwt.verify(token, secret, (err, UsuarioInfo) => {
                if (err) {
                    return res.status(401).json({ error: "Usuário sem acesso!" });
                }
                console.log(UsuarioInfo);
                return UsuarioInfo;
            });
            next();
        } catch (error) {
            return res.status(401).json({ error: "Usuário sem acesso!" });
        }
    },

};

module.exports = auth; 