import { motion } from 'motion/react';
import { LogIn, Dumbbell } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_20%_30%,_rgba(207,255,4,0.05)_0%,_transparent_50%)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#111111] border border-white/5 rounded-[40px] p-12 text-center shadow-2xl"
      >
        <div className="w-20 h-20 bg-[#CFFF04] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(207,255,4,0.2)]">
          <Dumbbell className="w-10 h-10 text-black" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">Strive AI</h1>
        <p className="text-white/40 text-sm mb-12 leading-relaxed">
          Elevate your performance with intelligent training tracking and biometric analytics.
        </p>

        <button 
          onClick={signInWithGoogle}
          className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#CFFF04] transition-all transform active:scale-95 shadow-xl"
        >
          <LogIn className="w-5 h-5" />
          Continue with Google
        </button>
        
        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold">
            Cloud Sync Enabled • End-to-End Encryption
          </p>
        </div>
      </motion.div>
    </div>
  );
}
