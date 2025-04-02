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
    const [transactions] = await db.execute(`
      SELECT id, total_harga, created_at 
      FROM transaksi 
      ORDER BY created_at DESC
    `);

    const transactionDetails = await Promise.all(transactions.map(async (trx) => {
      const [details] = await db.execute(`
        SELECT td.obat_id, o.nama, td.jumlah, td.subtotal 
        FROM transaksi_detail td
        JOIN obat o ON td.obat_id = o.id
        WHERE td.transaksi_id = ?
      `, [trx.id]);

      return { ...trx, details };
    }));

    res.status(200).json({ success: true, transactions: transactionDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal mengambil riwayat transaksi' });
  } finally {
    db.end();
  }
}
