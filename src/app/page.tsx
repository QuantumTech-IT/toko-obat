import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between">
        <h1 className="text-xl font-bold">Toko Obat</h1>
        <div>
          <Link href="/produk" className="mr-4 hover:text-blue-600">
            Produk
          </Link>
          <Link href="/keranjang" className="hover:text-blue-600">
            Keranjang
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Selamat Datang di Toko Obat</h2>
        <p className="text-gray-700">Temukan berbagai obat yang Anda butuhkan dengan mudah.</p>
        <Link
          href="/produk"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Lihat Produk
        </Link>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-md text-center p-4 mt-6">
        &copy; {new Date().getFullYear()} Toko Obat. All rights reserved.
      </footer>
    </div>
  );
}
// Halaman Produk
export function Produk() {
  const products = [
    { id: 1, name: "Paracetamol", price: "Rp10.000" },
    { id: 2, name: "Amoxicillin", price: "Rp25.000" },
    { id: 3, name: "Vitamin C", price: "Rp15.000" }
  ];
  
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Daftar Produk</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 shadow-md rounded-lg text-center">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-700">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

