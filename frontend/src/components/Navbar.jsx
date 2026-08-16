import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Shield,
  ArrowRight,
  User,
  LogOut,
  FileText,
  FolderArchive,
  Calendar,
  CreditCard,
  Settings,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location]);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Essential Navigation Links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Track Application', path: '/track' },
    { name: 'Contact', path: '/contact' },
  ];

  // Secondary Links for Mobile Drawer
  const mobileSecondaryLinks = [
    { name: 'Notices', path: '/notices' },
    { name: 'FAQ', path: '/faq' },
    { name: 'About Us', path: '/about' },
  ];

  const handleLogout = () => {
    setUserDropdownOpen(false);
    logout();
    navigate('/');
  };

  const displayName = user?.fullName
    ? user.fullName
    : isAdmin
    ? 'princeydv'
    : 'User';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo / Branding */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            {!imgError ? (
              <img
                src="/logo.png"
                alt="Maa Vindhyawasini Online Centre Logo"
                className="h-10 w-auto object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight flex items-center gap-1.5 leading-none">
                Maa Vindhyawasini Online Centre
              </span>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                Digital Service Assistance Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right CTA & Login Dropdown Menu */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                {/* Logged in User Button Trigger */}
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                    userDropdownOpen
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm ring-2 ring-indigo-200/60'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                  }`}
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[11px] font-extrabold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{displayName}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>

                {/* Rich Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden z-50 divide-y divide-slate-100"
                    >
                      {/* User Header Profile Card */}
                      <div className="p-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center text-sm font-extrabold shadow-inner">
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-extrabold text-white truncate flex items-center gap-1.5">
                              <span>{displayName}</span>
                              {isAdmin && (
                                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                                  Admin
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-300 truncate font-mono mt-0.5">
                              {user?.email || (isAdmin ? 'admin@csccenter.in' : 'user@csccenter.in')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Navigation Items */}
                      <div className="p-2 space-y-1 text-xs font-semibold text-slate-700">
                        {isAdmin ? (
                          <>
                            <Link
                              to="/admin"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                              <div className="flex flex-col">
                                <span className="font-bold">Admin Dashboard</span>
                                <span className="text-[10px] text-slate-400 font-normal">Full management control</span>
                              </div>
                            </Link>

                            <Link
                              to="/admin/applications"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                            >
                              <FileText className="w-4 h-4 text-indigo-600" />
                              <div className="flex flex-col">
                                <span className="font-bold">Applied Applications & Data</span>
                                <span className="text-[10px] text-slate-400 font-normal">Review citizen submissions</span>
                              </div>
                            </Link>

                            <Link
                              to="/admin/documents"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                            >
                              <FolderArchive className="w-4 h-4 text-indigo-600" />
                              <div className="flex flex-col">
                                <span className="font-bold">Uploaded Documents</span>
                                <span className="text-[10px] text-slate-400 font-normal">Inspect attached proof files</span>
                              </div>
                            </Link>

                            <Link
                              to="/admin/appointments"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                            >
                              <Calendar className="w-4 h-4 text-indigo-600" />
                              <div className="flex flex-col">
                                <span className="font-bold">Assistance Appointments</span>
                                <span className="text-[10px] text-slate-400 font-normal">Manage scheduled bookings</span>
                              </div>
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/account/applications"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                            >
                              <FileText className="w-4 h-4 text-indigo-600" />
                              <div className="flex flex-col">
                                <span className="font-bold">My Applications & Data</span>
                                <span className="text-[10px] text-slate-400 font-normal">Track all your submitted forms</span>
                              </div>
                            </Link>

                            <Link
                              to="/account/documents"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                            >
                              <FolderArchive className="w-4 h-4 text-indigo-600" />
                              <div className="flex flex-col">
                                <span className="font-bold">My Attached Documents</span>
                                <span className="text-[10px] text-slate-400 font-normal">View & download uploaded files</span>
                              </div>
                            </Link>

                            <Link
                              to="/account/appointments"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                            >
                              <Calendar className="w-4 h-4 text-indigo-600" />
                              <div className="flex flex-col">
                                <span className="font-bold">My Appointments</span>
                                <span className="text-[10px] text-slate-400 font-normal">Check scheduled slot dates</span>
                              </div>
                            </Link>

                            <Link
                              to="/account/payments"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                            >
                              <CreditCard className="w-4 h-4 text-indigo-600" />
                              <div className="flex flex-col">
                                <span className="font-bold">Payments & Receipts</span>
                                <span className="text-[10px] text-slate-400 font-normal">Download fee receipts</span>
                              </div>
                            </Link>
                          </>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 border border-transparent hover:border-slate-200"
                >
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-colors hidden xl:inline-block"
                >
                  Register
                </Link>
              </div>
            )}

            <Link to="/services" className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4 shadow-sm">
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden border-t border-slate-200 bg-white shadow-xl overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50 font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="pt-2 border-t border-slate-100">
                {mobileSecondaryLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className="block px-4 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium"
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>

              {/* Mobile Profile & Portal Section */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                {isAuthenticated ? (
                  <>
                    <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-none">{displayName}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{user?.email}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                        {isAdmin ? 'Admin' : 'Citizen'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700 pt-1">
                      <Link
                        to={isAdmin ? '/admin/applications' : '/account/applications'}
                        className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span>Applications</span>
                      </Link>
                      <Link
                        to={isAdmin ? '/admin/documents' : '/account/documents'}
                        className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2"
                      >
                        <FolderArchive className="w-4 h-4 text-indigo-600" />
                        <span>Documents</span>
                      </Link>
                      <Link
                        to={isAdmin ? '/admin/appointments' : '/account/appointments'}
                        className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span>Appointments</span>
                      </Link>
                      <Link
                        to={isAdmin ? '/admin' : '/account'}
                        className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                        <span>Dashboard</span>
                      </Link>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-center py-2.5 px-4 rounded-xl text-red-600 font-bold bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="w-full text-center py-2.5 px-4 rounded-xl text-slate-800 font-bold bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4 text-indigo-600" />
                    <span>Login / Register</span>
                  </Link>
                )}

                <Link
                  to="/services"
                  className="btn-primary w-full text-center py-3 flex items-center justify-center gap-2 text-base"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
