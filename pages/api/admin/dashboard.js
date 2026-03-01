import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const [[{ total: totalTransaksi }]] = await pool.execute(
      'SELECT COUNT(*) AS total FROM transaksi'
    );

    const [[{ total: penjualanHariIni }]] = await pool.execute(
      "SELECT COALESCE(SUM(total_harga), 0) AS total FROM transaksi WHERE DATE(created_at) = CURDATE()"
    );

    const [[{ total: totalPenjualan }]] = await pool.execute(
      'SELECT COALESCE(SUM(total_harga), 0) AS total FROM transaksi'
    );

    const [stokRendah] = await pool.execute(
      'SELECT id, nama, stok FROM obat WHERE stok < 10 ORDER BY stok ASC LIMIT 5'
    );

    const [expiredSoon] = await pool.execute(
      `SELECT id, nama, stok, expired_at
       FROM obat
       WHERE expired_at IS NOT NULL AND expired_at <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
       ORDER BY expired_at ASC LIMIT 5`
    );

    const [transaksiTerbaru] = await pool.execute(
      'SELECT id, total_harga, nama_pembeli, created_at FROM transaksi ORDER BY created_at DESC LIMIT 5'
    );

    res.status(200).json({
      totalTransaksi,
      penjualanHariIni,
      totalPenjualan,
      stokRendah,
      expiredSoon,
      transaksiTerbaru,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data dashboard' });
  }
}
