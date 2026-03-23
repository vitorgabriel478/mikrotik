const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

let mikrotikConfig = {
    ip: '',
    user: '',
    pass: ''
};

// LOGIN
app.post('/login', (req, res) => {
    const { ip, user, pass } = req.body;

    mikrotikConfig = { ip, user, pass };

    res.json({ success: true });
});

// STATUS RB
app.get('/status', async (req, res) => {
    try {
        const response = await axios.get(
            `http://${mikrotikConfig.ip}/rest/system/resource`,
            {
                auth: {
                    username: mikrotikConfig.user,
                    password: mikrotikConfig.pass
                }
            }
        );

        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao conectar na MikroTik' });
    }
});

// EXECUTAR SCRIPT
app.post('/run-script', async (req, res) => {
    const { script } = req.body;

    try {
        const response = await axios.post(
            `http://${mikrotikConfig.ip}/rest/execute`,
            { script },
            {
                auth: {
                    username: mikrotikConfig.user,
                    password: mikrotikConfig.pass
                }
            }
        );

        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao executar script' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}`);
});
