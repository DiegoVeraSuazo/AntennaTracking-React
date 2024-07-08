const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conecta o crea la base de datos 'satellites.db' en el directorio actual
const db = new sqlite3.Database(path.join(__dirname, 'satellites.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Crea la tabla de satélites si no existe
    db.run(`
      CREATE TABLE IF NOT EXISTS satellites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sat_id TEXT,
        norad_cat_id INTEGER,
        name TEXT,
        names TEXT,
        status TEXT,
        countries TEXT
      )
    `);
  }
});

module.exports = db;
