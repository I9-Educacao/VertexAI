const express = require('express');
const cors = require('cors');
const vertexRoutes = require('./vertexRoutes');
const app = express();
const port = 3000;

app.use(cors());
app.use('/', vertexRoutes);

app.listen(port, () => {
  console.log(`Aplicação rodando em http://localhost:${port}`);
});
