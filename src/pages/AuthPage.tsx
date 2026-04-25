import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Sunset, ArrowRight, Chrome } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleAuthError = (err: any) => {
    console.error(err);
    setError(err.message || "An unexpected error occurred.");
  };

  const syncUserProfile = async (user: any, displayName: string) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName || 'Guest',
        isAdmin: user.email === 'thunderelvin@gmail.com', // Bootstrapped admin
        createdAt: new Date().toISOString()
      });
    } else if (user.email === 'thunderelvin@gmail.com' && !userSnap.data()?.isAdmin) {
      // Ensure existing record is updated to admin
      await updateDoc(userRef, { isAdmin: true });
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        const res = await signInWithEmailAndPassword(auth, email, password);
        await syncUserProfile(res.user, '');
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName: name });
        await syncUserProfile(res.user, name);
      }
      navigate('/');
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      await syncUserProfile(res.user, '');
      navigate('/');
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-creamy-vanilla flex items-center justify-center pt-24 pb-12 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 border border-slate-grey/5"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Sunset className="text-primary-burnt w-10 h-10" />
            <span className="font-serif text-3xl font-bold text-slate-grey">Sunset Hills</span>
          </Link>
          <h2 className="text-2xl font-serif text-slate-grey">
            {isLogin ? 'Welcome Back' : 'Create Your Profile'}
          </h2>
          <p className="text-sm text-slate-grey/60 mt-2">
            Access your exclusive hillside sanctuary.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-6">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-grey/40 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-grey/40" size={18} />
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-grey/5 rounded-xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary-amber outline-none transition-all" 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-grey/40 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-grey/40" size={18} />
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full bg-slate-grey/5 rounded-xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary-amber outline-none transition-all" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-grey/40 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-grey/40" size={18} />
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-grey/5 rounded-xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary-amber outline-none transition-all" 
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-grey text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary-burnt transition-all shadow-lg disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Join the Estate')}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-[1px] bg-slate-grey/10 flex-1" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-grey/30">Or</span>
          <div className="h-[1px] bg-slate-grey/10 flex-1" />
        </div>

        <button 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full mt-6 bg-white border border-slate-grey/10 text-slate-grey py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-slate-grey/5 transition-all"
        >
          <Chrome size={18} className="text-primary-burnt" />
          Continue with Google
        </button>

        <div className="mt-8 pt-8 border-t border-slate-grey/10 text-center">
          <p className="text-sm text-slate-grey/60">
            {isLogin ? "Don't have an account?" : "Already a member?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-primary-burnt font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
