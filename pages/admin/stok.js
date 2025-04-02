import { useEffect, useState } from 'react';

export default function ManajemenStok() {
  const [obat, setObat] = useState([]);
  const [form, setForm] = useState({ id: '', nama: '', harga: '', stok: '' });

  useEffect(() => {
    fetchObat();
  }, []);

  const fetchObat = async () => {
    const res = await fetch('/api/admin/obat');
    const data = await res.json();
    setObat(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.id) {
      // Jika ID ada, update stok
      await fetch('/api/admin/obat', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: form.id, stokTambah: form.stok }),
      });
    } else {
      // Jika ID kosong, tambah obat baru
      await fetch('/api/admin/obat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }

    fetchObat();
    setForm({ id: '', nama: '', harga: '', stok: '' });
  };

  const handleSelectObat = (item) => {
    setForm({ id: item.id, nama: item.nama, harga: item.harga, stok: '' }); // Reset stok agar hanya menambah, bukan mengganti total stok
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-4">Manajemen Stok Obat</h2>

      {/* Form Tambah / Tambah Stok */}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-4 shadow-md rounded-lg mb-6">
        <input type="hidden" value={form.id} />
        <input type="text" placeholder="Nama Obat" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="w-full p-2 border rounded mb-2" required disabled={!!form.id} />
        <input type="number" placeholder="Harga" value={form.harga} onChange={(e) => setForm({ ...form, harga: e.target.value })} className="w-full p-2 border rounded mb-2" required disabled={!!form.id} />
        <input type="number" placeholder="Jumlah Tambah Stok" value={form.stok} onChange={(e) => setForm({ ...form, stok: e.target.value })} className="w-full p-2 border rounded mb-2" required />
        <button className="w-full p-2 bg-blue-600 text-white rounded">{form.id ? 'Tambah Stok' : 'Tambah Obat'}</button>
      </form>

      {/* Tabel Data Obat */}
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Nama</th>
            <th className="p-2">Harga</th>
            <th className="p-2">Stok</th>
          </tr>
        </thead>
        <tbody>
          {obat.map((item) => (
            <tr key={item.id} className="border-t cursor-pointer hover:bg-gray-100" onClick={() => handleSelectObat(item)}>
              <td className="p-2">{item.nama}</td>
              <td className="p-2">Rp{item.harga}</td>
              <td className="p-2">{item.stok}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
