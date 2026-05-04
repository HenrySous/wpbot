# 🤖 WhatsApp Bot — Baileys

Bot de WhatsApp completo, pronto para hospedar no seu servidor VPS/Linux.

---

## ⚡ Requisitos

- **Node.js** v18 ou superior
- **npm** v8+
- **ffmpeg** (para o comando sticker)
- Servidor Linux (Ubuntu/Debian recomendado)

---

## 🚀 Instalação

### 1. Clone ou faça upload do projeto no servidor

```bash
# Se usar git
git clone <url-do-repositorio> whatsapp-bot
cd whatsapp-bot

# Ou envie os arquivos via SCP/FTP e entre na pasta
cd whatsapp-bot
```

### 2. Instale o Node.js (se não tiver)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # deve mostrar v20.x.x
```

### 3. Instale o ffmpeg (para stickers)

```bash
sudo apt update
sudo apt install -y ffmpeg
ffmpeg -version  # confirme a instalação
```

### 4. Instale as dependências

```bash
npm install
```

### 5. Configure o arquivo .env

```bash
cp .env.example .env
nano .env   # edite com seus dados
```

Preencha:
```env
BOT_NAME=MeuBot
BOT_PREFIX=!
OWNER_NUMBER=5585999998888   # seu número com DDD e código do país
```

### 6. Inicie o bot pela primeira vez

```bash
npm start
```

Um **QR Code** aparecerá no terminal. Escaneie com o WhatsApp:
- Abra o WhatsApp → Dispositivos Vinculados → Vincular dispositivo

A sessão fica salva na pasta `session/` — nas próximas inicializações o QR não aparece.

---

## 🔄 Manter o bot rodando 24/7 (PM2)

```bash
# Instale o PM2 globalmente
npm install -g pm2

# Inicie o bot com PM2
pm2 start ecosystem.config.cjs

# Configure para iniciar com o sistema
pm2 startup
pm2 save

# Comandos úteis
pm2 status           # ver status
pm2 logs whatsapp-bot   # ver logs em tempo real
pm2 restart whatsapp-bot
pm2 stop whatsapp-bot
```

---

## 📋 Comandos disponíveis

| Comando | Descrição |
|---------|-----------|
| `!menu` | Lista todos os comandos |
| `!ping` | Testa latência do bot |
| `!info` | Informações do bot (versão, uptime) |
| `!sticker` / `!s` | Converte imagem/vídeo em sticker |
| `!help [cmd]` | Ajuda de um comando específico |

---

## ➕ Adicionar novos comandos

1. Crie um arquivo em `src/commands/meucomando.js`:

```js
export const meuComando = {
  name: 'ola',
  description: 'Diz olá para o usuário',
  async execute({ reply, sender }) {
    await reply(`👋 Olá, ${sender}!`);
  },
};
```

2. Registre em `src/commands/index.js`:

```js
import { meuComando } from './meucomando.js';

export function getCommands() {
  return {
    // ... outros comandos
    ola: meuComando,
  };
}
```

### Propriedades disponíveis no `ctx`:

| Propriedade | Descrição |
|-------------|-----------|
| `sock` | Instância do Baileys (envio de mensagens) |
| `msg` | Objeto completo da mensagem |
| `from` | JID do remetente/grupo |
| `sender` | Número do remetente |
| `args` | Array com argumentos do comando |
| `text` | Texto completo da mensagem |
| `group` | `true` se for grupo |
| `store` | Store de mensagens em memória |
| `prefix` | Prefixo configurado |
| `reply(texto)` | Atalho para responder a mensagem |

---

## 🗂️ Estrutura do projeto

```
whatsapp-bot/
├── src/
│   ├── index.js          # Conexão com WhatsApp
│   ├── handler.js        # Roteador de mensagens
│   └── commands/
│       ├── index.js      # Registro de comandos
│       ├── menu.js
│       ├── ping.js
│       ├── info.js
│       ├── help.js
│       └── sticker.js
├── session/              # Criada automaticamente (credenciais)
├── tmp/                  # Arquivos temporários (stickers)
├── logs/                 # Logs do PM2
├── .env                  # Suas configurações
├── ecosystem.config.cjs  # Config do PM2
└── package.json
```

---

## ❓ Problemas comuns

**QR Code não aparece:** Delete a pasta `session/` e reinicie.

**Erro de sticker:** Instale o ffmpeg: `sudo apt install ffmpeg`

**Bot desconecta sozinho:** Use PM2 para reiniciar automaticamente.

**"Session closed":** Reconecte seu número — é normal após muito tempo.
