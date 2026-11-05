import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  BookOpen, 
  ShoppingCart, 
  User, 
  Search, 
  Award, 
  Clock, 
  LogOut, 
  LogIn, 
  Menu, 
  X,
  Compass
} from 'lucide-react';
import LoginModal from './LoginModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/catalogue');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        {/* Top Announcement & Points Bar */}
        <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <span className="hidden sm:inline">✨ Free express delivery on all orders over $35 | 48-Hour Free Order Cancellation</span>
            <div className="flex items-center space-x-4 ml-auto">
              {user ? (
                <div className="flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  <Award className="w-3.5 h-3.5" />
                  <span className="font-semibold">{user.giftPoints || 0} Gift Points Available</span>
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Sign in to earn & redeem Gift Points</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 flex-shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-sky-700 to-indigo-800 bg-clip-text text-transparent">
                  BookHaven
                </span>
                <span className="text-[10px] text-slate-500 -mt-1 font-medium tracking-wider uppercase">Cloud Bookstore</span>
              </div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-lg hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title, author, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 border border-slate-200 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="absolute right-1.5 top-1 px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded-full transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Navigation Actions */}
            <nav className="flex items-center space-x-2 sm:space-x-4">
              <Link
                to="/catalogue"
                className="hidden lg:flex items-center space-x-1.5 text-sm font-medium text-slate-700 hover:text-sky-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Catalogue</span>
              </Link>

              {user && (
                <Link
                  to="/orders"
                  className="hidden sm:flex items-center space-x-1.5 text-sm font-medium text-slate-700 hover:text-sky-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  <span>Order History</span>
                </Link>
              )}

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative flex items-center justify-center p-2 text-slate-700 hover:text-sky-600 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                    {totalItemsCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-sky-300 hover:bg-slate-50 transition-all text-sm font-medium text-slate-800"
                  >
                    <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                      {user.fullName ? user.fullName.charAt(0) : 'U'}
                    </div>
                    <span className="hidden md:inline max-w-[100px] truncate">{user.fullName || user.username}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                        <div className="mt-1 flex items-center text-xs text-amber-600 font-medium">
                          <Award className="w-3.5 h-3.5 mr-1" />
                          <span>{user.giftPoints || 0} Gift Points</span>
                        </div>
                      </div>

                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        My Orders & Cancellation
                      </Link>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-full shadow-sm transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </nav>
          </div>

          {/* Mobile Search & Nav */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-200 space-y-3">
              <form onSubmit={handleSearch} className="px-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search books, authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </form>
              <div className="flex flex-col space-y-1">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Home
                </Link>
                <Link
                  to="/catalogue"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  All Books Catalogue
                </Link>
                {user && (
                  <Link
                    to="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                  >
                    Order History & 48h Cancellation
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default Navbar;
