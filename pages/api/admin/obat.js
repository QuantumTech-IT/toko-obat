import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { search = '' } = req.query;
    let sql = 'SELECT * FROM obat';
    const params = [];
    if (search) {
      sql += ' WHERE nama LIKE ?';
      params.push(`%${search}%`);
    }
    sql += ' ORDER BY nama ASC';
    const [rows] = await pool.execute(sql, params);
    return res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    const { nama, kategori = 'Umum', harga, stok, expired_at = null } = req.body;
    await pool.execute(
      'INSERT INTO obat (nama, kategori, harga, stok, expired_at) VALUES (?, ?, ?, ?, ?)',
      [nama, kategori, harga, stok, expired_at || null]
    );
    return res.status(201).json({ message: 'Obat ditambahkan' });
  }

  if (req.method === 'PUT') {
    const { id, nama, kategori = 'Umum', harga, stok, expired_at = null } = req.body;
    await pool.execute(
      'UPDATE obat SET nama = ?, kategori = ?, harga = ?, stok = ?, expired_at = ? WHERE id = ?',
      [nama, kategori, harga, stok, expired_at || null, id]
    );
    return res.status(200).json({ message: 'Obat diperbarui' });
  }

  if (req.method === 'PATCH') {
    const { id, stokTambah } = req.body;
    await pool.execute('UPDATE obat SET stok = stok + ? WHERE id = ?', [stokTambah, id]);
    return res.status(200).json({ message: 'Stok ditambah' });
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    await pool.execute('DELETE FROM obat WHERE id = ?', [id]);
    return res.status(200).json({ message: 'Obat dihapus' });
  }

  return res.status(405).end();
}
