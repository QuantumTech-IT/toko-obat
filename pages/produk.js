import { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import ToastContainer, { showToast } from '../components/Toast';

const CATEGORIES = ['Semua', 'Antibiotik', 'Vitamin', 'Analgesik', 'Antasida', 'Antiseptik', 'Umum'];

const formatRupiah = (n) => new Intl.NumberFormat('id-ID').format(n);

export default function Produk() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('Semua');
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (kategori !== 'Semua') params.set('kategori', kategori);
    const res = await fetch(`/api/obat?${params}`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }, [search, kategori]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleAddToCart = (product) => {
    if (!product.harga || isNaN(product.harga)) {
      showToast('Harga tidak valid!', 'error');
      return;
    }
    if (product.stok <= 0) {
      showToast('Stok habis!', 'error');
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = cart.findIndex(item => item.id === product.id);
    if (idx !== -1) {
      if (cart[idx].quantity >= product.stok) {
        showToast('Melebihi stok tersedia!', 'warning');
        return;
      }
      cart[idx].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    showToast(`${product.nama} ditambahkan ke keranjang`, 'success');
  };

  const isExpired = (date) => date && new Date(date) < new Date();
  const isNearExpiry = (date) => {
    if (!date) return false;
    const diff = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Daftar Produk Obat</h1>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Cari obat..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setKategori(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                kategori === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                <div className="bg-gray-200 rounded-lg h-24 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-medium">Produk tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-center justify-center bg-green-50 rounded-xl h-20 mb-3">
                  <span className="text-4xl">💊</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight">{product.nama}</h3>
                    {isExpired(product.expired_at) && (
                      <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full whitespace-nowrap">Expired</span>
                    )}
                    {isNearExpiry(product.expired_at) && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full whitespace-nowrap pulse-red">Segera ED</span>
                    )}
                  </div>

                  <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">{product.kategori}</span>

                  <p className="text-green-700 font-bold mt-2 text-base">Rp{formatRupiah(product.harga)}</p>

                  <div className={`text-xs mt-1 font-medium ${product.stok === 0 ? 'text-red-500' : product.stok < 10 ? 'text-yellow-600' : 'text-gray-400'}`}>
                    {product.stok === 0 ? '✕ Stok habis' : `Stok: ${product.stok}`}
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stok === 0 || isExpired(product.expired_at)}
                  className="mt-3 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
                >
                  {product.stok === 0 ? 'Stok Habis' : '+ Keranjang'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
