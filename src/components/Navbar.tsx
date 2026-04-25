import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sunset, LogOut, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/lib/AuthContext';
import { auth } from '@/src/lib/firebase';
import { signOut } from 'firebase/auth';
import Logo from './Logo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6",
      isScrolled ? "bg-white/70 backdrop-blur-md py-3 border-b border-slate-grey/10 shadow-artistic" : "bg-transparent py-4"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <Logo className="w-12 h-12 transition-transform group-hover:scale-110" />
          <span className="font-serif text-2xl font-bold text-slate-grey tracking-tight italic">Sunset Hills</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-slate-grey font-sans text-[11px] uppercase tracking-[0.2em] font-semibold">
          <a href="/#about" className="hover:text-primary-burnt transition-colors opacity-70 hover:opacity-100">About</a>
          <a href="/#rooms" className="hover:text-primary-burnt transition-colors opacity-70 hover:opacity-100">Rooms</a>
          <a href="/#gallery" className="hover:text-primary-burnt transition-colors opacity-70 hover:opacity-100">Gallery</a>
          
          {isAdmin && (
            <Link to="/admin" className="hover:text-primary-burnt transition-colors flex items-center gap-1 opacity-70 hover:opacity-100">
              Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-6">
              <span className="text-[10px] text-slate-grey/40 flex items-center gap-2 font-bold tracking-widest">
                <UserIcon size={12} />
                {user.displayName || user.email?.split('@')[0]}
              </span>
              <button 
                onClick={handleLogout}
                className="hover:text-primary-burnt transition-colors flex items-center gap-1 text-slate-grey/60"
              >
                <LogOut size={16} />
              </button>
              <Link to="/bookings" className="border border-primary-burnt text-primary-burnt px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-primary-burnt hover:text-white transition-all">Book Now</Link>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/auth" className="hover:text-primary-burnt transition-colors opacity-70">Login</Link>
              <Link to="/bookings" className="bg-primary-burnt text-white px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary-burnt/10">Book Now</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-slate-grey">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-slate-grey text-white p-6 flex flex-col gap-6 text-center md:hidden"
          >
            <a href="/#about" onClick={() => setIsMenuOpen(false)}>About Our Estate</a>
            <a href="/#rooms" onClick={() => setIsMenuOpen(false)}>Bespoke Suites</a>
            <a href="/#gallery" onClick={() => setIsMenuOpen(false)}>Visual Gallery</a>
            
            {isAdmin && <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Estate Admin</Link>}
            
            {user ? (
              <>
                <div className="text-[10px] text-white/40 uppercase tracking-widest">{user.email}</div>
                <button onClick={handleLogout} className="text-red-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Login / Register</Link>
            )}
            
            <Link to="/bookings" className="bg-primary-burnt px-6 py-4 rounded-full mt-2" onClick={() => setIsMenuOpen(false)}>Book Your Sanctuary</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
