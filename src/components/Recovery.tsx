import { motion } from 'motion/react';

export default function Recovery() {
  const percentage = 72;
  const strokeDasharray = 364;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="bg-[#111111] border border-white/5 rounded-3xl p-8 shadow-inner"
      id="recovery-insight"
    >
      <div className="text-xs text-white/40 uppercase tracking-widest mb-4">Strain Recovery</div>
      <div className="relative flex items-center justify-center py-4">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
          <motion.circle 
            cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent" 
            className="text-[#CFFF04]" 
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: strokeDasharray }}
            animate={{ strokeDashoffset }}
            transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <span className="text-2xl font-light">72%</span>
           <span className="text-[8px] uppercase tracking-tighter text-white/30">Ready</span>
        </div>
      </div>
      <p className="text-center text-xs text-white/50 mt-6 leading-relaxed italic font-serif">
        "Body is ready for high-intensity output today. HRV is within baseline range."
      </p>
    </motion.div>
  );
}
