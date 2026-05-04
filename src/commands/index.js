import { menuCommand }  from './menu.js';
import { pingCommand }  from './ping.js';
import { infoCommand }  from './info.js';
import { helpCommand }  from './help.js';
import { stickerCommand } from './sticker.js';

/**
 * Mapa de todos os comandos disponíveis.
 * Chave = nome do comando (sem prefixo).
 */
export function getCommands() {
  return {
    menu:    menuCommand,
    ping:    pingCommand,
    info:    infoCommand,
    help:    helpCommand,
    sticker: stickerCommand,
    s:       stickerCommand, // alias
  };
}
