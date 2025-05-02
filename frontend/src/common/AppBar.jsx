import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { IconMoneybag, IconUser } from '@tabler/icons-react';

export default function AppBar() {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleNavigation = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo și titlu + linkuri */}
        <div className="flex items-center space-x-10">
          <div onClick={() => navigate("/")} className="flex items-center space-x-3 cursor-pointer">
            <IconMoneybag className="w-10 h-10" />
            <h1 className="text-xl font-bold">Aplicație bancară</h1>
          </div>

          {/* Linkuri navigație */}
          {isLoggedIn && (
            <nav className="flex gap-6 text-sm font-medium">
              {user?.role === 'admin' ? (
                <>
                  <button
                    onClick={() => handleNavigation('/admin')}
                    className="hover:underline"
                  >
                    Tranzacții
                  </button>
                  <button
                    onClick={() => handleNavigation('/admin/history')}
                    className="hover:underline"
                  >
                    Istoric
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation('/transactions')}
                    className="hover:underline"
                  >
                    Tranzacții
                  </button>
                  <button
                    onClick={() => handleNavigation('/bank-accounts')}
                    className="hover:underline"
                  >
                    Conturi
                  </button>
                </>
              )}
            </nav>
          )}
        </div>

        {/* Dropdown Profil */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center focus:outline-none"
          >
            <IconUser className="w-8 h-8" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Ieși din cont
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavigation('/login')}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Autentificare
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
