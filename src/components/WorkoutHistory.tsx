import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, Timer, Calendar, ChevronRight, Zap, Filter } from 'lucide-react';
import { useState } from 'react';
import { useWorkouts, WorkoutRecord } from '../contexts/WorkoutContext';

export default function WorkoutHistory() {
  const [filter, setFilter] = useState<'All' | 'Strength' | 'Running' | 'Mobility'>('All');
  const [timeframe, setTimeframe] = useState<'All' | 'Today' | 'Week'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { history, loading } = useWorkouts();

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };
  
  const filteredHistory = history.filter(w => {
    const categoryMatch = filter === 'All' || w.category === filter;
    // Simple mock logic for date timeframe since we are using string dates
    const dateMatch = timeframe === 'All' || (timeframe === 'Today' ? w.date === 'May 11' : true);
    return categoryMatch && dateMatch;
  });

  const isEmpty = filteredHistory.length === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-[#111111] border border-white/5 rounded-3xl p-8 flex flex-col gap-6"
      id="workout-history"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Recent Activity</h3>
          <p className="text-white/30 text-xs uppercase tracking-widest mt-1">Daily Training Log</p>
        </div>
        
        <div className="flex flex-col gap-2 self-stretch md:self-auto">
          <div className="flex bg-white/5 rounded-xl p-1 gap-1 overflow-x-auto no-scrollbar">
            {['All', 'Strength', 'Running', 'Mobility'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === f 
                    ? 'bg-[#CFFF04] text-black shadow-[0_0_10px_rgba(207,255,4,0.2)]' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="flex bg-white/5 rounded-xl p-1 gap-1 overflow-x-auto no-scrollbar md:justify-end">
            {['All', 'Today', 'Week'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t as any)}
                className={`px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-[0.15em] transition-all whitespace-nowrap ${
                  timeframe === t 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/20 hover:text-white/40'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 min-h-[200px]">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <div className="w-8 h-8 border-4 border-[#CFFF04]/20 border-t-[#CFFF04] rounded-full animate-spin" />
            </motion.div>
          ) : isEmpty ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-12 px-4 text-center h-full w-full"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Filter className="w-6 h-6 text-white/20" />
              </div>
              <h4 className="text-md font-medium text-white/60">No {filter} Workouts</h4>
              <p className="text-xs text-white/30 mt-1">Try adjusting your filters</p>
            </motion.div>
          ) : (
            filteredHistory.map((workout, index) => (
              <motion.div
                key={workout.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => toggleExpand(workout.id)}
                className={`flex flex-col p-4 bg-white/5 border border-white/0 hover:border-white/5 rounded-2xl group cursor-pointer transition-all overflow-hidden ${
                  expandedId === workout.id ? 'bg-white/10 border-white/10' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      workout.intensity === 'High' ? 'bg-[#CFFF04]/10 text-[#CFFF04]' : 'bg-white/5 text-white/40'
                    }`}>
                      {workout.type.includes('Run') ? <Zap className="w-5 h-5" /> : <Dumbbell className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium group-hover:text-[#CFFF04] transition-colors">{workout.type}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-[10px] text-white/30">
                          <Calendar className="w-3 h-3" />
                          {workout.date}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-white/30">
                          <Timer className="w-3 h-3" />
                          {workout.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-mono">{workout.calories}</div>
                      <div className="text-[8px] uppercase tracking-tighter text-white/30">KCAL</div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-white/20 group-hover:text-[#CFFF04] transition-all transform ${
                      expandedId === workout.id ? 'rotate-90 text-[#CFFF04]' : ''
                    }`} />
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === workout.id && workout.exercises && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="mt-6 pt-6 border-t border-white/5">
                        <div className="grid grid-cols-4 text-[8px] uppercase tracking-widest text-white/30 font-bold mb-3 px-2">
                          <div className="col-span-1">Exercise</div>
                          <div className="text-center">Sets</div>
                          <div className="text-center">Reps</div>
                          <div className="text-right">Weight</div>
                        </div>
                        <div className="space-y-2">
                          {workout.exercises.map((ex, i) => (
                            <div key={i} className="grid grid-cols-4 items-center bg-white/5 p-3 rounded-xl border border-white/0 hover:border-white/5 transition-colors">
                              <div className="text-[10px] font-medium text-white/80">{ex.name}</div>
                              <div className="text-center text-[10px] font-mono text-white/50">{ex.sets}</div>
                              <div className="text-center text-[10px] font-mono text-white/50">{ex.reps}</div>
                              <div className="text-right text-[10px] font-mono text-[#CFFF04]/80">{ex.weight || '-'}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
