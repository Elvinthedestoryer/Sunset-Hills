import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IndianRupee, Mail, Calendar, Package, CheckCircle, Clock, Loader2, AlertTriangle, Image as ImageIcon, Plus, Trash2, X, Upload } from 'lucide-react';
import { Booking, GalleryImage, Room } from '@/src/types';
import { db, handleFirestoreError } from '@/src/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/src/lib/AuthContext';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'gallery' | 'rooms'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin, user } = useAuth();

  // Gallery Form State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newImage, setNewImage] = useState({ url: '', caption: '', category: 'nature' });
  const [isUploading, setIsUploading] = useState(false);

  // Room Form State
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: '',
    price: 35000,
    description: '',
    amenities: 'Private Pool, High-Speed WiFi, Jacuzzi',
    image: ''
  });
  const [isSavingRoom, setIsSavingRoom] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isReseting, setIsReseting] = useState(false);

  const DEFAULT_GALLERY = [
    { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1780&auto=format&fit=crop', caption: 'Verdant Heights', category: 'nature' },
    { url: 'https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?q=80&w=2070&auto=format&fit=crop', caption: 'Morning Mist', category: 'nature' },
    { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop', caption: 'Ocean Breeze', category: 'nature' },
    { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop', caption: 'Luxe Living', category: 'suites' },
    { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop', caption: 'Sanctuary Pool', category: 'amenities' },
    { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop', caption: 'Intimate Spaces', category: 'suites' },
  ];

  const DEFAULT_ROOMS = [
    {
      name: 'The Apex Suites',
      description: 'Our most elevated position. These suites feature private balconies with 270-degree panoramic views and outdoor luxury Jacuzzis.',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1582719478237-afdf3501ba7f?q=80&w=2070&auto=format&fit=crop',
      amenities: '270° View, Heated Jacuzzi, Private Balcony, Premium Mini-bar'
    },
    {
      name: 'The Horizon Rooms',
      description: 'Elegantly appointed rooms offering stunning mid-range valley views. Perfect for those seeking a balance of luxury and vantage.',
      price: 32000,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
      amenities: 'Valley View, Modern Interiors, King Size Bed, Rain Shower'
    },
    {
      name: 'The Serenity Rooms',
      description: 'Nestled within the lush greenery, these rooms offer ultimate privacy and tranquility, ideal for couples seeking a quiet woodland escape.',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2070&auto=format&fit=crop',
      amenities: 'Woodland View, Ultimate Privacy, Garden Access, Quiet Escape'
    }
  ];

  const seedDefaultRooms = async () => {
    if (!confirm("This will import the default room listings into your database. Continue?")) return;
    setIsReseting(true);
    try {
      for (const room of DEFAULT_ROOMS) {
        await addDoc(collection(db, 'rooms'), {
          ...room,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      handleError(err, 'create', 'rooms');
    } finally {
      setIsReseting(false);
    }
  };

  const seedDefaultGallery = async () => {
    if (!confirm("This will import the default resort portfolio into your database. Continue?")) return;
    setIsReseting(true);
    try {
      for (let i = 0; i < DEFAULT_GALLERY.length; i++) {
        await addDoc(collection(db, 'gallery'), {
          ...DEFAULT_GALLERY[i],
          order: i,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      handleError(err, 'create', 'gallery');
    } finally {
      setIsReseting(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    // Bookings Listener
    const bookingsQ = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubBookings = onSnapshot(bookingsQ, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(docs);
      if (activeTab === 'bookings') setLoading(false);
    }, (err) => {
      handleError(err, 'list', 'bookings text');
    });

    // Gallery Listener
    const galleryQ = query(collection(db, 'gallery'), orderBy('order', 'asc'));
    const unsubGallery = onSnapshot(galleryQ, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage));
      setGalleryImages(docs);
      if (activeTab === 'gallery') setLoading(false);
    }, (err) => {
      handleError(err, 'list', 'gallery');
    });

    // Rooms Listener
    const roomsQ = query(collection(db, 'rooms'), orderBy('createdAt', 'desc'));
    const unsubRooms = onSnapshot(roomsQ, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room));
      setRooms(docs);
      if (activeTab === 'rooms') setLoading(false);
    }, (err) => {
      handleError(err, 'list', 'rooms');
    });

    return () => {
      unsubBookings();
      unsubGallery();
      unsubRooms();
    };
  }, [isAdmin, activeTab]);

  const handleError = (err: any, op: any, path: string) => {
    console.error(err);
    try {
      handleFirestoreError(err, op, path);
    } catch (formattedErr: any) {
      setError(formattedErr.message);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: Booking['status']) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
    } catch (err: any) {
      console.error(err);
      alert("Failed to update status. Check permissions.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800000) { // Limit to ~800KB for Base64 safety in Firestore
      alert("Image is too large. Please use an image under 800KB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImage(prev => ({ ...prev, url: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const saveGalleryImage = async () => {
    if (!newImage.url) return;
    setIsUploading(true);
    try {
      await addDoc(collection(db, 'gallery'), {
        ...newImage,
        order: galleryImages.length,
        createdAt: new Date().toISOString()
      });
      setShowUploadModal(false);
      setNewImage({ url: '', caption: '', category: 'nature' });
    } catch (err: any) {
      handleError(err, 'create', 'gallery');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteGalleryImage = async (id: string) => {
    try {
      setError('');
      await deleteDoc(doc(db, 'gallery', id));
      setDeletingId(null);
    } catch (err: any) {
      handleError(err, 'delete', 'gallery');
    }
  };

  const handleRoomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 800000) {
      alert("Image is too large. Keep it under 800KB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewRoom(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const saveRoom = async () => {
    if (!newRoom.name || !newRoom.image || !newRoom.price) {
      alert("Please provide name, price and image.");
      return;
    }
    setIsSavingRoom(true);
    try {
      await addDoc(collection(db, 'rooms'), {
        ...newRoom,
        createdAt: new Date().toISOString()
      });
      setShowRoomModal(false);
      setNewRoom({ name: '', price: 35000, description: '', amenities: 'Private Pool, High-Speed WiFi, Jacuzzi', image: '' });
    } catch (err: any) {
      handleError(err, 'create', 'rooms');
    } finally {
      setIsSavingRoom(false);
    }
  };

  const deleteRoom = async (id: string) => {
    if (!confirm("Are you sure you want to remove this room listing?")) return;
    try {
      await deleteDoc(doc(db, 'rooms', id));
    } catch (err: any) {
      handleError(err, 'delete', 'rooms');
    }
  };

  if (!user || (!loading && !isAdmin)) {
    return (
      <div className="pt-48 pb-24 text-center">
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-serif mb-4">Access Restricted</h2>
        <p className="text-slate-grey/60">Only designated estate managers can access this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="font-serif text-5xl text-slate-grey mb-2 italic">Estate Manager</h1>
          <p className="text-slate-grey/40 text-sm tracking-widest uppercase font-bold">Resort Administration & Portfolio</p>
        </div>
        
        <div className="flex gap-1 bg-slate-grey/5 p-1 rounded-lg">
          <button 
            onClick={() => { setActiveTab('bookings'); setLoading(true); }}
            className={`px-6 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === 'bookings' ? 'bg-white text-slate-grey shadow-sm' : 'text-slate-grey/40 hover:text-slate-grey/60'
            }`}
          >
            Reservations
          </button>
          <button 
            onClick={() => { setActiveTab('gallery'); setLoading(true); }}
            className={`px-6 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === 'gallery' ? 'bg-white text-slate-grey shadow-sm' : 'text-slate-grey/40 hover:text-slate-grey/60'
            }`}
          >
            Gallery Portfolio
          </button>
          <button 
            onClick={() => { setActiveTab('rooms'); setLoading(true); }}
            className={`px-6 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === 'rooms' ? 'bg-white text-slate-grey shadow-sm' : 'text-slate-grey/40 hover:text-slate-grey/60'
            }`}
          >
            Room Listings
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-sm font-bold uppercase tracking-widest">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === 'bookings' ? (
          <motion.div
            key="bookings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white px-8 py-6 rounded-sm shadow-artistic border border-slate-grey/5">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-grey/40 mb-2">Projected Revenue</p>
                <p className="text-3xl font-bold text-primary-burnt flex items-center gap-1">
                  <IndianRupee size={24} /> {bookings.reduce((acc, curr) => acc + (curr.status !== 'cancelled' ? curr.totalPrice : 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white px-8 py-6 rounded-sm shadow-artistic border border-slate-grey/5">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-grey/40 mb-2">Active Stays</p>
                <p className="text-3xl font-bold text-slate-grey">{bookings.filter(b => b.status !== 'cancelled').length}</p>
              </div>
            </div>

            <div className="dashboard-overlay bg-white/90 backdrop-blur-md rounded-sm shadow-artistic overflow-hidden border border-slate-grey/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-grey/5 text-slate-grey/40 text-[10px] uppercase tracking-widest font-bold">
                      <th className="px-8 py-6">Reference</th>
                      <th className="px-8 py-6">Guest Info</th>
                      <th className="px-8 py-6">Stay Period</th>
                      <th className="px-8 py-6">Suite & Addons</th>
                      <th className="px-8 py-6">Total Amount</th>
                      <th className="px-8 py-6">Status & Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-grey/5">
                    {bookings.map((booking) => (
                      <motion.tr 
                        key={booking.id}
                        className="room-card hover:bg-primary-amber/5 transition-colors"
                      >
                        <td className="px-8 py-6 font-mono text-[11px] text-slate-grey/60">#{booking.id.slice(-6)}</td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-grey text-xs">{booking.userEmail.split('@')[0]}</span>
                            <span className="text-[10px] text-slate-grey/40 flex items-center gap-1 font-medium">
                              <Mail size={12} /> {booking.userEmail}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold flex items-center gap-2 uppercase tracking-tighter">
                              <Calendar size={14} className="text-primary-burnt" /> {booking.checkIn}
                            </span>
                            <span className="text-[10px] text-slate-grey/40 font-medium italic">to {booking.checkOut}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-slate-grey/60">
                              <Package size={14} className="text-primary-amber" /> 
                              {booking.roomName || rooms.find(r => r.id === booking.roomId)?.name || booking.roomId}
                            </span>
                            {booking.hasPoolAddon && (
                              <span className="text-[9px] text-primary-burnt font-bold uppercase border border-primary-burnt/20 px-1 rounded-[2px] w-fit">Pool Addon</span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="font-bold text-slate-grey flex items-center gap-1 text-sm tracking-tighter">
                            <IndianRupee size={14} /> {booking.totalPrice.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <select 
                              value={booking.status}
                              onChange={(e) => updateStatus(booking.id, e.target.value as Booking['status'])}
                              className={`px-3 py-1 rounded-sm text-[9px] font-bold uppercase tracking-wider outline-none border border-slate-grey/10 cursor-pointer ${
                                booking.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                                booking.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                                'bg-amber-50 text-amber-700'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {loading && (
                <div className="py-24 text-center">
                  <Loader2 className="animate-spin mx-auto text-primary-burnt mb-4" />
                  <p className="text-slate-grey/40 italic">Retrieving the ledger...</p>
                </div>
              )}

              {!loading && bookings.length === 0 && (
                <div className="py-24 text-center">
                  <Package size={48} className="mx-auto text-slate-grey/10 mb-4" />
                  <p className="text-slate-grey/40 italic">No bookings recorded yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : activeTab === 'gallery' ? (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="font-serif text-2xl text-slate-grey italic">Gallery Management</h3>
                {!loading && galleryImages.length === 0 && (
                  <button 
                    onClick={seedDefaultGallery}
                    disabled={isReseting}
                    className="text-[9px] uppercase tracking-widest font-bold text-primary-burnt border border-primary-burnt/20 px-3 py-1 rounded-sm hover:bg-primary-burnt/5 transition-colors disabled:opacity-50"
                  >
                    {isReseting ? 'Importing...' : 'Restore Default Portfolio'}
                  </button>
                )}
              </div>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="bg-primary-burnt text-white px-6 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all shadow-xl"
              >
                <Plus size={16} /> Add New Image
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryImages.map((img) => (
                <motion.div 
                  key={img.id}
                  layout
                  className="group relative bg-white rounded-sm shadow-artistic border border-slate-grey/5 overflow-hidden aspect-square"
                >
                  <img 
                    src={img.url} 
                    alt={img.caption} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                    <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-4 leading-relaxed">{img.caption || 'No Caption'}</p>
                    
                    {deletingId === img.id ? (
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-[9px] text-white/80 uppercase font-bold mb-1">Confirm delete?</p>
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); deleteGalleryImage(img.id); }}
                            className="bg-red-500 text-white px-3 py-1 rounded-sm text-[10px] font-bold uppercase hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setDeletingId(null); }}
                            className="bg-white/20 text-white px-3 py-1 rounded-sm text-[10px] font-bold uppercase hover:bg-white/30 transition-colors"
                          >
                            No
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setDeletingId(img.id); }}
                        className="bg-red-500/20 text-white p-3 rounded-full hover:bg-red-500 transition-all duration-300 transform group-hover:scale-110"
                        title="Remove Image"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {loading && (
              <div className="py-24 text-center">
                <Loader2 className="animate-spin mx-auto text-primary-burnt mb-4" />
              </div>
            )}

            {!loading && galleryImages.length === 0 && (
              <div className="py-24 text-center bg-white rounded-sm shadow-artistic border border-slate-grey/5">
                <ImageIcon size={48} className="mx-auto text-slate-grey/10 mb-4" />
                <p className="text-slate-grey/40 italic">Your gallery is empty. Start curated your collection.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="rooms"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="font-serif text-2xl text-slate-grey italic">Room Inventory</h3>
                {!loading && rooms.length === 0 && (
                  <button 
                    onClick={seedDefaultRooms}
                    disabled={isReseting}
                    className="text-[9px] uppercase tracking-widest font-bold text-primary-burnt border border-primary-burnt/20 px-3 py-1 rounded-sm hover:bg-primary-burnt/5 transition-colors disabled:opacity-50"
                  >
                    {isReseting ? 'Importing...' : 'Restore Default Listings'}
                  </button>
                )}
              </div>
              <button 
                onClick={() => setShowRoomModal(true)}
                className="bg-primary-burnt text-white px-6 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all shadow-xl"
              >
                <Plus size={16} /> Create Listing
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <div key={room.id} className="bg-white rounded-sm shadow-artistic border border-slate-grey/5 overflow-hidden flex flex-col">
                  <div className="aspect-[4/3] relative">
                    <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => deleteRoom(room.id)}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-serif text-xl text-slate-grey italic">{room.name}</h4>
                      <span className="font-bold text-primary-burnt text-sm">₹{room.price.toLocaleString()}</span>
                    </div>
                    <p className="text-slate-grey/60 text-xs mb-4 line-clamp-2">{room.description}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {room.amenities.split(',').map((amenity, i) => (
                        <span key={i} className="text-[9px] uppercase font-bold tracking-widest bg-slate-grey/5 px-2 py-1 rounded-sm text-slate-grey/60">
                          {amenity.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!loading && rooms.length === 0 && (
              <div className="py-24 text-center bg-white rounded-sm shadow-artistic border border-slate-grey/5">
                <Package size={48} className="mx-auto text-slate-grey/10 mb-4" />
                <p className="text-slate-grey/40 italic">No rooms in inventory. Create your first luxury listing.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Room Modal */}
      <AnimatePresence>
        {showRoomModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRoomModal(false)}
              className="absolute inset-0 bg-slate-grey/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-sm shadow-2xl p-8 md:p-12 overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setShowRoomModal(false)}
                className="absolute top-6 right-6 text-slate-grey/40 hover:text-slate-grey transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="font-serif text-3xl text-slate-grey mb-8 italic">New Room Listing</h2>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-grey/40 mb-2">Room Name</label>
                    <input 
                      type="text" 
                      value={newRoom.name}
                      onChange={e => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. The Apex Suite"
                      className="w-full bg-slate-grey/5 border-b border-slate-grey/10 py-3 px-4 outline-none focus:border-primary-burnt text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-grey/40 mb-2">Nightly Rate (INR)</label>
                    <input 
                      type="number" 
                      value={newRoom.price}
                      onChange={e => setNewRoom(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full bg-slate-grey/5 border-b border-slate-grey/10 py-3 px-4 outline-none focus:border-primary-burnt text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-grey/40 mb-2">Description</label>
                    <textarea 
                      value={newRoom.description}
                      onChange={e => setNewRoom(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-slate-grey/5 border-b border-slate-grey/10 py-3 px-4 outline-none focus:border-primary-burnt text-sm h-24 resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-grey/40 mb-2">Room Visual</label>
                    {!newRoom.image ? (
                      <div className="border-2 border-dashed border-slate-grey/10 rounded-sm p-12 text-center hover:border-primary-amber/40 transition-colors cursor-pointer relative">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleRoomImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload className="mx-auto text-slate-grey/20 mb-4" size={32} />
                        <p className="text-xs text-slate-grey/40 font-medium">Upload Suite Image</p>
                      </div>
                    ) : (
                      <div className="relative aspect-video rounded-sm overflow-hidden group">
                        <img src={newRoom.image} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setNewRoom(prev => ({ ...prev, image: '' }))}
                          className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-grey/40 mb-2">Amenities (Comma separated)</label>
                    <input 
                      type="text" 
                      value={newRoom.amenities}
                      onChange={e => setNewRoom(prev => ({ ...prev, amenities: e.target.value }))}
                      className="w-full bg-slate-grey/5 border-b border-slate-grey/10 py-3 px-4 outline-none focus:border-primary-burnt text-[10px] font-bold uppercase tracking-widest"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={saveRoom}
                disabled={isSavingRoom || !newRoom.name || !newRoom.image}
                className="w-full bg-slate-grey text-white py-5 rounded-sm font-bold uppercase text-[11px] tracking-[0.4em] hover:bg-primary-burnt transition-all disabled:opacity-50 shadow-xl flex items-center justify-center gap-4"
              >
                {isSavingRoom ? <Loader2 className="animate-spin" size={18} /> : 'Publish Listing'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="absolute inset-0 bg-slate-grey/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-sm shadow-2xl p-8 md:p-12 overflow-hidden"
            >
              <button 
                onClick={() => setShowUploadModal(false)}
                className="absolute top-6 right-6 text-slate-grey/40 hover:text-slate-grey transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="font-serif text-3xl text-slate-grey mb-8 italic">Curate Visual</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-grey/40 mb-3">Image Source</label>
                  {!newImage.url ? (
                    <div className="border-2 border-dashed border-slate-grey/10 rounded-sm p-12 text-center hover:border-primary-amber/40 transition-colors cursor-pointer relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Upload className="mx-auto text-slate-grey/20 mb-4" size={32} />
                      <p className="text-xs text-slate-grey/40 font-medium">Click to upload (<span className="font-bold">Max 800KB</span>)</p>
                    </div>
                  ) : (
                    <div className="relative aspect-video rounded-sm overflow-hidden group">
                      <img src={newImage.url} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setNewImage(prev => ({ ...prev, url: '' }))}
                        className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-grey/40 mb-3">Caption (Optional)</label>
                  <input 
                    type="text" 
                    value={newImage.caption}
                    onChange={e => setNewImage(prev => ({ ...prev, caption: e.target.value }))}
                    placeholder="e.g. Mist over the peaks"
                    className="w-full bg-slate-grey/5 border-b border-slate-grey/10 py-3 px-4 outline-none focus:border-primary-burnt text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-grey/40 mb-3">Category</label>
                    <select 
                      value={newImage.category}
                      onChange={e => setNewImage(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-slate-grey/5 border-b border-slate-grey/10 py-3 px-4 outline-none focus:border-primary-burnt text-xs font-bold uppercase tracking-wider appearance-none"
                    >
                      <option value="nature">Nature</option>
                      <option value="suites">Suites</option>
                      <option value="amenities">Amenities</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={saveGalleryImage}
                  disabled={isUploading || !newImage.url}
                  className="w-full bg-slate-grey text-white py-5 rounded-sm font-bold uppercase text-[11px] tracking-[0.4em] hover:bg-primary-burnt transition-all disabled:opacity-50 shadow-xl flex items-center justify-center gap-4"
                >
                  {isUploading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    'Add to Collection'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
