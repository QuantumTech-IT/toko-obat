import { useEffect, useState } from 'react';

export default function Produk() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/obat', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleAddToCart = (product) => {
    console.log("Produk ditambahkan:", product); // Debugging

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Cek apakah obat sudah ada di keranjang
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    // Cek apakah harga ada dan dalam format angka
  if (!product.harga || isNaN(product.harga)) {
    alert("Error: Harga tidak valid!");
    return;
  }
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1; // Tambah jumlah jika sudah ada
    } else {
      cart.push({ ...product, quantity: 1 }); // Tambahkan produk baru
    }
  
    localStorage.setItem('cart', JSON.stringify(cart)); // Simpan ke localStorage
    alert(`${product.nama} berhasil ditambahkan ke keranjang!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
    <h2 className="text-2xl font-bold text-center mb-4">Daftar Produk</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="bg-white p-4 shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">{product.nama}</h3>
          <p className="text-gray-700">Rp{product.harga}</p>
          <button 
            onClick={() => handleAddToCart(product)} 
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Tambah ke Keranjang
          </button>
        </div>
      ))}
    </div>
  </div>
  );
}
