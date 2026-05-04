export const pingCommand = {
  name: 'ping',
  description: 'Verifica latência do bot',
  async execute({ reply, msg }) {
    const start = Date.now();
    await reply('🏓 Calculando...');
    const latency = Date.now() - start;
    await reply(`✅ *Pong!* Latência: *${latency}ms*`);
  },
};
