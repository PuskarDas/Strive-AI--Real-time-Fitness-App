import { motion, AnimatePresence } from 'motion/react';
import { useWorkouts } from '../contexts/WorkoutContext';
import { Check, Smartphone, Loader2, X } from 'lucide-react';
import { useState } from 'react';

export default function Training() {
  const { addWorkout } = useWorkouts();
  const [saved, setSaved] = useState(false);
  const [showSync, setShowSync] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'done'>('idle');

  const handleSave = () => {
    addWorkout({
      type: 'Lower Body Power',
      category: 'Strength',
      date: 'May 11',
      duration: '55m',
      intensity: 'High',
      calories: 380,
      exercises: [
        { name: 'Goblet Squats', sets: 4, reps: '12', weight: '24kg' },
        { name: 'Lunges', sets: 3, reps: '10ea', weight: '16kg' },
        { name: 'Calf Raises', sets: 4, reps: '20', weight: 'BW' }
      ]
    });
    setSaved(true);
    setTimeout(() => {
      setShowSync(true);
      setSaved(false);
    }, 1000);
  };

  const handleSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('done');
      setTimeout(() => {
        setShowSync(false);
        setSyncStatus('idle');
      }, 1500);
    }, 2000);
  };

  return (
    <div className="flex-1 flex" id="training-wrapper">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-[#CFFF04] text-black rounded-3xl p-8 flex-1 flex flex-col justify-between relative overflow-hidden" 
        id="training-card"
      >
        <AnimatePresence>
          {showSync && (
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute inset-0 bg-black/95 text-white z-10 p-8 flex flex-col items-center justify-center text-center"
            >
              <button 
                onClick={() => setShowSync(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-20 h-20 rounded-2xl bg-[#CFFF04]/10 flex items-center justify-center mb-6">
                {syncStatus === 'syncing' ? (
                  <Loader2 className="w-10 h-10 text-[#CFFF04] animate-spin" />
                ) : syncStatus === 'done' ? (
                  <Check className="w-10 h-10 text-green-500" />
                ) : (
                  <Smartphone className="w-10 h-10 text-[#CFFF04]" />
                )}
              </div>

              <h3 className="text-xl font-bold mb-2">
                {syncStatus === 'syncing' ? 'Syncing Data...' : syncStatus === 'done' ? 'Sync Complete' : 'Device Sync Available'}
              </h3>
              <p className="text-white/40 text-sm max-w-[200px] mb-8">
                {syncStatus === 'syncing' 
                  ? 'Transferring your session details to connected platforms.'
                  : syncStatus === 'done'
                  ? 'Your workout metrics are now live in Apple Health & Strava.'
                  : 'Sync this session to update your metrics on wearable devices.'}
              </p>

              {syncStatus === 'idle' && (
                <div className="flex flex-col gap-3 w-full">
                  <button 
                    onClick={handleSync}
                    className="w-full bg-[#CFFF04] text-black py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#CFFF04]/80 transition-all active:scale-95"
                  >
                    Sync to Devices
                  </button>
                  <button 
                    onClick={() => setShowSync(false)}
                    className="text-white/40 text-[10px] uppercase tracking-widest font-bold hover:text-white transition-colors"
                  >
                    Skip for Now
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Upcoming Workout</div>
          <h2 className="text-3xl font-bold tracking-tight leading-none mb-4">Lower Body Power</h2>
          <div className="space-y-3 mt-6">
            <div className="flex justify-between border-b border-black/10 pb-2">
              <span className="text-sm font-medium">Time</span>
              <span className="text-sm font-bold">17:30</span>
            </div>
            <div className="flex justify-between border-b border-black/10 pb-2">
              <span className="text-sm font-medium">Duration</span>
              <span className="text-sm font-bold">55 Min</span>
            </div>
            <div className="flex justify-between border-b border-black/10 pb-2">
              <span className="text-sm font-medium">Equipment</span>
              <span className="text-sm font-bold">Dumbbells</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 mt-8">
          <button className="w-full bg-black text-[#CFFF04] py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-black/80 transition-all transform active:scale-95">
            View Session Details
          </button>
          
          <button 
            onClick={handleSave}
            disabled={saved}
            className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
              saved 
                ? 'bg-green-600 text-white' 
                : 'border-2 border-black hover:bg-black hover:text-[#CFFF04]'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Workout Saved
              </>
            ) : (
              'Save Workout'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
