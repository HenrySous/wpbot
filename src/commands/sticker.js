import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import 'dotenv/config';

// Garante pasta temp
if (!existsSync('./tmp')) mkdirSync('./tmp');

export const stickerCommand = {
  name: 'sticker',
  description: 'Converte imagem ou vídeo curto em sticker.\nEnvie a mídia com a legenda !sticker (ou !s)',
  async execute({ sock, msg, from, reply }) {
    const quoted = msg.message?.imageMessage || msg.message?.videoMessage;

    if (!quoted) {
      await reply('📎 Envie uma *imagem ou vídeo curto* com a legenda *!sticker*');
      return;
    }

    await reply('⏳ Criando sticker...');

    try {
      const buffer = await downloadMediaMessage(msg, 'buffer', {});
      const isVideo = !!msg.message?.videoMessage;
      const ext     = isVideo ? 'mp4' : 'jpg';
      const tmpIn   = `./tmp/sticker_in_${Date.now()}.${ext}`;
      const tmpOut  = `./tmp/sticker_out_${Date.now()}.webp`;

      writeFileSync(tmpIn, buffer);

      if (isVideo) {
        // Vídeo → WebP animado
        execSync(
          `ffmpeg -i "${tmpIn}" -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15" -vcodec libwebp -lossless 0 -compression_level 6 -q:v 50 -loop 0 -preset picture -an -t 8 -vsync 0 "${tmpOut}"`,
          { stdio: 'ignore' }
        );
      } else {
        // Imagem → WebP
        execSync(
          `ffmpeg -i "${tmpIn}" -vf "scale=512:512:force_original_aspect_ratio=decrease" "${tmpOut}"`,
          { stdio: 'ignore' }
        );
      }

      await sock.sendMessage(from, {
        sticker: { url: tmpOut },
      }, { quoted: msg });

      // Limpar arquivos temporários
      unlinkSync(tmpIn);
      unlinkSync(tmpOut);
    } catch (err) {
      console.error('Erro no sticker:', err);
      await reply('❌ Erro ao criar sticker. Certifique-se que o *ffmpeg* está instalado no servidor.');
    }
  },
};
