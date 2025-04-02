import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'toko_obat'
  });

  if (req.method === 'GET') {
    const [rows] = await db.execute('SELECT * FROM obat');
    return res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    const { nama, harga, stok } = req.body;
    await db.execute('INSERT INTO obat (nama, harga, stok) VALUES (?, ?, ?)', [nama, harga, stok]);
    return res.status(201).json({ message: 'Obat ditambahkan' });
  }

  if (req.method === 'PUT') {
    const { id, nama, harga, stok } = req.body;
    await db.execute('UPDATE obat SET nama = ?, harga = ?, stok = ? WHERE id = ?', [nama, harga, stok, id]);
    return res.status(200).json({ message: 'Obat diperbarui' });
  }

  if (req.method === 'PATCH') {
    const { id, stokTambah } = req.body;
    await db.execute('UPDATE obat SET stok = stok + ? WHERE id = ?', [stokTambah, id]);
    return res.status(200).json({ message: 'Stok obat ditambah' });
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    await db.execute('DELETE FROM obat WHERE id = ?', [id]);
    return res.status(200).json({ message: 'Obat dihapus' });
  }

  db.end();
  return res.status(405).json({ message: 'Method Not Allowed' });
}
