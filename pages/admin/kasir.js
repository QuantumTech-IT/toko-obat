import { useEffect, useState, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ToastContainer, { showToast } from '../../components/Toast';

const formatRupiah = (n) => new Intl.NumberFormat('id-ID').format(n);
const CATEGORIES = ['Semua', 'Antibiotik', 'Vitamin', 'Analgesik', 'Antasida', 'Antiseptik', 'Umum'];

export default function Kasir() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('Semua');
  const [namaPembeli, setNamaPembeli] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const searchRef = useRef(null);

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (kategori !== 'Semua') params.set('kategori', kategori);
    const res = await fetch(`/api/obat?${params}`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    const t = setTimeout(fetchProducts, 250);
    return () => clearTimeout(t);
  }, [search, kategori]);

  const addToCart = (product) => {
    if (product.stok <= 0) { showToast('Stok habis!', 'error'); return; }
    setCart(prev => {
      const idx = prev.findIndex(i => i.id === product.id);
      if (idx !== -1) {
        if (prev[idx].quantity >= product.stok) { showToast('Melebihi stok!', 'warning'); return prev; }
        return prev.map((i, ix) => ix === idx ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
    );
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const totalHarga = cart.reduce((sum, i) => sum + parseFloat(i.harga) * i.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) { showToast('Keranjang kosong!', 'warning'); return; }
    setProcessing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, nama_pembeli: namaPembeli || 'Kasir' }),
      });
      const data = await res.json();
      if (data.success) {
        setReceipt({ id: data.transaksiId, cart: [...cart], namaPembeli: namaPembeli || 'Kasir', totalHarga, date: new Date() });
        setCart([]);
        setNamaPembeli('');
        showToast('Transaksi berhasil!', 'success');
        fetchProducts();
        searchRef.current?.focus();
      } else {
        showToast(data.message || 'Gagal checkout', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handlePrint = () => window.print();
  const handleNewTransaction = () => setReceipt(null);

  return (
    <AdminLayout title="Kasir / POS">
      <ToastContainer />

      {/* Print receipt */}
      {receipt && (
        <div className="hidden print:block p-8 font-mono text-sm">
          <div className="text-center border-b border-dashed border-gray-400 pb-4 mb-4">
            <div className="text-3xl mb-1">💊</div>
            <p className="font-bold text-lg">TOKO OBAT</p>
            <p className="text-xs">{receipt.date.toLocaleString('id-ID')}</p>
          </div>
          <div className="mb-3 text-xs">
            <div className="flex justify-between"><span>No. Transaksi</span><span>#{receipt.id}</span></div>
            <div className="flex justify-between"><span>Kasir/Pembeli</span><span>{receipt.namaPembeli}</span></div>
          </div>
          <div className="border-t border-dashed border-gray-400 pt-3 mb-3">
            {receipt.cart.map(item => (
              <div key={item.id} className="mb-1">
                <div className="flex justify-between">
                  <span>{item.nama}</span>
                  <span>Rp{formatRupiah(item.harga * item.quantity)}</span>
                </div>
                <div className="text-xs text-gray-500 pl-2">{item.quantity} x Rp{formatRupiah(item.harga)}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-400 pt-2 flex justify-between font-bold">
            <span>TOTAL</span><span>Rp{formatRupiah(receipt.totalHarga)}</span>
          </div>
          <p className="text-center text-xs mt-6 border-t border-dashed border-gray-400 pt-4">
            Terima kasih sudah berbelanja 🙏
          </p>
        </div>
      )}

      <div className="no-print flex gap-4 h-[calc(100vh-140px)]">
        {/* Left: Product grid */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Search + category */}
          <div className="mb-3">
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                ref={searchRef}
                type="text"
                placeholder="Cari obat... (F2)"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                autoFocus
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setKategori(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    kategori === cat ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 animate-pulse">
                    <div className="h-10 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {products.map(product => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={product.stok === 0}
                    className={`bg-white rounded-xl p-3 text-left border transition-all hover:border-green-400 hover:shadow-sm ${
                      product.stok === 0 ? 'opacity-40 cursor-not-allowed' : 'border-gray-100 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">💊</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        product.stok === 0 ? 'bg-red-100 text-red-500' :
                        product.stok < 10 ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                        {product.stok === 0 ? 'Habis' : `${product.stok}`}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-800 text-xs leading-tight mb-1 line-clamp-2">{product.nama}</p>
                    <p className="text-green-700 font-bold text-sm">Rp{formatRupiah(product.harga)}</p>
                  </button>
                ))}
                {products.length === 0 && (
                  <div className="col-span-3 text-center py-12 text-gray-400">
                    <div className="text-4xl mb-2">🔍</div>
                    <p>Produk tidak ditemukan</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Cart + receipt */}
        <div className="w-80 flex-shrink-0 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {receipt ? (
            /* Receipt view */
            <div className="flex flex-col h-full">
              <div className="bg-green-600 text-white text-center py-3">
                <div className="text-2xl mb-0.5">✓</div>
                <p className="font-bold">Transaksi Berhasil!</p>
                <p className="text-xs text-green-100">#{receipt.id}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 text-sm">
                <div className="text-center mb-3">
                  <p className="text-gray-500 text-xs">{receipt.date.toLocaleString('id-ID')}</p>
                  <p className="font-medium">{receipt.namaPembeli}</p>
                </div>
                {receipt.cart.map(item => (
                  <div key={item.id} className="flex justify-between py-1.5 border-b border-gray-50">
                    <div>
                      <p className="text-gray-700 text-xs font-medium">{item.nama}</p>
                      <p className="text-gray-400 text-xs">{item.quantity}x Rp{formatRupiah(item.harga)}</p>
                    </div>
                    <span className="font-semibold text-xs">Rp{formatRupiah(item.harga * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-green-700 mt-3 pt-2 border-t">
                  <span>TOTAL</span>
                  <span>Rp{formatRupiah(receipt.totalHarga)}</span>
                </div>
              </div>
              <div className="p-3 flex gap-2 border-t border-gray-100">
                <button onClick={handlePrint} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-sm font-semibold">
                  🖨️ Print
                </button>
                <button onClick={handleNewTransaction} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-sm font-semibold">
                  + Baru
                </button>
              </div>
            </div>
          ) : (
            /* Cart view */
            <>
              <div className="p-3 border-b border-gray-100">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  🛒 Keranjang
                  {cart.length > 0 && (
                    <span className="bg-green-600 text-white text-xs rounded-full px-1.5 py-0.5">{cart.length}</span>
                  )}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-gray-300">
                    <div className="text-4xl mb-2">🛒</div>
                    <p className="text-sm">Pilih produk di kiri</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{item.nama}</p>
                          <p className="text-xs text-green-600">Rp{formatRupiah(item.harga)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold flex items-center justify-center">−</button>
                          <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 bg-green-100 hover:bg-green-200 rounded-full text-xs font-bold text-green-700 flex items-center justify-center">+</button>
                        </div>
                        <div className="text-right min-w-[52px]">
                          <p className="text-xs font-bold">Rp{formatRupiah(item.harga * item.quantity)}</p>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-400 text-xs">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkout area */}
              <div className="border-t border-gray-100 p-3">
                <input
                  type="text"
                  placeholder="Nama pembeli (opsional)"
                  value={namaPembeli}
                  onChange={e => setNamaPembeli(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="flex justify-between font-bold text-gray-800 mb-2">
                  <span>TOTAL</span>
                  <span className="text-green-700 text-lg">Rp{formatRupiah(totalHarga)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={processing || cart.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                >
                  {processing ? 'Memproses...' : '✓ Bayar Sekarang'}
                </button>
                {cart.length > 0 && (
                  <button onClick={() => setCart([])} className="w-full mt-1.5 text-xs text-red-400 hover:text-red-600">
                    Hapus semua
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
