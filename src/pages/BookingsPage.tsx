import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { IndianRupee, Calendar, Users, Waves, ChevronRight, Loader2, Package } from 'lucide-react';
import { Room } from '@/src/types';
import { useAuth } from '@/src/lib/AuthContext';
import { db, handleFirestoreError } from '@/src/lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function BookingsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'rooms'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room));
      setRooms(docs);
      
      // Select first room if none selected and rooms exist
      if (docs.length > 0 && !selectedRoomId) {
        const paramId = searchParams.get('room');
        const found = docs.find(r => r.id === paramId || r.name.toLowerCase().includes(paramId?.toLowerCase() || ''));
        setSelectedRoomId(found ? found.id : docs[0].id);
      }
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => unsub();
  }, [searchParams, selectedRoomId]);

  const selectedRoomDetails = useMemo(() => {
    return rooms.find(r => r.id === selectedRoomId);
  }, [rooms, selectedRoomId]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, [checkIn, checkOut]);

  const totalPrice = useMemo(() => {
    if (!selectedRoomDetails || nights <= 0) return 0;
    return selectedRoomDetails.price * nights;
  }, [selectedRoomDetails, nights]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!selectedRoomId) {
      alert("Please select a suite.");
      return;
    }

    if (nights <= 0) {
      alert("Please select a valid checkout date that is after the check-in date.");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const bookingData = {
        userId: user.uid,
        userEmail: user.email,
        roomId: selectedRoomId,
        roomName: selectedRoomDetails?.name || 'Unknown Sanctuary',
        checkIn,
        checkOut,
        nights,
        totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'bookings'), bookingData);
      alert("Booking request submitted successfully! Our concierge will contact you shortly.");
      navigate('/');
    } catch (err: any) {
      console.error(err);
      try {
        handleFirestoreError(err, 'create', 'bookings');
      } catch (formattedErr: any) {
        setError(formattedErr.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-48 pb-24 text-center">
        <Loader2 className="animate-spin mx-auto text-primary-burnt mb-4" />
        <p className="text-slate-grey/40 italic">Preparing your sanctuary options...</p>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="pt-48 pb-24 text-center px-6 max-w-2xl mx-auto">
        <Package size={48} className="mx-auto text-slate-grey/10 mb-6" />
        <h1 className="font-serif text-3xl text-slate-grey mb-4 italic">No Active Inventories</h1>
        <p className="text-slate-grey/60 mb-8 leading-relaxed">
          We are currently refreshing our suite listings. Please check back shortly or contact our concierge for immediate assistance.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary-burnt text-white px-8 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest shadow-xl"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Reservation Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="dashboard-overlay bg-white/95 backdrop-blur-md rounded-sm p-8 md:p-12 shadow-artistic border border-slate-grey/5"
          >
            <h1 className="font-serif text-5xl mb-8 text-slate-grey italic">Make a Reservation</h1>
            
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-sm font-bold uppercase tracking-widest">
                {error}
              </div>
            )}

            {!user && (
              <div className="mb-8 p-6 bg-primary-amber/5 border border-primary-amber/10 rounded-sm flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-widest font-bold text-slate-grey">Please sign in to complete your booking.</p>
                <button 
                  onClick={() => navigate('/auth')}
                  className="bg-primary-burnt text-white px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest"
                >
                  Sign In
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Room Selection */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-slate-grey/40 mb-6">Select Your Sanctuary</label>
                <div className="grid sm:grid-cols-2 gap-6">
                  {rooms.map(room => (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`p-6 rounded-sm border transition-all text-left flex items-center gap-4 ${
                        selectedRoomId === room.id 
                          ? 'border-primary-burnt bg-primary-burnt/5' 
                          : 'border-slate-grey/5 hover:border-primary-amber/30'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-sm overflow-hidden flex-shrink-0">
                        <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-serif text-xl text-slate-grey italic mb-1">{room.name}</h4>
                        <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">₹{room.price.toLocaleString()}/night</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                {/* Dates */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-slate-grey/40 mb-4">Check-in Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 text-primary-burnt opacity-40" size={16} />
                    <input 
                      type="date" 
                      required
                      value={checkIn}
                      onChange={e => setCheckIn(e.target.value)}
                      className="w-full bg-transparent border-b border-slate-grey/20 py-4 pl-8 pr-4 focus:border-primary-burnt outline-none text-sm transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-slate-grey/40 mb-4">Check-out Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 text-primary-burnt opacity-40" size={16} />
                    <input 
                      type="date" 
                      required
                      value={checkOut}
                      onChange={e => setCheckOut(e.target.value)}
                      className="w-full bg-transparent border-b border-slate-grey/20 py-4 pl-8 pr-4 focus:border-primary-burnt outline-none text-sm transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Guests */}
              <div className="grid md:grid-cols-2 gap-10 items-end">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-slate-grey/40 mb-4">Number of Guests</label>
                  <div className="relative">
                    <Users className="absolute left-0 top-1/2 -translate-y-1/2 text-primary-burnt opacity-40" size={16} />
                    <select 
                      value={guests}
                      onChange={e => setGuests(Number(e.target.value))}
                      className="w-full bg-transparent border-b border-slate-grey/20 py-4 pl-8 pr-4 focus:border-primary-burnt outline-none appearance-none text-sm font-medium"
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests (Max)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-burnt text-white py-6 rounded-sm font-bold uppercase text-[11px] tracking-[0.5em] hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-4 group disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Confirm Sanctuary Booking
                    <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-32 bg-slate-grey text-white rounded-[40px] p-8 overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-amber/10 rounded-full -translate-y-12 translate-x-12 blur-3xl" />
            
            <h3 className="font-serif text-2xl mb-8 relative z-10">Booking Summary</h3>
            
            <AnimatePresence mode="wait">
              {selectedRoomDetails ? (
                <motion.div 
                  key={selectedRoomDetails.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 relative z-10"
                >
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-sm text-white/60">Suites</span>
                    <span className="font-medium text-right ml-4">{selectedRoomDetails.name}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-sm text-white/60">Rate</span>
                    <span className="flex items-center gap-1"><IndianRupee size={14} />{selectedRoomDetails.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-sm text-white/60">Length of Stay</span>
                    <span className="font-medium">{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-xl font-serif">Total</span>
                    <span className="text-2xl font-bold text-primary-amber flex items-center gap-1">
                      <IndianRupee size={22} />
                      {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <div className="text-white/40 italic text-sm py-12 text-center">Select a suite to see summary</div>
              )}
            </AnimatePresence>

            <div className="mt-12 p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-primary-amber font-bold mb-2">Exclusivity Guaranteed</p>
              <p className="text-xs text-white/60 leading-relaxed italic">
                "Our sanctuary preserves silence and solitude. Each unit is nestled for ultimate privacy."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
