const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors()); // Permite que o GameMaker acesse a API sem bloqueios

// --- CONFIGURAÇÕES DO GITHUB ---
const GITHUB_TOKEN = "SEU_TOKEN_AQUI"; // <--- COLOQUE SEU TOKEN DO GITHUB AQUI
const REPO_OWNER = "devmichele";
const REPO_NAME = "teste_form";
const FILE_PATH = "dados.json";

// ROTA PARA SALVAR (POST)
app.post('/salvar', async (req, res) => {
    try {
        // 1. Pega o arquivo atual para obter o SHA (obrigatório pelo GitHub)
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
        const getFile = await axios.get(url, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        const sha = getFile.data.sha;
        const currentContent = JSON.parse(Buffer.from(getFile.data.content, 'base64').toString());

        // 2. Adiciona o novo dado enviado pelo GameMaker
        currentContent.usuarios.push(req.body);

        // 3. Converte para Base64 e envia de volta
        const newContent = Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64');
        
        await axios.put(url, {
            message: "Novo registro via GameMaker",
            content: newContent,
            sha: sha
        }, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        res.status(200).json({ status: "sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao salvar no GitHub" });
    }
});

// ROTA PARA LER (GET)
app.get('/ler', async (req, res) => {
    try {
        const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${FILE_PATH}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Erro ao ler dados" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
