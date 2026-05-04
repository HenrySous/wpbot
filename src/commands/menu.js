import 'dotenv/config';

export const menuCommand = {
  name: 'menu',
  description: 'Mostra todos os comandos disponíveis',
  async execute({ reply }) {
    const prefix = process.env.BOT_PREFIX || '!';
    const botName = process.env.BOT_NAME || 'WhatsApp Bot';
    const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' });

    const menu = `
╔══════════════════════════╗
║   🤖  *${botName}*
╚══════════════════════════╝

🕐 *${now}*

━━━━━━ 📋 COMANDOS ━━━━━━

🔹 *${prefix}menu*
   Mostra este menu

🔹 *${prefix}ping*
   Verifica se o bot está online

🔹 *${prefix}info*
   Informações sobre o bot

🔹 *${prefix}sticker* _(ou ${prefix}s)_
   Converte imagem/vídeo em sticker
   _Envie a imagem com o comando na legenda_

🔹 *${prefix}help [comando]*
   Ajuda detalhada de um comando

━━━━━━━━━━━━━━━━━━━━━━━━━━
_Desenvolvido com ❤️ e Baileys_
`.trim();

    await reply(menu);
  },
};
