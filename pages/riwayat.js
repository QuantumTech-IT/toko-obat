import { useEffect, useState } from 'react';

export default function Riwayat() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch('/api/riwayat')
      .then(res => res.json())
      .then(data => {
        if (data.success) setTransactions(data.transactions);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Riwayat Transaksi</h2>
      {transactions.length === 0 ? (
        <p className="text-center text-gray-600">Belum ada transaksi</p>
      ) : (
        <div className="max-w-3xl mx-auto bg-white p-4 shadow-md rounded-lg">
          {transactions.map((trx) => (
            <div key={trx.id} className="mb-4 p-4 border-b">
              <h3 className="font-semibold">Transaksi #{trx.id}</h3>
              <p className="text-gray-600">Total: Rp{trx.total_harga}</p>
              <p className="text-gray-600">Tanggal: {new Date(trx.created_at).toLocaleString()}</p>
              <ul className="mt-2">
                {trx.details.map((item) => (
                  <li key={item.obat_id} className="text-gray-800">
                    {item.nama} (x{item.jumlah}) - Rp{item.subtotal}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
