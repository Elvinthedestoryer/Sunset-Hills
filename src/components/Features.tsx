import React from 'react';
import { motion } from 'motion/react';
import { AMENITIES } from '@/src/constants';
import * as Icons from 'lucide-react';

export default function Features() {
  return (
    <div className="space-y-32 py-20">
      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary-burnt font-bold tracking-[0.2em] uppercase text-sm mb-4 block">The Highest Point</span>
          <h2 className="text-4xl md:text-5xl font-serif mb-8 text-slate-grey leading-tight">
            Elevated Above <br /> the Clouds
          </h2>
          <p className="text-lg text-slate-grey/70 leading-relaxed mb-6">
            Perched at the highest point of our private estate, Sunset Hills offers more than just a stay; it offers a vantage point. With only six bespoke rooms, we ensure privacy, silence, and an unobstructed view of the Western Ghats.
          </p>
          <p className="text-lg text-slate-grey/70 leading-relaxed">
            Our architecture blends seamlessly with the mist-covered peaks, providing a sanctuary where the golden hour feels eternal and the silence is only broken by the mountain breeze.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-square md:aspect-auto md:h-[600px] rounded-[40px] overflow-hidden shadow-2xl"
        >
          <img 
            src="/src/assets/images/resort_pool_sunset_1777101340052.png" 
            alt="Luxury infinity pool at sunset" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 border-[24px] border-white/10 rounded-[40px]" />
        </motion.div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" className="bg-slate-grey text-white py-24 rounded-[60px] mx-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary-amber font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Refined Living</span>
            <h2 className="text-4xl md:text-5xl font-serif">Bespoke Amenities</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-12">
            {AMENITIES.map((amenity, i) => {
              const IconComp = (Icons as any)[amenity.icon];
              return (
                <motion.div
                  key={amenity.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8 transition-transform hover:scale-110 hover:bg-white/10">
                    <IconComp className="w-8 h-8 text-primary-amber" />
                  </div>
                  <h3 className="font-serif text-2xl mb-4">{amenity.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{amenity.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
