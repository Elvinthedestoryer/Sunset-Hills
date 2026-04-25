import React from 'react';
import { motion } from 'motion/react';
import { Room } from '@/src/types';
import { IndianRupee, Star, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RoomCardProps {
  room: Room;
  index: number;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="room-card group bg-white border-b border-slate-grey/10 hover:bg-primary-amber/5 transition-all duration-300 h-full flex flex-col"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={room.image} 
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 mix-blend-multiply opacity-90"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 font-bold text-slate-grey flex items-center gap-1 shadow-artistic text-sm">
          <IndianRupee className="w-3 h-3" />
          {room.price.toLocaleString()}
          <span className="text-[10px] font-normal opacity-60">/night</span>
        </div>
        {room.id === 'apex' && (
          <div className="absolute top-4 left-4 bg-primary-burnt text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 rounded-[2px]">
            <Star className="w-3 h-3 fill-current" />
            Premium
          </div>
        )}
      </div>
      
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary-burnt">Sunset Hills Sanctuary</span>
        </div>
        <h3 className="font-serif text-3xl mb-4 text-slate-grey italic group-hover:text-primary-burnt transition-colors">
          {room.name}
        </h3>
        <p className="text-xs leading-relaxed text-slate-grey/60 mb-6 flex-1 font-light">
          {room.description}
        </p>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8 items-center border-t border-slate-grey/5 pt-6">
          {room.amenities.split(',').map(amenity => (
            <span key={amenity.trim()} className="text-[10px] uppercase tracking-widest font-bold text-slate-grey/40">
              {amenity.trim()}
            </span>
          ))}
        </div>

        <Link 
          to={`/bookings?room=${room.id}`}
          className="w-full border border-slate-grey text-slate-grey py-4 font-bold uppercase tracking-widest text-[11px] text-center hover:bg-primary-burnt hover:text-white hover:border-primary-burnt transition-all duration-500"
        >
          Select Your Haven
        </Link>
      </div>
    </motion.div>
  );
};

export default RoomCard;
