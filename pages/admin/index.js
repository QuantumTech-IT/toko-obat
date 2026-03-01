import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';

const formatRupiah = (n) => new Intl.NumberFormat('id-ID').format(n);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => {
        if (res.status === 401) { router.push('/login'); return null; }
        return res.json();
      })
      .then(d => { if (d) { setData(d); setLoading(false); } });
  }, [router]);

  const statCards = data ? [
    { label: 'Total Transaksi', value: data.totalTransaksi, icon: '📋', color: 'bg-blue-50 text-blue-700' },
    { label: 'Penjualan Hari Ini', value: `Rp${formatRupiah(data.penjualanHariIni)}`, icon: '📈', color: 'bg-green-50 text-green-700' },
    { label: 'Total Penjualan', value: `Rp${formatRupiah(data.totalPenjualan)}`, icon: '💰', color: 'bg-purple-50 text-purple-700' },
    { label: 'Stok Rendah', value: data.stokRendah.length, icon: '⚠️', color: 'bg-yellow-50 text-yellow-700' },
  ] : [];

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-5 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {statCards.map(card => (
              <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                  {card.icon}
                </div>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-gray-500 text-sm mt-0.5">{card.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaksi Terbaru */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-bold text-gray-800 mb-4">Transaksi Terbaru</h2>
              {data.transaksiTerbaru.length === 0 ? (
                <p className="text-gray-400 text-sm">Belum ada transaksi</p>
              ) : (
                <div className="space-y-3">
                  {data.transaksiTerbaru.map(trx => (
                    <div key={trx.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="font-semibold text-sm text-gray-800">#{trx.id} · {trx.nama_pembeli || 'Umum'}</p>
                        <p className="text-xs text-gray-400">{new Date(trx.created_at).toLocaleString('id-ID')}</p>
                      </div>
                      <span className="font-bold text-green-700 text-sm">Rp{formatRupiah(trx.total_harga)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Stok Rendah */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>⚠️</span> Stok Rendah
                </h2>
                {data.stokRendah.length === 0 ? (
                  <p className="text-green-600 text-sm font-medium">✓ Semua stok aman</p>
                ) : (
                  <div className="space-y-2">
                    {data.stokRendah.map(obat => (
                      <div key={obat.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{obat.nama}</span>
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold pulse-red">{obat.stok}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mendekati Kadaluarsa */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>📅</span> Mendekati Kadaluarsa
                </h2>
                {data.expiredSoon.length === 0 ? (
                  <p className="text-green-600 text-sm font-medium">✓ Tidak ada yang mendekati kadaluarsa</p>
                ) : (
                  <div className="space-y-2">
                    {data.expiredSoon.map(obat => (
                      <div key={obat.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{obat.nama}</span>
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                          {new Date(obat.expired_at).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
