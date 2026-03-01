import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { cart, nama_pembeli = 'Umum' } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: 'Keranjang kosong' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const totalHarga = cart.reduce(
      (total, item) => total + parseFloat(item.harga) * parseInt(item.quantity),
      0
    );

    const [result] = await conn.execute(
      'INSERT INTO transaksi (total_harga, nama_pembeli) VALUES (?, ?)',
      [totalHarga, nama_pembeli]
    );
    const transaksiId = result.insertId;

    for (const item of cart) {
      await conn.execute(
        'INSERT INTO transaksi_detail (transaksi_id, obat_id, jumlah, subtotal) VALUES (?, ?, ?, ?)',
        [transaksiId, item.id, parseInt(item.quantity), parseFloat(item.harga) * parseInt(item.quantity)]
      );
      await conn.execute(
        'UPDATE obat SET stok = stok - ? WHERE id = ?',
        [parseInt(item.quantity), item.id]
      );
    }

    await conn.commit();
    res.status(200).json({ success: true, transaksiId, totalHarga });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menyimpan transaksi' });
  } finally {
    conn.release();
  }
}
