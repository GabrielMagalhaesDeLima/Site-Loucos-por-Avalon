import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import cron from 'node-cron';

const app = express();

// Configurações para o site conseguir conversar com o servidor
app.use(cors());
app.use(express.json());

interface Jogador {
  nick: string;
  ip: string;
  classe: string;
  hora: number;
}

let listaJogadores: Jogador[] = [];

// Rota de Registro - Agora COM LÓGICA e responde JSON para o botão destravar
app.post('/registrar', (req: Request, res: Response) => {
  try {
    const { nick, ip, classe } = req.body;

    // 1. Cria o jogador com a hora atual
    const novo: Jogador = {
      nick,
      ip,
      classe,
      hora: Date.now()
    };

    // 2. Salva na memória do servidor
    listaJogadores.push(novo);
    console.log(`✅ Jogador ${nick} cadastrado com sucesso!`);

    // 3. Avisa o site que deu tudo certo (Isso destrava o botão!)
    res.status(200).json({ status: "ok", mensagem: "Registrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao registrar:", error);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

// Rota para buscar os dados por classe
app.get('/admin/:classe', (req: Request, res: Response) => {
  const { classe } = req.params;
  const filtrados = listaJogadores.filter(j => j.classe === classe);
  res.json(filtrados);
});

// Limpeza automática a cada 30 minutos
cron.schedule('*/30 * * * *', () => {
  const duasHorasEmMs = 2 * 60 * 60 * 1000;
  const limite = Date.now() - duasHorasEmMs;
  listaJogadores = listaJogadores.filter(j => j.hora > limite);
  console.log('🧹 Limpeza de dados antigos feita.');
});

const PORT = Number(process.env.PORT) || 3000;

// O '0.0.0.0' faz o Render aceitar as conexões externas
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});