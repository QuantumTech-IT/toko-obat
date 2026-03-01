import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('cart-updated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('cart-updated', updateCount);
    };
  }, []);

  const isActive = (path) => router.pathname === path;

  return (
    <nav className="bg-green-700 text-white shadow-md no-print">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">💊</span>
          <span>Toko Obat</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/produk"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/produk') ? 'bg-white text-green-700' : 'hover:bg-green-600'}`}
          >
            Produk
          </Link>
          <Link
            href="/riwayat"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/riwayat') ? 'bg-white text-green-700' : 'hover:bg-green-600'}`}
          >
            Riwayat
          </Link>
          <Link
            href="/keranjang"
            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/keranjang') ? 'bg-white text-green-700' : 'hover:bg-green-600'}`}
          >
            🛒 Keranjang
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
