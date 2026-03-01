import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-green-700 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-2xl">💊</span>
            <span>Toko Obat</span>
          </div>
          <div className="flex gap-2">
            <Link href="/produk" className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">Produk</Link>
            <Link href="/keranjang" className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">🛒 Keranjang</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-green-700 to-green-900 text-white py-20 px-4 text-center">
        <div className="text-6xl mb-4">💊</div>
        <h1 className="text-4xl font-bold mb-3">Selamat Datang di Toko Obat</h1>
        <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
          Temukan berbagai obat & produk kesehatan yang Anda butuhkan dengan mudah dan cepat.
        </p>
        <Link
          href="/produk"
          className="bg-white text-green-700 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition-colors text-lg"
        >
          Belanja Sekarang
        </Link>
      </div>

      {/* Quick Links */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Layanan Kami</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link href="/produk" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center group">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">🏥</div>
            <h3 className="font-bold text-gray-800 text-lg mb-1">Produk Obat</h3>
            <p className="text-gray-500 text-sm">Berbagai pilihan obat & suplemen kesehatan</p>
          </Link>
          <Link href="/keranjang" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center group">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">🛒</div>
            <h3 className="font-bold text-gray-800 text-lg mb-1">Keranjang</h3>
            <p className="text-gray-500 text-sm">Lihat & checkout pesanan Anda</p>
          </Link>
          <Link href="/riwayat" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center group">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">📋</div>
            <h3 className="font-bold text-gray-800 text-lg mb-1">Riwayat</h3>
            <p className="text-gray-500 text-sm">Riwayat transaksi pembelian</p>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 text-center py-6 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Toko Obat · Sehat bersama kami
        <span className="mx-2">·</span>
        <Link href="/login" className="hover:text-green-600">Admin</Link>
      </footer>
    </div>
  );
}
