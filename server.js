const app = require('./app');
const pool = require('./config/database');

const PORT = process.env.PORT || 3000;

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar ao MariaDB/MySQL:', err.message);
    process.exit(1);
  }

  console.log('Conectado ao MariaDB/MySQL com sucesso');
  connection.release();

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
