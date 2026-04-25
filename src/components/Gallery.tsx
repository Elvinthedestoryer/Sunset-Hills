import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { db } from '@/src/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { GalleryImage } from '@/src/types';

const FALLBACK_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1780&auto=format&fit=crop', span: 'col-span-2 row-span-2' },
  { url: 'https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?q=80&w=2070&auto=format&fit=crop', span: 'col-span-1 row-span-1' },
  { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop', span: 'col-span-1 row-span-2' },
  { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop', span: 'col-span-1 row-span-1' },
  { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop', span: 'col-span-2 row-span-1' },
  { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop', span: 'col-span-1 row-span-1' },
];

export default function Gallery() {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (docs.length > 0) {
        // Map dynamic images to grid spans
        const mapped = docs.map((img: any, i: number) => {
          let span = 'col-span-1 row-span-1';
          if (i % 5 === 0) span = 'col-span-2 row-span-2';
          else if (i % 5 === 2) span = 'col-span-1 row-span-2';
          else if (i % 5 === 4) span = 'col-span-2 row-span-1';
          return { ...img, span };
        });
        setImages(mapped);
      } else {
        setImages(FALLBACK_IMAGES);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="gallery" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <span className="text-primary-burnt font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Visual Journey</span>
        <h2 className="text-5xl md:text-6xl font-serif text-slate-grey italic">Captured Moments</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[300px] gap-4">
        {images.map((img, i) => (
          <motion.div
            key={img.id || i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative overflow-hidden rounded-sm group shadow-artistic ${img.span}`}
          >
            <img 
              src={img.url} 
              alt={img.caption || "Resort Gallery"} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-slate-grey/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-white font-sans text-[10px] uppercase tracking-[0.4em] font-bold">
                {img.caption || "Nature's Canvas"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
