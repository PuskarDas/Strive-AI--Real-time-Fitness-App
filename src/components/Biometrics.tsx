import { motion } from 'motion/react';
import { Heart, Droplets, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGoals } from '../contexts/GoalsContext';

export default function Biometrics() {
  const { goals } = useGoals();
  const [water, setWater] = useState(() => {
    const saved = localStorage.getItem('strive_hydration');
    return saved ? Number(saved) : 1250;
  });

  useEffect(() => {
    localStorage.setItem('strive_hydration', water.toString());
  }, [water]);

  const addWater = (amount: number) => {
    setWater(prev => Math.min(prev + amount, goals.water * 2)); // Limit at 2x goal for safety/UI
  };

  const hydrationProgress = goals.water > 0 ? Math.min((water / goals.water) * 100, 100) : 0;

  const currentWaterL = isNaN(water / 1000) ? 0 : water / 1000;
  const goalWaterL = isNaN(goals.water / 1000) ? 0 : goals.water / 1000;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="biometrics-grid">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#111111] border border-white/5 rounded-3xl p-6 flex items-center justify-between group cursor-pointer hover:border-white/10 transition-colors"
        id="heart-rate-card"
      >
        <div>
          <div className="text-xs text-white/40 uppercase tracking-widest mb-2">Heart Rate</div>
          <div className="text-3xl font-light">68 <span className="text-sm text-white/30">BPM</span></div>
        </div>
        <div className="w-24 h-12 flex items-center justify-end gap-1 px-2">
           <div className="w-1 h-2 bg-red-500/40 rounded-full animate-pulse"></div>
           <div className="w-1 h-5 bg-red-500/60 rounded-full"></div>
           <div className="w-1 h-3 bg-red-500/80 rounded-full"></div>
           <motion.div 
              animate={{ height: ["40%", "100%", "40%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1 bg-red-500 rounded-full"
           ></motion.div>
           <div className="w-1 h-4 bg-red-500/70 rounded-full"></div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-[#111111] border border-white/5 rounded-3xl p-6 flex flex-col justify-between group cursor-pointer hover:border-white/10 transition-colors"
        id="sleep-score-card"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs text-white/40 uppercase tracking-widest mb-1">Sleep Score</div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-light">92</span>
              <span className="text-sm text-white/30">/ 100</span>
            </div>
          </div>
          <div className="text-blue-400 font-serif italic text-lg opacity-80 group-hover:opacity-100 transition-opacity">Optimal</div>
        </div>

        <div className="space-y-4">
          <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-white/5">
            <motion.div initial={{ width: 0 }} animate={{ width: "25%" }} transition={{ delay: 1, duration: 1 }} className="h-full bg-blue-600" title="Deep Sleep" />
            <motion.div initial={{ width: 0 }} animate={{ width: "20%" }} transition={{ delay: 1.2, duration: 1 }} className="h-full bg-purple-500" title="REM" />
            <motion.div initial={{ width: 0 }} animate={{ width: "55%" }} transition={{ delay: 1.4, duration: 1 }} className="h-full bg-blue-400/40" title="Light Sleep" />
          </div>
          <div className="flex justify-between text-[8px] uppercase tracking-tighter text-white/40 font-mono">
            <div className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-blue-600" />Deep 2h 15m</div>
            <div className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-purple-500" />REM 1h 45m</div>
            <div className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-blue-400/40" />Light 4h 30m</div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-[#111111] border border-white/5 rounded-3xl p-6 flex flex-col justify-between group hover:border-white/10 transition-colors"
        id="hydration-card"
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-xs text-white/40 uppercase tracking-widest mb-1">Hydration</div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-light">{currentWaterL}</span>
              <span className="text-sm text-white/30">/ {goalWaterL}L</span>
            </div>
          </div>
          <button 
            onClick={() => addWater(250)}
            className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all active:scale-90"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-end justify-between gap-1 h-8">
            {[...Array(8)].map((_, i) => {
              const isActive = goals.water > 0 ? (water / goals.water) * 8 > i : false;
              return (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-sm transition-colors duration-500 ${
                    isActive ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-white/5'
                  }`}
                  style={{ height: `${20 + i * 10}%` }}
                />
              );
            })}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-widest text-white/20">Daily Intake</span>
            <div className="flex gap-1">
              <button 
                onClick={() => setWater(0)}
                className="text-[8px] uppercase tracking-tighter text-white/20 hover:text-red-500 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
