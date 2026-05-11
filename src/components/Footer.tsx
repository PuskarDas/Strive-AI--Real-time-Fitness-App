import { motion } from 'motion/react';
import { Battery, Cloud } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="px-10 py-6 border-t border-white/5 flex justify-between items-center bg-[#080808]" id="footer">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
          />
          <span className="text-[10px] uppercase tracking-widest text-white/40">Cloud Sync Active</span>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-white/40">Last Sync: 2m ago</div>
      </div>
      <div className="flex gap-4">
        <div className="px-3 py-1 bg-white/5 rounded text-[10px] font-mono text-white/40">FW v2.0.4</div>
        <div className="px-3 py-1 bg-white/5 rounded text-[10px] font-mono text-[#CFFF04] flex items-center gap-2">
          <Battery className="w-3 h-3" />
          BATT 94%
        </div>
      </div>
    </footer>
  );
}
