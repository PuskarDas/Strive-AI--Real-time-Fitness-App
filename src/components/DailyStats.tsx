import { motion } from 'motion/react';
import { useGoals } from '../contexts/GoalsContext';

export default function DailyStats() {
  const { goals } = useGoals();
  const currentStats = {
    steps: 12482,
    calories: 2840,
    distance: 9.4,
    activeMinutes: 74
  };

  const stepProgress = goals.steps > 0 ? Math.min(Math.round((currentStats.steps / goals.steps) * 100), 100) : 0;
  const chartData = [40, 55, 45, 70, 30, 95, 80, 50, 65, 40, 20, 35];

  const safeVal = (val: number, goal: number) => {
    const v = isNaN(val) ? 0 : val;
    const g = isNaN(goal) || goal <= 0 ? 1 : goal;
    return { v, g };
  };

  const cal = safeVal(currentStats.calories, goals.calories);
  const dist = safeVal(currentStats.distance, goals.distance);
  const active = safeVal(currentStats.activeMinutes, goals.activeMinutes);

  return (
    <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 flex flex-col justify-between flex-1" id="daily-stats">
      <div className="flex justify-between items-start">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-6xl font-light tracking-tight flex items-baseline gap-2">
            {currentStats.steps.toLocaleString()} <span className="text-2xl text-white/30 uppercase tracking-widest font-medium">Steps</span>
          </h1>
          <p className="text-white/40 mt-2 font-mono text-sm tracking-tighter italic">+14% VS YESTERDAY</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-end"
        >
          <motion.div 
            key={stepProgress}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-light text-[#CFFF04]"
          >
            {stepProgress}%
          </motion.div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Daily Goal</div>
        </motion.div>
      </div>

      {/* Large Activity Visualization */}
      <div className="h-48 flex items-end justify-between gap-1 mt-8 mb-4 px-2" id="activity-chart">
        {chartData.map((height, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ delay: 0.3 + i * 0.05, duration: 0.8, ease: "easeOut" }}
            className={`flex-1 rounded-t-lg ${
              height === 95 
                ? 'bg-[#CFFF04] shadow-[0_0_20px_rgba(207,255,4,0.3)]' 
                : height > 60 ? 'bg-white/10' : 'bg-white/5'
            }`}
          />
        ))}
      </div>

      <div className="flex justify-between border-t border-white/5 pt-6" id="summary-metrics">
        <div className="text-center group cursor-help relative">
          <div className="text-xs text-white/40 uppercase mb-1 tracking-widest">Calories</div>
          <div className="text-xl font-medium">{cal.v} <span className="text-xs text-white/30">kcal</span></div>
          <progress className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/5 appearance-none overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-orange-500" value={cal.v} max={cal.g} />
        </div>
        <div className="text-center group cursor-help relative">
          <div className="text-xs text-white/40 uppercase mb-1 tracking-widest">Distance</div>
          <div className="text-xl font-medium">{dist.v} <span className="text-xs text-white/30">km</span></div>
          <progress className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/5 appearance-none overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-blue-400" value={dist.v} max={dist.g} />
        </div>
        <div className="text-center group cursor-help relative">
          <div className="text-xs text-white/40 uppercase mb-1 tracking-widest">Active</div>
          <div className="text-xl font-medium">{active.v} <span className="text-xs text-white/30">min</span></div>
          <progress className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/5 appearance-none overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-[#CFFF04]" value={active.v} max={active.g} />
        </div>
      </div>
    </div>
  );
}
