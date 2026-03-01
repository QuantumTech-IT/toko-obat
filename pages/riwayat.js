import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ToastContainer from '../components/Toast';

const formatRupiah = (n) => new Intl.NumberFormat('id-ID').format(n);

export default function Riwayat() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [printTrx, setPrintTrx] = useState(null);

  useEffect(() => {
    fetch('/api/riwayat')
      .then(res => res.json())
      .then(data => {
        if (data.success) setTransactions(data.transactions);
        setLoading(false);
      });
  }, []);

  const handlePrint = (trx) => {
    setPrintTrx(trx);
    setTimeout(() => { window.print(); setPrintTrx(null); }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="no-print"><Navbar /></div>

      {/* Print area */}
      {printTrx && (
        <div className="hidden print:block p-8">
          <div className="text-center border-b border-dashed pb-4 mb-4">
            <div className="text-3xl mb-1">💊</div>
            <h2 className="font-bold text-xl">Toko Obat</h2>
            <p className="text-gray-400 text-xs">{new Date(printTrx.created_at).toLocaleString('id-ID')}</p>
          </div>
          <div className="mb-4 text-sm">
            <div className="flex justify-between"><span>No. Transaksi</span><span>#{printTrx.id}</span></div>
            <div className="flex justify-between"><span>Pembeli</span><span>{printTrx.nama_pembeli || 'Umum'}</span></div>
          </div>
          <div className="border-t border-dashed pt-4 mb-4">
            {printTrx.details.map(item => (
              <div key={item.obat_id} className="flex justify-between text-sm py-1">
                <span>{item.nama} x{item.jumlah}</span>
                <span>Rp{formatRupiah(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>TOTAL</span>
            <span>Rp{formatRupiah(printTrx.total_harga)}</span>
          </div>
          <p className="text-center text-xs mt-6">Terima kasih 🙏</p>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-8 no-print">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Riwayat Transaksi</h1>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">📋</div>
            <p className="font-medium">Belum ada transaksi</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map(trx => (
              <div key={trx.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(expanded === trx.id ? null : trx.id)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800">Transaksi #{trx.id}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Selesai</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-0.5">
                      {trx.nama_pembeli || 'Umum'} · {new Date(trx.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-700">Rp{formatRupiah(trx.total_harga)}</p>
                    <span className="text-gray-400 text-xs">{expanded === trx.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expanded === trx.id && (
                  <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-400 text-xs">
                          <th className="text-left pb-2">Produk</th>
                          <th className="text-center pb-2">Qty</th>
                          <th className="text-right pb-2">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trx.details.map(item => (
                          <tr key={item.obat_id} className="border-t border-gray-50">
                            <td className="py-1.5 text-gray-700">{item.nama}</td>
                            <td className="py-1.5 text-center text-gray-500">{item.jumlah}</td>
                            <td className="py-1.5 text-right font-medium">Rp{formatRupiah(item.subtotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      onClick={() => handlePrint(trx)}
                      className="mt-3 text-sm text-green-600 hover:text-green-800 font-medium"
                    >
                      🖨️ Cetak Struk
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
