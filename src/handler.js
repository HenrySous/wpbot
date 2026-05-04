import { getCommands } from './commands/index.js';
import 'dotenv/config';

const PREFIX = process.env.BOT_PREFIX || '!';

/**
 * Extrai o texto puro de qualquer tipo de mensagem
 */
function extractText(msg) {
  const m = msg.message;
  return (
    m?.conversation ||
    m?.extendedTextMessage?.text ||
    m?.imageMessage?.caption ||
    m?.videoMessage?.caption ||
    m?.buttonsResponseMessage?.selectedButtonId ||
    m?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    ''
  ).trim();
}

/**
 * Formata o número do remetente (ex: 5585999998888@s.whatsapp.net → 5585999998888)
 */
function getSender(msg) {
  return msg.key.remoteJid?.replace('@s.whatsapp.net', '').replace('@g.us', '') || '';
}

/**
 * Verifica se a mensagem veio de um grupo
 */
function isGroup(msg) {
  return msg.key.remoteJid?.endsWith('@g.us') || false;
}

/**
 * Handler principal — chamado para cada mensagem recebida
 */
export async function handleMessage(sock, msg, store) {
  const text = extractText(msg);
  const from  = msg.key.remoteJid;
  const sender = getSender(msg);
  const group  = isGroup(msg);

  // Só processa mensagens que começam com o prefixo
  if (!text.startsWith(PREFIX)) return;

  const [rawCmd, ...args] = text.slice(PREFIX.length).trim().split(/\s+/);
  const cmd = rawCmd.toLowerCase();

  console.log(`📨 [${group ? 'GRUPO' : 'PV'}] ${sender}: ${PREFIX}${cmd} ${args.join(' ')}`);

  const commands = getCommands();
  const command  = commands[cmd];

  if (!command) {
    await sock.sendMessage(from, {
      text: `❓ Comando *${PREFIX}${cmd}* não encontrado.\nDigite *${PREFIX}menu* para ver os comandos disponíveis.`,
    }, { quoted: msg });
    return;
  }

  // Contexto passado para cada comando
  const ctx = {
    sock,
    msg,
    from,
    sender,
    args,
    text,
    group,
    store,
    prefix: PREFIX,
    reply: (content) =>
      typeof content === 'string'
        ? sock.sendMessage(from, { text: content }, { quoted: msg })
        : sock.sendMessage(from, content, { quoted: msg }),
  };

  await command.execute(ctx);
}
