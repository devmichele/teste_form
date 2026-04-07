const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Configurações (Pega do Environment do Render ou usa padrão)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; 
const REPO_OWNER = "devmichele";
const REPO_NAME = "teste_form";
const FILE_PATH = "dados.json";

app.post('/salvar', async (req, res) => {
    try {
        console.log("Recebi dados do GameMaker:", req.body);
        
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
        
        // 1. Tenta buscar o arquivo
        const getFile = await axios.get(url, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        const sha = getFile.data.sha;
        const currentData = JSON.parse(Buffer.from(getFile.data.content, 'base64').toString());

        // 2. Adiciona o novo registro
        currentData.usuarios.push(req.body);

        // 3. Salva de volta
        const updatedContent = Buffer.from(JSON.stringify(currentData, null, 2)).toString('base64');
        
        await axios.put(url, {
            message: "Update via GameMaker",
            content: updatedContent,
            sha: sha
        }, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        console.log("Salvo com sucesso no GitHub!");
        res.status(200).json({ mensagem: "OK" });

    } catch (error) {
        // Log detalhado para você ver no painel do Render
        console.error("ERRO DETALHADO:", error.response ? error.response.data : error.message);
        res.status(500).json({ 
            erro: "Falha ao salvar", 
            detalhe: error.response ? error.response.data.message : error.message 
        });
    }
});

// Rota de leitura
app.get('/ler', async (req, res) => {
    try {
        const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${FILE_PATH}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (e) {
        res.status(500).send("Erro ao ler");
    }
});

app.listen(process.env.PORT || 10000, () => console.log("Servidor Online"));
