const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const app = express();

// Configurações para o site conseguir conversar com o servidor
app.use(cors());
app.use(express.json());

let listaJogadores = [];

// Rota de Registro - Agora responde JSON para o botão destravar
app.post('/registrar', (req, res) => {
const { nick, ip, classe } = req.body;

});

// Rota para buscar os dados por classe
app.get('/admin/:classe', (req, res) => {
const { classe } = req.params;
const filtrados = listaJogadores.filter(j => j.classe === classe);
res.json(filtrados);
});

// Limpeza automática a cada 30 minutos (Corrigida)
cron.schedule('*/30 * * * *', () => {
const duasHorasEmMs = 2 * 60 * 60 * 1000;
const limite = Date.now() - duasHorasEmMs;
listaJogadores = listaJogadores.filter(j => j.hora > limite);
console.log('Limpeza de dados antigos feita.');
});

const PORT = process.env.PORT || 3000;

// O '0.0.0.0' faz o Render aceitar as conexões externas
app.listen(PORT, '0.0.0.0', () => {
console.log(Servidor rodando na porta ${PORT});
});