const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let usuarios = [];
app.get("/formulario", (req, res) => {
    res.json(dados);
});
app.post("/formulario", (req, res) => {
    const { nome, email, telefone, nascimento, sexo } = req.body;

    if (!nome || !email) {
        return res.status(400).json({ erro: "Nome e email obrigatórios" });
    }

    const novo = {
        id: usuarios.length + 1,
        nome,
        email,
        telefone,
        nascimento,
        sexo
    };

    usuarios.push(novo);

    console.log(novo);

    res.json({ sucesso: true });
});

app.get("/usuarios", (req, res) => {
    res.json(usuarios);
});

app.listen(process.env.PORT || 3000, () => {
    console.log("API rodando...");
});
