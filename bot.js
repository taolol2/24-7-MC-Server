const mineflayer = require('mineflayer')

const HOST = 'search-sk.gl.joinmc.link'
const PORT = 25565
const USERNAME = 'JohnnySins'
const VERSION = '1.21.1'
const TP_COORDS = { x: -37, y: 165, z: -441 }

let bot
let tpDone = false

function createBot() {
  tpDone = false

  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    version: VERSION,
    auth: 'offline'
  })

  bot.on('spawn', () => {
    console.log('[BOT] Spawned. Waiting 3s then TPing...')
    tpDone = false
    setTimeout(() => {
      bot.chat(`/tp ${USERNAME} ${TP_COORDS.x} ${TP_COORDS.y} ${TP_COORDS.z}`)
      console.log(`[BOT] TP command sent to ${TP_COORDS.x} ${TP_COORDS.y} ${TP_COORDS.z}`)
      tpDone = true
    }, 3000)
  })

  bot.on('respawn', () => {
    console.log('[BOT] Respawned. Waiting 3s then TPing...')
    setTimeout(() => {
      bot.chat(`/tp ${USERNAME} ${TP_COORDS.x} ${TP_COORDS.y} ${TP_COORDS.z}`)
      console.log('[BOT] TP after respawn sent')
    }, 3000)
  })

  // Auto respawn on death
  bot.on('death', () => {
    console.log('[BOT] Died. Respawning...')
    setTimeout(() => {
      bot.respawn()
    }, 1000)
  })

  // Sleep when anyone says "sleep" in chat
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
    // Find a bed near the bot
    const bed = bot.findBlock({
      matching: (block) => bot.isABed(block),
      maxDistance: 10
    })

    if (!bed) {
      console.log('[BOT] No bed found nearby')
      return
    }

    await bot.sleep(bed)
    console.log('[BOT] Now sleeping')
  } catch (err) {
    console.log('[BOT] Sleep failed:', err.message)
  }
}

createBot()
```

---

## PART 3 — Test locally

1. Open Command Prompt **inside your `mcbot` folder**
   - In File Explorer, go into the folder → click the address bar → type `cmd` → Enter
2. Run:
```
   npm install
```
3. Then:
```
   node bot.js
```
4. You should see `[BOT] Spawned` and the TP command fire. Test it. If it works, move to Part 4.

---

## PART 4 — Host 24/7 FREE on Render.com

Render gives you a free always-on worker. You need a **GitHub account** first.

### Step A — Upload to GitHub
1. Go to [https://github.com](https://github.com) → Sign up / log in
2. Click **New repository** → name it `mcbot` → set to **Private** → Create
3. On your PC, install Git from [https://git-scm.com](https://git-scm.com)
4. In your `mcbot` folder, open CMD and run these one by one:
```
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/YOURUSERNAME/mcbot.git
   git push -u origin main
