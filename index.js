const mineflayer = require('mineflayer');
const { voiceChatPlugin } = require('@shrev/mineflayer-simple-voice-chat'); // FIXED: correct package name
const express = require('express');
const Vec3 = require('vec3'); // FIXED: vec3 must be required directly

const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('JohnnySins is fixed and ready!'));
app.listen(port, () => console.log(`Server live on port ${port}`));

function createBot() {
    const bot = mineflayer.createBot({
        host: 'search-sk.gl.joinmc.link',
        port: 25565,
        username: 'JohnnySins',
        version: '1.21.1' // FIXED: '1.21.11' is not a valid version, use '1.21.1'
    });

    bot.loadPlugin(voiceChatPlugin);

    const teleportToFarm = () => {
        const targetPos = { x: -37, y: 165, z: -441 };
        if (bot.entity && bot.entity.position) {
            const dist = bot.entity.position.distanceTo(new Vec3(targetPos.x, targetPos.y, targetPos.z)); // FIXED: use Vec3 directly
            if (dist > 2) {
                bot.chat(`/tp ${targetPos.x} ${targetPos.y} ${targetPos.z}`);
            }
        }
    };

    bot.once('spawn', () => {
        console.log('JohnnySins joined!');
        setTimeout(teleportToFarm, 3000);

        setInterval(() => {
            if (bot.entity && !bot.isSleeping) { // FIXED: guard with bot.entity check
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 45000);
    });

    bot.on('chat', async (username, message) => {
        if (username === bot.username) return;
        const msg = message.toLowerCase();

        if (msg === 'sleep') {
            const bed = bot.findBlock({
                matching: block => bot.isABed(block),
                maxDistance: 5
            });
            if (bed) {
                try {
                    await bot.sleep(bed);
                    bot.chat("I am sleeping now. Goodnight!");
                } catch (err) {
                    bot.chat("I can't sleep right now (maybe it is day?)");
                }
            } else {
                bot.chat("I don't see a bed near -37 165 -441!");
            }
        }

        if (msg === 'wake') {
            try {
                await bot.wake();
                bot.chat("I am awake!");
            } catch (err) {
                bot.chat("I am already awake.");
            }
        }
    });

    bot.on('playerJoined', (player) => {
        if (player.username !== bot.username) {
            setTimeout(() => {
                bot.chat(`hi ${player.username}, i am an afk bot for the creeper farm plz do not kill me.`);
            }, 4000);
        }
    });

    bot.on('death', () => setTimeout(teleportToFarm, 5000));

    bot.on('end', () => {
        console.log('Disconnected. Restarting...');
        setTimeout(createBot, 30000);
    });

    bot.on('error', (err) => console.log('Error:', err));
}

createBot();
