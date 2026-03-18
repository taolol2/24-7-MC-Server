const mineflayer = require('mineflayer')
const http = require('http')

const HOST = 'search-sk.gl.joinmc.link'
const PORT = 25565
const USERNAME = 'JohnnySins'
const VERSION = '1.21.1'
const TP_COORDS = { x: -37, y: 165, z: -441 }

// Keep-alive web server so Render doesn't sleep
http.createServer((req, res) => {
  res.writeHead(200)
  res.end('Bot is running')
}).listen(process.env.PORT || 3000)

let bot

function createBot() {
  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    version: VERSION,
    auth: 'offline'
  })

  bot.on('spawn', () => {
    console.log('[BOT] Spawned. Waiting 3s then TPing...')
    setTimeout(() => {
      bot.chat(`/tp ${USERNAME} ${TP_COORDS.x} ${TP_COORDS.y} ${TP_COORDS.z}`)
      console.log('[BOT] TP sent')
    }, 3000)
  })

  bot.on('respawn', () => {
    console.log('[BOT] Respawned. TPing...')
    setTimeout(() => {
      bot.chat(`/tp ${USERNAME} ${TP_COORDS.x} ${TP_COORDS.y} ${TP_COORDS.z}`)
    }, 3000)
  })

  bot.on('death', () => {
    console.log('[BOT] Died. Respawning...')
    setTimeout(() => bot.respawn(), 1000)
  })

  bot.on('chat', (username, message) => {
    if (message.toLowerCase().trim() === 'sleep') {
      console.log(`[BOT] Sleep triggered by ${username}`)
      sleepBot()
    }
  })

  bot.on('error', (err) => {
    console.error('[BOT] Error:', err.message)
  })

  bot.on('end', (reason) => {
    console.log('[BOT] Disconnected:', reason, '— Reconnecting in 10s...')
    setTimeout(createBot, 10000)
  })

  bot.on('kicked', (reason) => {
    console.log('[BOT] Kicked:', reason, '— Reconnecting in 10s...')
    setTimeout(createBot, 10000)
  })
}

async function sleepBot() {
  try {
    const bed = bot.findBlock({
      matching: (block) => bot.isABed(block),
      maxDistance: 10
    })
    if (!bed) { console.log('[BOT] No bed found'); return }
    await bot.sleep(bed)
    console.log('[BOT] Sleeping')
  } catch (err) {
    console.log('[BOT] Sleep failed:', err.message)
  }
}

createBot()
