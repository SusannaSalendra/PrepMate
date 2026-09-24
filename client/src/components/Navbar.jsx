import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BrainCircuit,
  BookOpen,
  Bookmark,
  PlayCircle,
  BarChart3,
  History,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;

  const mobileNavLinkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
        : 'text-slate-300 hover:text-white hover:bg-slate-800'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent tracking-tight">
                PrepMate
              </span>
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest -mt-1">
                Interview Prep
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/questions" className={navLinkStyle}>
              <BookOpen className="w-4 h-4" />
              <span>Questions</span>
            </NavLink>

            <NavLink to="/mock-interview" className={navLinkStyle}>
              <PlayCircle className="w-4 h-4 text-emerald-400" />
              <span>Mock Interview</span>
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/bookmarks" className={navLinkStyle}>
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>Bookmarks</span>
                </NavLink>

                <NavLink to="/sessions" className={navLinkStyle}>
                  <History className="w-4 h-4 text-cyan-400" />
                  <span>History</span>
                </NavLink>

                <NavLink to="/dashboard" className={navLinkStyle}>
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span>Dashboard</span>
                </NavLink>

                {isAdmin && (
                  <div className="relative group ml-1">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin</span>
                    </button>
                    <div className="absolute right-0 top-full pt-2 hidden group-hover:block w-48 z-50">
                      <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black/80 space-y-1">
                        <Link
                          to="/admin/questions"
                          className="block px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                        >
                          Manage Questions
                        </Link>
                        <Link
                          to="/admin/categories"
                          className="block px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                        >
                          Manage Categories
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </nav>

          {/* Right Action / Profile */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <span className="text-sm font-medium text-slate-200">
                    {user?.name}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2.5 border-b border-slate-800/80 mb-1">
                      <p className="text-xs font-medium text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-200 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Analytics Dashboard</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl mt-1 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-2">
          <NavLink
            to="/questions"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkStyle}
          >
            <BookOpen className="w-5 h-5" />
            <span>Question Bank</span>
          </NavLink>

          <NavLink
            to="/mock-interview"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkStyle}
          >
            <PlayCircle className="w-5 h-5 text-emerald-400" />
            <span>Mock Interview</span>
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/bookmarks"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkStyle}
              >
                <Bookmark className="w-5 h-5 text-amber-400" />
                <span>My Bookmarks</span>
              </NavLink>

              <NavLink
                to="/sessions"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkStyle}
              >
                <History className="w-5 h-5 text-cyan-400" />
                <span>Session History</span>
              </NavLink>

              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkStyle}
              >
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <span>Progress Dashboard</span>
              </NavLink>

              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkStyle}
              >
                <User className="w-5 h-5" />
                <span>Profile ({user?.name})</span>
              </NavLink>

              {isAdmin && (
                <div className="pt-2 border-t border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-3 py-1">
                    Admin Tools
                  </p>
                  <Link
                    to="/admin/questions"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-amber-400 hover:bg-slate-800 rounded-lg"
                  >
                    Manage Questions
                  </Link>
                  <Link
                    to="/admin/categories"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-amber-400 hover:bg-slate-800 rounded-lg"
                  >
                    Manage Categories
                  </Link>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-400 hover:bg-red-500/10 transition-all mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-medium"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/30"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
