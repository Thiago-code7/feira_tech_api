require('dotenv').config();
const express = require('express');
const { sequelize } = require('./config/configDB');

const expositorRoutes = require('./src/modules/expositor/routes/expositorRoutes');
const prototipoRoutes = require('./src/modules/prototipo/routes/prototipoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/expositores', expositorRoutes);
app.use('/prototipos', prototipoRoutes);

// Só liga o servidor se este arquivo for executado diretamente
if (require.main === module) {
  sequelize.sync({ force: true })
    .then(() => {
      console.log('📦 Banco sincronizado com sucesso!');
      app.listen(PORT, () => {
        console.log(`🚀 Aplicação rodando em http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('❌ Erro ao conectar no banco:', error);
    });
}

module.exports = app;


