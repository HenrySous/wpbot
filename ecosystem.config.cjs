// Configuração para o PM2 (gerenciador de processos Node.js)
// Instale: npm install -g pm2
// Uso: pm2 start ecosystem.config.cjs

module.exports = {
  apps: [
    {
      name: 'whatsapp-bot',
      script: 'src/index.js',
      interpreter: 'node',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      env: {
        NODE_ENV: 'production',
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,
    },
  ],
};
