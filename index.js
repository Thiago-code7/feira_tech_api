const express = require('express');
const { sequelize } = require('./src/config/configDB');
require('dotenv').config();

const expositorRoutes = require('./src/modules/expositor/routes/expositorRoutes');
const prototipoRoutes = require('./src/modules/prototipo/routes/prototipoRoutes');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// Rotas
app.use('/expositores', expositorRoutes);
app.use('/prototipos', prototipoRoutes);

//await sequelize.sync({ force: true });

app.listen(PORT, () => {
  console.log(`Aplicação rodando em http://localhost:${PORT}`);
});

module.exports = app;
