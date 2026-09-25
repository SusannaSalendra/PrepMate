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
  Bot,
  Mic,
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
    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
      isActive
        ? 'bg-[#20B2AA]/15 text-[#3FD1C7] border border-[#20B2AA]/35 shadow-sm'
        : 'text-charcoal-400 hover:text-charcoal-50 hover:bg-charcoal-850'
    }`;

  const mobileNavLinkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-[#20B2AA] text-[#0D1614] font-semibold shadow-md shadow-[#20B2AA]/20'
        : 'text-charcoal-400 hover:text-white hover:bg-charcoal-850'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#20B2AA]/15 bg-[#0D1614]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#20B2AA] to-[#0E6E68] flex items-center justify-center shadow-md shadow-[#20B2AA]/20 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-5 h-5 text-[#0D1614]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-[#F9FBFB] via-[#20B2AA] to-[#3FD1C7] bg-clip-text text-transparent font-display tracking-tight">
                PrepMate
              </span>
              <span className="text-[9px] font-semibold text-[#20B2AA] uppercase tracking-widest -mt-1 font-mono">
                Interview Prep
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/questions" className={navLinkStyle}>
              <BookOpen className="w-4 h-4 text-[#20B2AA]" />
              <span>Questions</span>
            </NavLink>

            <NavLink to="/mock-interview" className={navLinkStyle}>
              <PlayCircle className="w-4 h-4 text-[#20B2AA]" />
              <span>Mock Interview</span>
            </NavLink>

            <NavLink
              to="/ai-mentor"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#20B2AA]/20 text-[#3FD1C7] border border-[#20B2AA]/40 shadow-sm'
                    : 'text-[#3FD1C7] hover:text-white hover:bg-charcoal-850 border border-[#20B2AA]/25'
                }`
              }
            >
              <Bot className="w-4 h-4 text-[#20B2AA]" />
              <span>AI Voice Mentor</span>
              <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-[#20B2AA]/25 text-[#3FD1C7] border border-[#20B2AA]/30">
                VOICE
              </span>
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/bookmarks" className={navLinkStyle}>
                  <Bookmark className="w-4 h-4 text-[#20B2AA]" />
                  <span>Bookmarks</span>
                </NavLink>

                <NavLink to="/sessions" className={navLinkStyle}>
                  <History className="w-4 h-4 text-[#20B2AA]" />
                  <span>History</span>
                </NavLink>

                <NavLink to="/dashboard" className={navLinkStyle}>
                  <BarChart3 className="w-4 h-4 text-[#20B2AA]" />
                  <span>Dashboard</span>
                </NavLink>

                {isAdmin && (
                  <div className="relative group ml-1">
                    <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#20B2AA]/10 text-[#3FD1C7] border border-[#20B2AA]/30 hover:bg-[#20B2AA]/20 transition-all">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin</span>
                    </button>
                    <div className="absolute right-0 top-full pt-2 hidden group-hover:block w-48 z-50">
                      <div className="p-1 rounded-xl bg-charcoal-850 border border-[#20B2AA]/20 shadow-2xl shadow-black/80 space-y-1">
                        <Link
                          to="/admin/questions"
                          className="block px-3 py-2 text-xs font-medium text-charcoal-400 hover:text-white hover:bg-charcoal-800 rounded-lg"
                        >
                          Manage Questions
                        </Link>
                        <Link
                          to="/admin/categories"
                          className="block px-3 py-2 text-xs font-medium text-charcoal-400 hover:text-white hover:bg-charcoal-800 rounded-lg"
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
                  className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full bg-charcoal-850 border border-[#20B2AA]/20 hover:border-[#20B2AA]/40 transition-all"
                >
                  <span className="text-xs font-medium text-charcoal-100">
                    {user?.name}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#20B2AA] to-[#0E6E68] flex items-center justify-center text-[#0D1614] font-bold text-xs shadow-inner">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 p-1.5 rounded-2xl bg-charcoal-850 border border-[#20B2AA]/20 shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2.5 border-b border-[#20B2AA]/15 mb-1">
                      <p className="text-[11px] font-medium text-charcoal-400">Signed in as</p>
                      <p className="text-xs font-semibold text-charcoal-50 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-[#20B2AA]/15 text-[#3FD1C7] border border-[#20B2AA]/30">
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-charcoal-200 hover:text-white hover:bg-charcoal-800 rounded-xl"
                    >
                      <User className="w-3.5 h-3.5 text-[#20B2AA]" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-charcoal-200 hover:text-white hover:bg-charcoal-800 rounded-xl"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-[#20B2AA]" />
                      <span>Analytics Dashboard</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl mt-1 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-medium text-charcoal-400 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-[#0D1614] bg-gradient-to-r from-[#20B2AA] to-[#3FD1C7] hover:from-[#3FD1C7] hover:to-[#20B2AA] rounded-xl shadow-md shadow-[#20B2AA]/20 transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-charcoal-400 hover:text-white hover:bg-charcoal-850"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#20B2AA]/20 bg-[#0D1614] px-4 pt-2 pb-6 space-y-2">
          <NavLink
            to="/questions"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkStyle}
          >
            <BookOpen className="w-4 h-4" />
            <span>Question Bank</span>
          </NavLink>

          <NavLink
            to="/mock-interview"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkStyle}
          >
            <PlayCircle className="w-4 h-4" />
            <span>Mock Interview</span>
          </NavLink>

          <NavLink
            to="/ai-mentor"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[#20B2AA] text-[#0D1614]'
                  : 'text-[#3FD1C7] hover:bg-charcoal-850 border border-[#20B2AA]/25'
              }`
            }
          >
            <Bot className="w-4 h-4" />
            <span>AI Voice Mentor</span>
            <span className="ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#20B2AA]/20 text-[#3FD1C7] border border-[#20B2AA]/30">
              VOICE
            </span>
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/bookmarks"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkStyle}
              >
                <Bookmark className="w-4 h-4" />
                <span>My Bookmarks</span>
              </NavLink>

              <NavLink
                to="/sessions"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkStyle}
              >
                <History className="w-4 h-4" />
                <span>Session History</span>
              </NavLink>

              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkStyle}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Progress Dashboard</span>
              </NavLink>

              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkStyle}
              >
                <User className="w-4 h-4" />
                <span>Profile ({user?.name})</span>
              </NavLink>

              {isAdmin && (
                <div className="pt-2 border-t border-[#20B2AA]/15">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-400 px-3 py-1">
                    Admin Tools
                  </p>
                  <Link
                    to="/admin/questions"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-xs text-[#3FD1C7] hover:bg-charcoal-850 rounded-lg"
                  >
                    Manage Questions
                  </Link>
                  <Link
                    to="/admin/categories"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-xs text-[#3FD1C7] hover:bg-charcoal-850 rounded-lg"
                  >
                    Manage Categories
                  </Link>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all mt-3"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <div className="pt-4 border-t border-[#20B2AA]/15 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl bg-charcoal-850 border border-[#20B2AA]/20 text-charcoal-100 text-xs font-medium"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl bg-gradient-to-r from-[#20B2AA] to-[#3FD1C7] text-[#0D1614] text-xs font-bold shadow-md shadow-[#20B2AA]/20"
              >
                Create Free Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
