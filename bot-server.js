// server.js
const express = require('express');
const { create } = require('@open-wa/wa-automate');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let client; // Wordt straks de WhatsApp client

// Start WhatsApp client
create().then((_client) => {
  client = _client;

  // Trigger route
  app.post('/trigger', async (req, res) => {
    const { gebruiker, item, verkoper, bedrag } = req.body;

    const message = `💬 ${gebruiker} heeft het item "${item}" gekocht voor €${bedrag} bij ${verkoper}.`;

    try {
      await client.sendText("31642807274@c.us", message); // Zet hier een geldig WhatsApp-nummer of groeps-ID
      res.status(200).send({ status: 'ok' });
    } catch (err) {
      console.error("Fout bij versturen:", err);
      res.status(500).send({ error: 'Kon bericht niet versturen' });
    }
  });
});

// Start server
app.listen(3000, () => {
  console.log('Bot-server draait op http://localhost:3000');
});
