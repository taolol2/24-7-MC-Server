const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// 1. THE WEB SERVER (Keeps Render awake)
app.get('/', (req, res) => res.send('Bot is Alive!'));
app.listen(3000, () => console.log('Web server is running.'));

// 2. THE MINECRAFT BOT
const bot = mineflayer.createBot({
  host: 'search-sk.gl.joinmc.link', 
  port: 25565,             
  username: 'AFK_Bot',
  version: '1.21.11' // Change to your server version
});

// Anti-AFK Kick: Jump every 60 seconds
setInterval(() => {
  bot.setControlState('jump', true);
  setTimeout(() => bot.setControlState('jump', false), 500);
}, 60000);

bot.on('spawn', () => console.log('Joined the farm!'));
bot.on('error', (err) => console.log(err));
bot.on('end', () => console.log('Disconnected. Restarting...'));
