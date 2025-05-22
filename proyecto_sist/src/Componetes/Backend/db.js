const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'usuario_prueba',
  password: '12345',
  database: 'bd_documentitos'
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a la DB:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

module.exports = db;
