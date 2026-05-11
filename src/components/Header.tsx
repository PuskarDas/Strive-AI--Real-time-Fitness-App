import { motion } from 'motion/react';
import { Activity, Battery, Cloud, User, Settings2, Watch, LogOut } from 'lucide-react';
import { useState } from 'react';
import GoalSettings from './GoalSettings';
import DeviceSync from './DeviceSync';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../lib/firebase';

export default function Header() {
  const { user } = useAuth();
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const [isGoalSettingsOpen, setIsGoalSettingsOpen] = useState(false);
  const [isDeviceSyncOpen, setIsDeviceSyncOpen] = useState(false);

  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-10 py-8 border-b border-white/10 bg-[#050505] gap-6" id="header">
      <div className="flex flex-col md:flex-row items-center gap-12 w-full md:w-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold tracking-tighter flex items-center gap-2"
          id="logo"
        >
          <div className="w-3 h-8 bg-[#CFFF04] rounded-full"></div>
          STRIVE.OS
        </motion.div>
        <nav className="flex flex-wrap justify-center gap-8 text-sm font-medium uppercase tracking-widest text-white/50" id="nav">
          <a href="#" className="text-[#CFFF04] transition-colors">Overview</a>
          <button 
            onClick={() => setIsGoalSettingsOpen(true)}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Settings2 className="w-4 h-4" />
            Targets
          </button>
          <button 
            onClick={() => setIsDeviceSyncOpen(true)}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Watch className="w-4 h-4" />
            Devices
          </button>
          <a href="#" className="hover:text-white transition-colors">Workouts</a>
        </nav>
      </div>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-6"
        id="user-region"
      >
        <div className="text-right hidden sm:block">
          <div className="text-xs uppercase tracking-widest text-white/40">{dayName}</div>
          <div className="text-sm font-medium">{dateStr}</div>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 p-1 pr-4 rounded-full border border-white/5 group">
          <div className="w-10 h-10 rounded-full border-2 border-[#CFFF04] p-0.5 relative overflow-hidden" id="avatar">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-gray-800 to-gray-600 flex items-center justify-center overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
              ) : (
                <User className="text-white/20 w-6 h-6" />
              )}
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/80">{user?.displayName?.split(' ')[0] || 'Athlete'}</div>
            <button 
              onClick={() => signOut()}
              className="text-[8px] uppercase tracking-[0.2em] text-[#CFFF04] hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              <LogOut className="w-2 h-2" />
              Log Out
            </button>
          </div>
          <button 
            onClick={() => signOut()}
            className="sm:hidden text-white/40 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <GoalSettings 
        isOpen={isGoalSettingsOpen} 
        onClose={() => setIsGoalSettingsOpen(false)} 
      />

      <DeviceSync 
        isOpen={isDeviceSyncOpen}
        onClose={() => setIsDeviceSyncOpen(false)}
      />
    </header>
  );
}
