'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-accent-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">IndoVendor</h1>
              <span className="ml-2 text-sm text-gray-500">EO/WO Marketplace</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600">Features</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600">Contact</a>
            </nav>
            <div className="flex space-x-4 items-center">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600">
                    Welcome, {user?.profile?.firstName || user?.email}
                  </span>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-blue-600 hover:text-blue-700"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="px-4 py-2 text-blue-600 hover:text-blue-700">
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Platform Marketplace
          </h2>
          <h3 className="text-3xl font-bold text-blue-600 sm:text-5xl mt-2">
            Event & Wedding Organizer
          </h3>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Temukan vendor Event Organizer dan Wedding Organizer terbaik di Indonesia. 
            Wujudkan acara impian Anda dengan mudah dan terpercaya.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Cari Vendor
                </Link>
                <Link
                  href="/auth/register"
                  className="px-8 py-3 border border-blue-600 text-blue-600 text-lg rounded-lg hover:bg-blue-50 transition-colors text-center"
                >
                  Daftar Sebagai Vendor
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="text-xl font-semibold mb-2">Pencarian Mudah</h4>
            <p className="text-gray-600">Cari vendor berdasarkan kategori, lokasi, dan budget dengan filter yang lengkap.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h4 className="text-xl font-semibold mb-2">Chat Real-time</h4>
            <p className="text-gray-600">Komunikasi langsung dengan vendor untuk diskusi kebutuhan acara Anda.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h4 className="text-xl font-semibold mb-2">Pembayaran Aman</h4>
            <p className="text-gray-600">Sistem escrow yang melindungi pembayaran hingga acara selesai dengan memuaskan.</p>
          </div>
        </div>

        {/* Status */}
        <div className="mt-16 text-center">
          <div className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            🚧 Platform sedang dalam tahap pengembangan
          </div>
          <p className="mt-4 text-gray-600">
            Backend Auth APIs telah siap. Frontend dan fitur lainnya sedang dikembangkan.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 IndoVendor. Platform Marketplace EO/WO Indonesia.</p>
        </div>
      </footer>
    </div>
  );
}
