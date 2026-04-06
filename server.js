const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// =========================
// BANCO TEMPORÁRIO (memória)
// =========================
let dados = [];

// =========================
// POST - SALVAR
// =========================
app.post("/formulario", (req, res) => {
    const { nome, email, telefone, nascimento, sexo } = req.body;

    if (!nome || !email || !telefone || !nascimento || !sexo) {
        return res.status(400).json({ sucesso: false, erro: "Campos obrigatórios" });
    }

    dados.push({
        nome,
        email,
        telefone,
        nascimento,
        sexo
    });

    res.json({ sucesso: true });
});

// =========================
// GET - LISTAR
// =========================
app.get("/formulario", (req, res) => {
    res.json(dados);
});

// =========================
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
