import process = require("process");

const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
app.use(express.json());
app.use(cors());

//Aqui guardamos os jogadores (em memoria, sem compilação de banco por enquanto)
let listaJogadores: any[] = [];

//Rota para registrar
app.post('/registrar', (req, res) => {
    const { nick, ip, classe } = req.body;
    const novo = { nick, ip, classe, hora: new Date() };
    listaJogadores.push(novo);
    res.send('Registrado com sucesso! prepare-se para a DG. USE O COMANDO #forcecityoverload true!');
});

//Rota para o caller ver
app.get('/admin/:classe', (req, res) => {
    const filtrados =
    listaJogadores.filter(j => j.classe === req.params.classe);
    res.json(filtrados);
});

//Limpeza Automatica (Roda a cada 30 minutos e apaga oque tiver + de 2 horas registado)
cron.schedule('*/30 * * * *', () => {
    const limite = new Date(Date.now()) - 2 * 60 * 60 * 1000; // 2 horas em milissegundos
    listaJogadores = listaJogadores.filter(j => j.hora > limite);
    console.log('Limpeza realizada.');
}); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
 