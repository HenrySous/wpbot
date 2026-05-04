import { readFileSync } from 'fs';
import { uptime } from 'process';
import 'dotenv/config';

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

export const infoCommand = {
  name: 'info',
  description: 'Informações sobre o bot',
  async execute({ reply }) {
    const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

    const info = `
🤖 *Informações do Bot*

📛 *Nome:* ${process.env.BOT_NAME || 'WhatsApp Bot'}
📦 *Versão:* ${pkg.version}
⏱️ *Uptime:* ${formatUptime(uptime())}
🛠️ *Runtime:* Node.js ${process.version}
💡 *Biblioteca:* @whiskeysockets/baileys
🔤 *Prefixo:* ${process.env.BOT_PREFIX || '!'}
    `.trim();

    await reply(info);
  },
};
