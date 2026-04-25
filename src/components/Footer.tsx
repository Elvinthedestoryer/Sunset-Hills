import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-slate-grey text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <Logo className="w-14 h-14" />
              <span className="font-serif text-3xl font-bold tracking-tight">Sunset Hills</span>
            </div>
            <p className="text-white/60 max-w-md leading-relaxed mb-8">
              Experience the ultimate luxury in the heart of the Western Ghats. Only 30 minutes from Edakkal Caves and overlooking the mist-filled valleys of Wayanad.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-primary-amber hover:text-slate-grey transition-all"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-primary-amber hover:text-slate-grey transition-all"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-primary-amber hover:text-slate-grey transition-all"><Twitter size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl mb-8">Explore</h4>
            <ul className="space-y-4 text-white/60 font-sans text-sm">
              <li><a href="#about" className="hover:text-primary-amber transition-colors">About Our Estate</a></li>
              <li><a href="#rooms" className="hover:text-primary-amber transition-colors">Bespoke Suites</a></li>
              <li><a href="#amenities" className="hover:text-primary-amber transition-colors">Amenities</a></li>
              <li><a href="#gallery" className="hover:text-primary-amber transition-colors">Visual Gallery</a></li>
              <li><Link to="/bookings" className="hover:text-primary-amber transition-colors">Check Availability</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-xl mb-8">Contact Us</h4>
            <ul className="space-y-6 text-white/60 font-sans text-sm">
              <li className="flex gap-4">
                <MapPin className="text-primary-amber flex-shrink-0" size={20} />
                <span>Highest Point Estate, Sunset Peak Road, Wayanad, Kerala 673121</span>
              </li>
              <li className="flex gap-4">
                <Phone className="text-primary-amber flex-shrink-0" size={20} />
                <span>+91 9876 543 210</span>
              </li>
              <li className="flex gap-4">
                <Mail className="text-primary-amber flex-shrink-0" size={20} />
                <span>sanctuary@sunsethillswayanad.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-white/40 uppercase tracking-widest">
            © 2026 Sunset Hills Wayanad. Crafted for Luxury & Peace.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
