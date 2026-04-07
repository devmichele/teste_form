// ==========================
// IMPORTS
// ==========================
const express = require("express");
const cors = require("cors");

// ==========================
// APP
// ==========================
const app = express();
app.use(express.json());
app.use(cors());

// ==========================
// "BANCO" EM MEMÓRIA
// ==========================
let dados = [];

// ==========================
// ROTA TESTE
// ==========================
app.get("/", (req, res) => {
  res.send("API rodando!");
});

// ==========================
// SALVAR FORMULÁRIO
// ==========================
app.post("/formulario", (req, res) => {
  const { nome, email, telefone, nascimento, sexo } = req.body;

  // validação simples
  if (!nome || !email) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Preencha nome e email"
    });
  }

  const novoCadastro = {
    id: Date.now(),
    nome,
    email,
    telefone,
    nascimento,
    sexo
  };

  dados.push(novoCadastro);

  console.log("NOVO CADASTRO:", novoCadastro);

  res.json({
    sucesso: true,
    mensagem: "Salvo com sucesso!"
  });
});

// ==========================
// LISTAR DADOS (IMPORTANTE)
// ==========================
app.get("/listar", (req, res) => {
  res.json(dados); // 🔥 ESSENCIAL (JSON PURO)
});

// ==========================
// PORTA
// ==========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
