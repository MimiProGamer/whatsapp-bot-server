import { create } from '@open-wa/wa-automate';
import express from 'express';
import chalk from 'chalk';
import fetch from 'node-fetch';

// Leaderboard data (dummy)
let leaderboard = [
  { user: "Mika", balance: 0 },
  { user: "Raaf", balance: 0 },
  { user: "Soufian", balance: 0 }
];

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbyBtgy_7EabcnNrTpk3jgRR7GwtCaHm5lcbjZ8HRbOMJF5WygsPvWywS4oH3KLNSPdIDA/exec";

// Express server om HTML te serveren
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  const entriesHTML = leaderboard
    .sort((a, b) => b.balance - a.balance)
    .map((entry, i) => `<div class="entry">#${i + 1} - ${entry.user}: ${entry.balance}</div>`)
    .join('');

  res.send(`
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <title>WhatsApp Webshop</title>
  <style>
    body { background-color: #f7f7f7; font-family: sans-serif; text-align: center; padding-top: 50px; }
    h1 { color: #333; }
    .btn { background: linear-gradient(270deg, red, orange, yellow, green, blue, indigo, violet); background-size: 1500% 1500%; animation: rainbowMove 6s linear infinite; color: white; padding: 15px 25px; font-size: 16px; border: none; border-radius: 8px; cursor: pointer; margin: 10px; transition: transform 0.2s; }
    .btn:hover { transform: scale(1.10); }
    @keyframes rainbowMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    #leaderboard { margin-top: 40px; font-size: 18px; background: white; padding: 20px; max-width: 400px; margin-left: auto; margin-right: auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .entry { margin: 5px 0; }
  </style>
</head>
<body>
  <h1>Welkom bij de WhatsApp Webshop!</h1>
  <button class="btn" onclick="alert('Niet gekoppeld')">TEST Aankoop</button>
  <div id="leaderboard">
    <h2>💰 Leaderboard</h2>
    ${entriesHTML}
  </div>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(chalk.green(`[SERVER] Webpagina live op http://localhost:${PORT}`));
});

// Bot starten
create({ sessionId: "Web-sesh", detectOwnMessages: true, headless: true }).then(async (client) => {
  client.onAnyMessage(async (message) => {
    if (!message.isGroupMsg || message.chat?.name !== 'BOT COMMS') return;
    const content = message.body.trim().toLowerCase();

    // Leaderboard updaten met bericht
    if (content.startsWith("leaderbord info:")) {
      const entries = content.replace("leaderbord info:", "").trim().split(",");
      leaderboard = entries.map(e => {
        const [user, bal] = e.trim().split(" ");
        return { user, balance: Number(bal) || 0 };
      });

      await client.sendText(message.chatId, `✅ Leaderboard bijgewerkt! Bezoek: http://localhost:${PORT}`);
      console.log(chalk.cyan(`[BOT] Leaderboard updated via BOT COMMS`));
    }
  });
});
