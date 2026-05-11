import { motion, AnimatePresence } from 'motion/react';
import { X, Target, Zap, Waves, Flame } from 'lucide-react';
import { useGoals } from '../contexts/GoalsContext';
import { useState } from 'react';

interface GoalSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoalSettings({ isOpen, onClose }: GoalSettingsProps) {
  const { goals, updateGoals } = useGoals();
  const [localGoals, setLocalGoals] = useState(goals);

  const handleSave = () => {
    updateGoals(localGoals);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#111111] border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl "
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Set Daily Goals</h2>
                <p className="text-white/40 text-sm">Define your performance targets</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <div className="space-y-6">
              <GoalInput 
                icon={<Target className="w-4 h-4 text-[#CFFF04]" />}
                label="Steps"
                value={localGoals.steps}
                onChange={(v) => setLocalGoals(prev => ({ ...prev, steps: v }))}
                min={1000}
                max={50000}
                step={500}
                unit="steps"
              />
              <GoalInput 
                icon={<Waves className="w-4 h-4 text-blue-400" />}
                label="Distance"
                value={localGoals.distance}
                onChange={(v) => setLocalGoals(prev => ({ ...prev, distance: v }))}
                min={1}
                max={50}
                step={0.5}
                unit="km"
              />
              <GoalInput 
                icon={<Flame className="w-4 h-4 text-orange-500" />}
                label="Calories"
                value={localGoals.calories}
                onChange={(v) => setLocalGoals(prev => ({ ...prev, calories: v }))}
                min={500}
                max={10000}
                step={100}
                unit="kcal"
              />
              <GoalInput 
                icon={<Zap className="w-4 h-4 text-[#CFFF04]" />}
                label="Active Time"
                value={localGoals.activeMinutes}
                onChange={(v) => setLocalGoals(prev => ({ ...prev, activeMinutes: v }))}
                min={10}
                max={300}
                step={5}
                unit="min"
              />
              <GoalInput 
                icon={<Waves className="w-4 h-4 text-blue-500" />}
                label="Hydration"
                value={localGoals.water}
                onChange={(v) => setLocalGoals(prev => ({ ...prev, water: v }))}
                min={500}
                max={5000}
                step={100}
                unit="ml"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-[#CFFF04] text-black font-bold py-4 rounded-2xl mt-10 hover:bg-[#b0d604] transition-all transform active:scale-[0.98] uppercase tracking-widest text-xs"
            >
              Update Strive.OS
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function GoalInput({ icon, label, value, onChange, min, max, step, unit }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs uppercase tracking-widest text-white/40">
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-white/80 font-mono">{value} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#CFFF04] hover:bg-white/10 transition-all"
      />
    </div>
  );
}
