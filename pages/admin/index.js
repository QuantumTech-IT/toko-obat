import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalTransaksi: 0, totalPenjualan: 0, stokTerendah: [] });
  const [transaksiTerbaru, setTransaksiTerbaru] = useState([]);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setTransaksiTerbaru(data.transaksiTerbaru);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Dashboard Admin</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Total Transaksi</h3>
          <p className="text-2xl font-bold">{stats.totalTransaksi}</p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Total Penjualan Hari Ini</h3>
          <p className="text-2xl font-bold">Rp{stats.totalPenjualan}</p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Obat Stok Rendah</h3>
          <ul>
            {stats.stokTerendah.map((obat, index) => (
              <li key={index}>{obat.nama} ({obat.stok})</li>
            ))}
          </ul>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-2">Transaksi Terbaru</h3>
      <div className="bg-white p-4 shadow-md rounded-lg">
        <ul>
          {transaksiTerbaru.map((trx) => (
            <li key={trx.id} className="flex justify-between p-2 border-b">
              <span>ID {trx.id} - Rp{trx.total_harga}</span>
              <span>{new Date(trx.created_at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-6 flex justify-around">
        <Link href="/admin/obat" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Kelola Obat</Link>
        <Link href="/admin/transaksi" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Lihat Transaksi</Link>
        <Link href="/admin/kasir" className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700">Kasir Mode</Link>
      </div>
    </div>
  );
}
