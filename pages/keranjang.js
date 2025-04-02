import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Keranjang() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const totalHarga = cart.reduce((total, item) => total + (parseFloat(item.harga) * parseInt(item.quantity)), 0);
  const handleCheckout = async () => {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart }),
    });
    const data = await response.json();
    if (data.success) {
      localStorage.removeItem('cart');
      setCart([]);
      alert('Checkout berhasil!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Keranjang Belanja</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Keranjang kosong</p>
      ) : (
        <div className="max-w-2xl mx-auto bg-white p-4 shadow-md rounded-lg">
          
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between p-2 border-b">
              <span>{item.nama} (x{item.quantity})</span>
              <span>Rp{item.harga * item.quantity}</span> {/* Ganti price ke harga */}
            </li>
            ))}
          </ul>
          
          <div className="flex justify-between font-bold mt-4">
            <span>Total:</span>
            <span>Rp{totalHarga}</span>
          </div>
          <button 
            onClick={handleCheckout} 
            className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Checkout
          </button>
        </div>
      )}
      <div className="text-center mt-4">
        <Link href="/produk" className="text-blue-600 hover:underline">Lanjut Belanja</Link>
      </div>
    </div>
  );
}
