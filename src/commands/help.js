import { getCommands } from './index.js';
import 'dotenv/config';

export const helpCommand = {
  name: 'help',
  description: 'Ajuda sobre um comando específico',
  async execute({ reply, args }) {
    const prefix = process.env.BOT_PREFIX || '!';

    if (!args[0]) {
      await reply(`ℹ️ Use *${prefix}help [comando]* para ver detalhes.\nExemplo: *${prefix}help ping*\n\nOu *${prefix}menu* para ver todos os comandos.`);
      return;
    }

    const commands = getCommands();
    const cmd = commands[args[0].toLowerCase()];

    if (!cmd) {
      await reply(`❌ Comando *${prefix}${args[0]}* não encontrado.`);
      return;
    }

    await reply(`📖 *Ajuda: ${prefix}${cmd.name}*\n\n${cmd.description}`);
  },
};
