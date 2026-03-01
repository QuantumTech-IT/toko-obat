import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { search = '', kategori = '' } = req.query;

  let sql = 'SELECT * FROM obat WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND nama LIKE ?';
    params.push(`%${search}%`);
  }
  if (kategori) {
    sql += ' AND kategori = ?';
    params.push(kategori);
  }

  sql += ' ORDER BY nama ASC';

  try {
    const [rows] = await pool.execute(sql, params);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data obat' });
  }
}
