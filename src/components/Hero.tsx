import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video/Image Layer */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover mix-blend-multiply opacity-40"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-sunset-hills-with-a-faint-mist-42711-large.mp4" type="video/mp4" />
          {/* Fallback image */}
          <img 
             src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop" 
             className="w-full h-full object-cover" 
             alt="Sunset over Wayanad"
          />
        </video>
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl px-10 flex flex-col items-start text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <span className="uppercase tracking-[0.4em] text-xs font-bold mb-6 block text-white/80">Wayanad, Kerala</span>
          <h1 className="font-serif text-6xl md:text-8xl mb-8 leading-[0.9] tracking-tight">
            Where Serenity <br />
            <span className="italic">meets the sky</span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="font-sans text-lg md:text-xl text-white/90 max-w-xl mb-12 leading-relaxed font-light"
          >
            Experience an intimate, elevated retreat in the heart of Wayanad’s mist-covered hills. 
            Six exclusive suites, endless horizons, and the golden hour that never ends.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link 
              to="/bookings" 
              className="group bg-primary-burnt text-white px-10 py-4 font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all shadow-2xl text-xs"
            >
              Book Your Sunset Sanctuary
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a 
              href="#rooms" 
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 font-bold uppercase text-[10px] tracking-[0.2em] flex items-center"
            >
              Explore Rooms
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:block"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
