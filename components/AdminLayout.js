import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminLayout({ children, title = 'Admin' }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/stok', label: 'Manajemen Obat', icon: '💊' },
    { href: '/admin/kasir', label: 'Kasir / POS', icon: '🖥️' },
    { href: '/riwayat', label: 'Riwayat Transaksi', icon: '📋' },
  ];

  const isActive = (href) =>
    href === '/admin'
      ? router.pathname === '/admin'
      : router.pathname.startsWith(href);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="admin-sidebar no-print">
        <div className="p-5 border-b border-green-600">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">💊</span>
            <span className="font-bold text-lg">Toko Obat</span>
          </div>
          <p className="text-green-200 text-xs">Panel Admin</p>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? 'active' : ''}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-green-600">
          <Link href="/produk" className="text-xs text-green-200 hover:text-white block mb-2">
            ← Ke Toko
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-sm text-left text-red-300 hover:text-red-100 flex items-center gap-2"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between no-print">
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
