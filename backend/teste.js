const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Olá, mundo!');
  });

app.post('/api/send-message', (req, res) => {
  const receivedMessage = req.body.message;
  res.json({ response: `Você disse: ${receivedMessage}` });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});