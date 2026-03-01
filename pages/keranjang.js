import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import ToastContainer, { showToast } from '../components/Toast';

const formatRupiah = (n) => new Intl.NumberFormat('id-ID').format(n);

export default function Keranjang() {
  const [cart, setCart] = useState([]);
  const [namaPembeli, setNamaPembeli] = useState('');
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const receiptRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const syncCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const updateQty = (id, delta) => {
    const newCart = cart
      .map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
      .filter(item => item.quantity > 0);
    syncCart(newCart);
  };

  const removeItem = (id) => {
    syncCart(cart.filter(item => item.id !== id));
    showToast('Item dihapus dari keranjang', 'info');
  };

  const totalHarga = cart.reduce((sum, item) => sum + parseFloat(item.harga) * item.quantity, 0);

  const handleCheckout = async () => {
    if (!namaPembeli.trim()) {
      showToast('Masukkan nama pembeli!', 'warning');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, nama_pembeli: namaPembeli }),
      });
      const data = await res.json();
      if (data.success) {
        setReceipt({ transaksiId: data.transaksiId, cart, namaPembeli, totalHarga, date: new Date() });
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cart-updated'));
        setCart([]);
        showToast('Checkout berhasil!', 'success');
      } else {
        showToast(data.message || 'Checkout gagal', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  if (receipt) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer />
        <div className="no-print">
          <Navbar />
        </div>
        <div className="max-w-md mx-auto px-4 py-8">
          {/* Receipt */}
          <div ref={receiptRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-center border-b border-dashed border-gray-300 pb-4 mb-4">
              <div className="text-3xl mb-1">💊</div>
              <h2 className="font-bold text-xl">Toko Obat</h2>
              <p className="text-gray-400 text-xs">Jl. Kesehatan No. 1</p>
              <p className="text-gray-400 text-xs">{receipt.date.toLocaleString('id-ID')}</p>
            </div>

            <div className="mb-4 text-sm">
              <div className="flex justify-between text-gray-500 mb-1">
                <span>No. Transaksi</span>
                <span className="font-mono font-medium">#{receipt.transaksiId}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Pembeli</span>
                <span className="font-medium">{receipt.namaPembeli}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-300 pt-4 mb-4">
              {receipt.cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1">
                  <span className="text-gray-700">{item.nama} <span className="text-gray-400">x{item.quantity}</span></span>
                  <span className="font-medium">Rp{formatRupiah(item.harga * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 pt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL</span>
                <span className="text-green-700">Rp{formatRupiah(receipt.totalHarga)}</span>
              </div>
            </div>

            <div className="text-center mt-6 text-xs text-gray-400 border-t border-dashed border-gray-300 pt-4">
              Terima kasih atas kepercayaan Anda 🙏
            </div>
          </div>

          <div className="flex gap-3 mt-4 no-print">
            <button
              onClick={handlePrint}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              🖨️ Cetak Struk
            </button>
            <Link
              href="/produk"
              className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-center hover:bg-gray-50 transition-colors"
            >
              Belanja Lagi
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Keranjang Belanja</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">🛒</div>
            <p className="font-medium text-lg">Keranjang masih kosong</p>
            <Link href="/produk" className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
              {cart.map((item, i) => (
                <div key={item.id} className={`flex items-center gap-4 p-4 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                  <div className="bg-green-50 rounded-xl w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💊</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{item.nama}</p>
                    <p className="text-green-600 font-bold text-sm">Rp{formatRupiah(item.harga)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center">−</button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full bg-green-100 hover:bg-green-200 text-green-700 font-bold flex items-center justify-center">+</button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="font-bold text-gray-800 text-sm">Rp{formatRupiah(item.harga * item.quantity)}</p>
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 text-xs mt-0.5">Hapus</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pembeli</label>
              <input
                type="text"
                value={namaPembeli}
                onChange={e => setNamaPembeli(e.target.value)}
                placeholder="Masukkan nama pembeli..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex justify-between text-gray-500 text-sm mb-1">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} item)</span>
                <span>Rp{formatRupiah(totalHarga)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-2 mt-2">
                <span>Total</span>
                <span className="text-green-700">Rp{formatRupiah(totalHarga)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
              >
                {loading ? 'Memproses...' : '✓ Checkout Sekarang'}
              </button>
              <Link href="/produk" className="block text-center text-green-600 hover:underline mt-3 text-sm">
                ← Lanjut Belanja
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
