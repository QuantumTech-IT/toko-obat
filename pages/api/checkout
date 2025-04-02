import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { cart } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: 'Keranjang kosong' });
  }
   // Simulasi penyimpanan ke database
   console.log("Data transaksi:", cart);
   console.log("Data transaksi sebelum disimpan:", cart);
   

  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'toko_obat'
  });

  try {
    // Simpan transaksi utama
    const [result] = await db.execute('INSERT INTO transaksi (total_harga) VALUES (?)', [
      cart.reduce((total, item) => total + item.harga * item.quantity, 0)
    ]);
    
    const transaksiId = result.insertId;
    
    // Simpan detail transaksi
    const detailQueries = cart.map(item => (
      db.execute(
        'INSERT INTO transaksi_detail (transaksi_id, obat_id, jumlah, subtotal) VALUES (?, ?, ?, ?)',
        [transaksiId, item.id, parseInt(item.quantity), parseFloat(item.harga) * parseInt(item.quantity)]
      )
    ));    
    await Promise.all(detailQueries);

    res.status(200).json({ success: true, transaksiId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menyimpan transaksi' });
  } finally {
    db.end();
  }
}
