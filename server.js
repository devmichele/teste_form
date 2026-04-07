const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const GITHUB_TOKEN = 'SEU_TOKEN_AQUI'; // Gere um "Fine-grained token" no GitHub
const REPO_OWNER = 'devmichele';
const REPO_NAME = 'teste_form';
const FILE_PATH = 'dados.json';

// Rota para salvar dados
app.post('/salvar', async (req, res) => {
    try {
        // 1. Pega o arquivo atual para obter o 'sha' (necessário para atualizar no GitHub)
        const getFile = await axios.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        const sha = getFile.data.sha;
        const contentBase64 = getFile.data.content;
        const currentData = JSON.parse(Buffer.from(contentBase64, 'base64').toString());

        // 2. Adiciona o novo dado
        currentData.usuarios.push(req.body);

        // 3. Envia de volta para o GitHub
        const updatedContent = Buffer.from(JSON.stringify(currentData, null, 2)).toString('base64');
        
        await axios.put(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            message: "Novo cadastro via GameMaker",
            content: updatedContent,
            sha: sha
        }, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        res.status(200).send({ mensagem: "Salvo com sucesso!" });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Rota para ler dados
app.get('/ler', async (req, res) => {
    try {
        const response = await axios.get(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${FILE_PATH}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send("Erro ao ler dados");
    }
});

app.listen(process.env.PORT || 3000, () => console.log("Servidor rodando!"));
