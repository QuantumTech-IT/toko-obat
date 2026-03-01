import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ToastContainer, { showToast } from '../../components/Toast';

const formatRupiah = (n) => new Intl.NumberFormat('id-ID').format(n);
const CATEGORIES = ['Umum', 'Antibiotik', 'Vitamin', 'Analgesik', 'Antasida', 'Antiseptik'];
const EMPTY_FORM = { id: '', nama: '', kategori: 'Umum', harga: '', stok: '', expired_at: '' };

export default function ManajemenStok() {
  const [obat, setObat] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchObat = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/obat${search ? `?search=${search}` : ''}`);
    const data = await res.json();
    setObat(data);
    setLoading(false);
  };

  useEffect(() => {
    const t = setTimeout(fetchObat, 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = form.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/obat', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, expired_at: form.expired_at || null }),
      });
      const data = await res.json();
      showToast(data.message, 'success');
      setForm(EMPTY_FORM);
      setShowForm(false);
      fetchObat();
    } catch {
      showToast('Gagal menyimpan', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      nama: item.nama,
      kategori: item.kategori || 'Umum',
      harga: item.harga,
      stok: item.stok,
      expired_at: item.expired_at ? item.expired_at.split('T')[0] : '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const res = await fetch('/api/admin/obat', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    showToast(data.message, 'success');
    setDeleteId(null);
    fetchObat();
  };

  const isExpiredSoon = (date) => {
    if (!date) return false;
    const diff = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  };
  const isExpired = (date) => date && new Date(date) < new Date();

  return (
    <AdminLayout title="Manajemen Obat">
      <ToastContainer />

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Hapus Obat?</h3>
            <p className="text-gray-500 text-sm mb-4">Tindakan ini tidak bisa dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-50">Batal</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-600 text-white py-2 rounded-xl hover:bg-red-700">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Header + Add button */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Cari obat..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64 bg-white"
          />
        </div>
        <button
          onClick={() => { setForm(EMPTY_FORM); setShowForm(!showForm); }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <span>+</span> Tambah Obat
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">{form.id ? 'Edit Obat' : 'Tambah Obat Baru'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nama Obat *</label>
              <input
                type="text" value={form.nama} required
                onChange={e => setForm({ ...form, nama: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nama obat"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Kategori</label>
              <select
                value={form.kategori}
                onChange={e => setForm({ ...form, kategori: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Harga (Rp) *</label>
              <input
                type="number" value={form.harga} required min="0"
                onChange={e => setForm({ ...form, harga: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Stok *</label>
              <input
                type="number" value={form.stok} required min="0"
                onChange={e => setForm({ ...form, stok: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tanggal Kadaluarsa</label>
              <input
                type="date" value={form.expired_at}
                onChange={e => setForm({ ...form, expired_at: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit" disabled={saving}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-2 rounded-lg text-sm font-semibold"
              >
                {saving ? 'Menyimpan...' : (form.id ? 'Simpan Perubahan' : 'Tambah Obat')}
              </button>
              <button
                type="button"
                onClick={() => { setForm(EMPTY_FORM); setShowForm(false); }}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold">Nama</th>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold">Kategori</th>
              <th className="text-right px-4 py-3 text-gray-600 font-semibold">Harga</th>
              <th className="text-center px-4 py-3 text-gray-600 font-semibold">Stok</th>
              <th className="text-center px-4 py-3 text-gray-600 font-semibold">Kadaluarsa</th>
              <th className="text-center px-4 py-3 text-gray-600 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-t border-gray-50 animate-pulse">
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                  ))}
                </tr>
              ))
            ) : obat.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400">Tidak ada data</td></tr>
            ) : (
              obat.map(item => (
                <tr key={item.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{item.nama}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{item.kategori}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">Rp{formatRupiah(item.harga)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      item.stok === 0 ? 'bg-red-100 text-red-600' :
                      item.stok < 10 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      {item.stok}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.expired_at ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isExpired(item.expired_at) ? 'bg-red-100 text-red-600' :
                        isExpiredSoon(item.expired_at) ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {new Date(item.expired_at).toLocaleDateString('id-ID')}
                        {isExpired(item.expired_at) && ' ✕'}
                        {isExpiredSoon(item.expired_at) && ' ⚠'}
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-lg font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg font-medium"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!loading && (
          <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400">
            {obat.length} produk ditemukan
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
