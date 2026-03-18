const mineflayer = require('mineflayer');
const { voiceChatPlugin } = require('@shrev/mineflayer-simple-voice-chat');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('JohnnySins is Online!'));
app.listen(port, () => console.log(`Web server on port ${port}`));

function createBot() {
    const bot = mineflayer.createBot({
        host: 'search-sk.gl.joinmc.link', 
        port: 25565,             
        username: 'JohnnySins',
        version: '1.21.1'
    });

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

        // Anti-AFK Jump (Only jumps if NOT sleeping)
        setInterval(() => {
            if (!bot.isSleeping) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 45000);
    });

    // --- SLEEP LOGIC ---
    bot.on('chat', async (username, message) => {
        if (username === bot.username) return;
        
        if (message.toLowerCase() === 'sleep') {
            const bed = bot.findBlock({
                matching: block => bot.isABed(block),
                maxDistance: 5
            });

            if (bed) {
                try {
                    await bot.sleep(bed);
                    bot.chat("Goodnight! I'm sleeping now.");
                } catch (err) {
                    bot.chat(`I can't sleep yet: ${err.message}`);
                }
            } else {
                bot.chat("I can't find a bed near me!");
            }
        }
    });

    bot.on('playerJoined', (player) => {
        if (player.username !== bot.username) {
            setTimeout(() => {
                bot.chat(`hi ${player.username}, i am an afk bot for the creeper farm plz do not kill me.`);
            }, 3000);
        }
    });

    bot.on('death', () => setTimeout(teleportToFarm, 5000));
    bot.on('end', () => setTimeout(createBot, 60000));
    bot.on('error', (err) => console.log('Bot Error:', err));
}

createBot();
