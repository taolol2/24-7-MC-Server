const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is Awake, Smart, and Immortal!'));
app.listen(port, () => console.log(`Web server active on port ${port}`));

function createBot() {
    const bot = mineflayer.createBot({
        host: 'search-sk.gl.joinmc.link', 
        port: 25565,             
        username: 'JohnnySins',
        version: '1.21.1' 
    });

    // Helper function to handle teleporting safely
    const teleportToFarm = () => {
        const targetPos = { x: -37, y: 165, z: -441 };
        const currentPos = bot.entity.position;

        // Only TP if the bot is more than 2 blocks away from the target
        if (currentPos.distanceTo(new mineflayer.vec3(targetPos.x, targetPos.y, targetPos.z)) > 2) {
            console.log('Bot is not at farm. Teleporting...');
            bot.chat(`/tp ${targetPos.x} ${targetPos.y} ${targetPos.z}`);
        } else {
            console.log('Bot is already at the farm. Skipping TP.');
        }
    };

    bot.once('spawn', () => {
        console.log('Bot joined the game!');
        
        // Wait 2 seconds after spawning to let the world load before checking position
        setTimeout(teleportToFarm, 2000);

        // Anti-AFK Jump
        setInterval(() => {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
        }, 45000);
    });

    // --- NEW: DEATH LISTENER ---
    bot.on('death', () => {
        console.log('Bot died! Waiting to respawn...');
        // Wait 5 seconds to respawn and then teleport back
        setTimeout(teleportToFarm, 5000);
    });

    // Welcome Message Logic
    bot.on('playerJoined', (player) => {
        setTimeout(() => {
            if (player.username !== bot.username) {
                bot.chat(`hi ${player.username}, i am an afk bot for the creeper farm plz do not kill me (i am on top of the farm).`);
            }
        }, 3000);
    });

    bot.on('end', () => {
        console.log('Disconnected. Retrying in 60s...');
        setTimeout(createBot, 60000); 
    });

    bot.on('error', (err) => console.log(err));
}

createBot();
