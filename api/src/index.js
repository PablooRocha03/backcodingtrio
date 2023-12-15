const express = require('express');
const cors = require('cors')
const mysql = require('mysql2/promise'); // Use o pacote mysql2
const app = express();

app.use(express.json());
app.use(cors());

// Configurações para o MySQL
const pool = mysql.createPool({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'Oblapdev2711.',
    database: 'databasejs',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

// Operações CRUD para a tabela "databasejs"
const executeQuery = async (query, values = []) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query, values);
    return rows;
  } finally {
    connection.release();
  }
};

// CREATE
app.post('/', async (req, res) => {
  try {
    const { Nome, preco, quantidade } = req.body;
    const query = 'INSERT INTO meusitens (Nome, preco, quantidade) VALUES (?, ?, ?)';
    await executeQuery(query, [Nome, preco, quantidade]);
    res.status(201).json({ message: 'Registro criado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// READ
app.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM meusitens';
    const rows = await executeQuery(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// UPDATE
app.put('/:Nome', async (req, res) => {
  try {
    const { preco, quantidade } = req.body;
    const Nome = req.params.Nome;
    const query = 'UPDATE meusitens SET preco=?, quantidade=? WHERE Nome=?';
    await executeQuery(query, [ preco, quantidade, Nome]);
    res.json({ message: 'Registro atualizado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// DELETE
app.delete('/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const query = 'DELETE FROM meusitens WHERE Nome=?';
    await executeQuery(query, [name]);
    res.json({ message: 'Registro excluído com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server rodando na porta http://localhost:${port}`));