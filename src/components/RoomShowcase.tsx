import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { db } from '@/src/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Room } from '@/src/types';
import { IndianRupee, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RoomShowcase() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'rooms'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room));
      setRooms(docs);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="py-24 text-center">
      <Loader2 className="animate-spin mx-auto text-primary-burnt" />
    </div>
  );

  if (rooms.length === 0) return null;

  return (
    <section id="rooms" className="py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
          <div className="max-w-xl">
            <span className="text-primary-burnt font-bold tracking-[0.3em] uppercase text-[10px] mb-6 block">Sanctuary Selection</span>
            <h2 className="text-5xl md:text-7xl font-serif text-slate-grey leading-tight mb-8">
              Exclusive <br />
              <span className="italic">Elevated Suites</span>
            </h2>
            <p className="text-slate-grey/60 font-light text-lg leading-relaxed">
              Every room at Sunset Hills is a masterpiece of design and nature, positioned to offer the most breathtaking views of the Wayanad horizon.
            </p>
          </div>
          <Link 
            to="/bookings" 
            className="group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-slate-grey hover:text-primary-burnt transition-colors"
          >
            Check Availability
            <div className="w-12 h-[1px] bg-slate-grey/20 group-hover:w-20 group-hover:bg-primary-burnt transition-all" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/bookings?room=${encodeURIComponent(room.name)}`}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-8 shadow-2xl">
                  <img 
                    src={room.image} 
                    alt={room.name} 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-grey/80 via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-2 mb-2">
                       <Sparkles size={14} className="text-primary-amber" />
                       <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest">Premium Collection</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <h3 className="text-white font-serif text-3xl italic">{room.name}</h3>
                      <p className="text-white font-bold flex items-center gap-1">
                        <IndianRupee size={16} /> {room.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 px-2">
                  <p className="text-slate-grey/60 text-sm leading-relaxed line-clamp-3">
                    {room.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {room.amenities.split(',').slice(0, 3).map((amenity, i) => (
                      <span key={i} className="text-[9px] uppercase font-bold tracking-[0.2em] text-slate-grey/40 border-b border-slate-grey/10 pb-1">
                        {amenity.trim()}
                      </span>
                    ))}
                    {room.amenities.split(',').length > 3 && (
                      <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-primary-burnt">
                        +{room.amenities.split(',').length - 3} More
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
