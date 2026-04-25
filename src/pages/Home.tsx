import React from 'react';
import Hero from '@/src/components/Hero';
import Features from '@/src/components/Features';
import Gallery from '@/src/components/Gallery';
import RoomShowcase from '@/src/components/RoomShowcase';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hero />
      <RoomShowcase />
      <Features />
      <Gallery />
      
      {/* Call to action at the bottom */}
      <section className="bg-primary-burnt py-24 text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">Ready to witness the golden hour?</h2>
          <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto font-light">
            Book your stay today and experience the tranquility of Sunset Hills Wayanad. Only 6 exclusive suites available.
          </p>
          <a href="/bookings" className="inline-block bg-white text-primary-burnt px-12 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-primary-amber hover:text-slate-grey transition-all shadow-2xl">
            Secure Your Sanctuary
          </a>
        </div>
      </section>
    </motion.div>
  );
}
