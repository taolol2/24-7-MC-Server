const mineflayer = require('mineflayer');
// --- NEW LIBRARY ---
const { voiceChatPlugin } = require('mineflayer-simple-voice-chat'); 
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is fixing Voice Chat kicks!'));
app.listen(port, () => console.log(`Web server on port ${port}`));

function createBot() {
    const bot = mineflayer.createBot({
        host: 'search-sk.gl.joinmc.link', 
        port: 25565,             
        username: 'JohnnySins',
        version: '1.21.11' // Updated to your server version
    });

    // --- LOAD THE VOICE CHAT PLUGIN ---
    bot.loadPlugin(voiceChatPlugin);

    const teleportToFarm = () => {
        const targetPos = { x: -37, y: 165, z: -441 };
        if (bot.entity && bot.entity.position) {
            const currentPos = bot.entity.position;
            if (currentPos.distanceTo(new mineflayer.vec3(targetPos.x, targetPos.y, targetPos.z)) > 2) {
                bot.chat(`/tp ${targetPos.x} ${targetPos.y} ${targetPos.z}`);
            }
        }
    };

    bot.once('spawn', () => {
        console.log('JohnnySins has arrived!');
        setTimeout(teleportToFarm, 2000);

        setInterval(() => {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
        }, 45000);
    });

    bot.on('playerJoined', (player) => {
        if (player.username !== bot.username) {
            setTimeout(() => {
                bot.chat(`hi ${player.username}, i am an afk bot for the creeper farm plz do not kill me.`);
            }, 3000);
        }
    });

    bot.on('death', () => setTimeout(teleportToFarm, 5000));

    bot.on('end', (reason) => {
        console.log('Disconnected:', reason);
        setTimeout(createBot, 60000); 
    });

    bot.on('error', (err) => console.log('Bot Error:', err));
}

createBot();
