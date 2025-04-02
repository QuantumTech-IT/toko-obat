import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Kosongkan kalau pakai XAMPP default
    database: 'toko_obat'
  });

  if (req.method === 'GET') {
    const [rows] = await db.execute('SELECT * FROM obat');
    res.status(200).json(rows);
  }
}
