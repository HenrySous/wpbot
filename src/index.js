import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  jidDecode,
  proto,
  getAggregateVotesInPollMessage,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import { handleMessage } from './handler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Logger silencioso (troque 'silent' por 'info' para ver logs do Baileys)
const logger = pino({ level: process.env.DEBUG === 'true' ? 'info' : 'silent' });

// Store em memória para cache de mensagens
const store = makeInMemoryStore({ logger });
store?.readFromFile('./session/store.json');

// Salva o store a cada 10 segundos
setInterval(() => {
  store?.writeToFile('./session/store.json');
}, 10_000);

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const { version, isLatest } = await fetchLatestBaileysVersion();

  console.log(`\n🤖 ${process.env.BOT_NAME || 'WhatsApp Bot'} iniciando...`);
  console.log(`📦 Baileys v${version} ${isLatest ? '(última versão)' : '⚠️ versão desatualizada'}\n`);

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false, // Controlamos manualmente
    auth: state,
    msgRetryCounterCache: {},
    generateHighQualityLinkPreview: true,
    browser: ['WhatsApp Bot', 'Chrome', '1.0.0'],
  });

  store?.bind(sock.ev);

  // ── Eventos de conexão ──────────────────────────────────────────────────────
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('📱 Escaneie o QR Code abaixo com o WhatsApp:\n');
      qrcode.generate(qr, { small: true });
      console.log('\n⏳ Aguardando leitura...\n');
    }

    if (connection === 'close') {
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      console.log(`\n❌ Conexão encerrada. Motivo: ${statusCode}`);

      if (shouldReconnect) {
        console.log('🔄 Reconectando em 5 segundos...\n');
        setTimeout(connectToWhatsApp, 5000);
      } else {
        console.log('🚪 Sessão encerrada (logout). Delete a pasta /session e reinicie.\n');
        process.exit(0);
      }
    }

    if (connection === 'open') {
      console.log('✅ Conectado ao WhatsApp com sucesso!\n');
      const ownerJid = process.env.OWNER_NUMBER
        ? `${process.env.OWNER_NUMBER}@s.whatsapp.net`
        : null;

      if (ownerJid) {
        await sock.sendMessage(ownerJid, {
          text: `🤖 *${process.env.BOT_NAME || 'Bot'}* está online!\n\nDigite *!menu* para ver os comandos.`,
        });
      }
    }
  });

  // ── Salvar credenciais ──────────────────────────────────────────────────────
  sock.ev.on('creds.update', saveCreds);

  // ── Receber mensagens ───────────────────────────────────────────────────────
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (!msg.message) continue;           // Mensagem vazia
      if (msg.key.fromMe) continue;         // Ignorar mensagens do próprio bot

      try {
        await handleMessage(sock, msg, store);
      } catch (err) {
        console.error('❌ Erro ao processar mensagem:', err);
      }
    }
  });

  return sock;
}

// ── Iniciar ─────────────────────────────────────────────────────────────────
connectToWhatsApp().catch(console.error);
