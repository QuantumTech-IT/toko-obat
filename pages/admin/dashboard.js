import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(data => setDashboardData(data))
      .catch(err => console.error('Error fetching dashboard data:', err));
  }, []);

  if (!dashboardData) {
    return <p className="text-center p-6">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Dashboard Admin</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Total Transaksi</h3>
          <p className="text-xl font-bold">{dashboardData.totalTransaksi}</p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Penjualan Hari Ini</h3>
          <p className="text-xl font-bold">Rp{dashboardData.penjualanHariIni}</p>
        </div>
      </div>

      <h3 className="text-xl font-bold mt-6">Obat dengan Stok Rendah</h3>
      <ul className="bg-white p-4 shadow-md rounded-lg mt-2">
        {dashboardData.stokRendah.length > 0 ? (
          dashboardData.stokRendah.map((obat) => (
            <li key={obat.id} className="flex justify-between border-b p-2">
              <span>{obat.nama}</span>
              <span className="text-red-500">Stok: {obat.stok}</span>
            </li>
          ))
        ) : (
          <p className="text-gray-600">Semua stok aman</p>
        )}
      </ul>

      <h3 className="text-xl font-bold mt-6">Transaksi Terbaru</h3>
      <ul className="bg-white p-4 shadow-md rounded-lg mt-2">
        {dashboardData.transaksiTerbaru.map((trx) => (
          <li key={trx.id} className="flex justify-between border-b p-2">
            <span>ID: {trx.id}</span>
            <span>Total: Rp{trx.total_harga}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
