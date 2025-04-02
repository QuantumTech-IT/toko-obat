import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'toko_obat'
  });

  try {
    // Total transaksi
    const [totalTransaksi] = await db.execute('SELECT COUNT(*) AS total FROM transaksi');
    
    // Total penjualan hari ini
    const [penjualanHariIni] = await db.execute(
      "SELECT SUM(total_harga) AS total FROM transaksi WHERE DATE(created_at) = CURDATE()"
    );
    
    // Obat dengan stok rendah (misal di bawah 10)
    const [stokRendah] = await db.execute(
      'SELECT id, nama, stok FROM obat WHERE stok < 10 ORDER BY stok ASC LIMIT 5'
    );
    
    // Transaksi terbaru (ambil 5 transaksi terakhir)
    const [transaksiTerbaru] = await db.execute(
      'SELECT id, total_harga, created_at FROM transaksi ORDER BY created_at DESC LIMIT 5'
    );
    
    res.status(200).json({
      totalTransaksi: totalTransaksi[0].total,
      penjualanHariIni: penjualanHariIni[0].total || 0,
      stokRendah,
      transaksiTerbaru
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data' });
  } finally {
    db.end();
  }
}
