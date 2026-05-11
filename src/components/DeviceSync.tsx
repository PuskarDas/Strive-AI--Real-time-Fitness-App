import { motion, AnimatePresence } from 'motion/react';
import { X, Watch, Smartphone, Link2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, useEffect, ReactNode } from 'react';

interface DeviceSyncProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Device {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync?: string;
  icon: ReactNode;
  provider: 'fitbit' | 'apple' | 'garmin';
}

export default function DeviceSync({ isOpen, onClose }: DeviceSyncProps) {
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Fitbit Charge 6', status: 'disconnected', provider: 'fitbit', icon: <Smartphone className="w-5 h-5" /> },
    { id: '2', name: 'Apple Watch Series 9', status: 'disconnected', provider: 'apple', icon: <Watch className="w-5 h-5" /> },
    { id: '3', name: 'Garmin Forerunner', status: 'disconnected', provider: 'garmin', icon: <Watch className="w-5 h-5" /> },
  ]);

  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const provider = event.data.provider;
        setDevices(prev => prev.map(d => 
          d.provider === provider 
            ? { ...d, status: 'connected', lastSync: 'Just now' } 
            : d
        ));
        setLoading(null);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnect = async (device: Device) => {
    if (device.status === 'connected') return;
    
    if (device.provider === 'apple') {
      alert("Apple Health integration requires the Strive iOS companion app. Please install it from the App Store.");
      return;
    }

    try {
      setLoading(device.id);
      const res = await fetch(`/api/auth/${device.provider}/url`);
      const data = await res.json();
      
      if (data.url) {
        window.open(data.url, 'oauth_popup', 'width=600,height=800');
      } else {
        throw new Error(data.error || 'Failed to get auth URL');
      }
    } catch (err) {
      console.error(err);
      alert("Make sure you've configured your client IDs in the AI Studio secrets panel.");
      setLoading(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#111111] border border-white/10 rounded-3xl w-full max-w-lg p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Sync Devices</h2>
                <p className="text-white/40 text-sm">Connect your wearables to Strive.OS</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <div className="space-y-4">
              {devices.map((device) => (
                <div 
                  key={device.id}
                  className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      device.status === 'connected' ? 'bg-[#CFFF04] text-black' : 'bg-white/5 text-white/40'
                    }`}>
                      {device.icon}
                    </div>
                    <div>
                      <div className="font-medium">{device.name}</div>
                      <div className="text-[10px] uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                        {device.status === 'connected' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            Connected • Syncing enabled
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            Not Linked
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleConnect(device)}
                    disabled={loading === device.id}
                    className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                      device.status === 'connected' 
                        ? 'bg-white/5 text-white/40 cursor-default'
                        : 'bg-white/10 text-white hover:bg-[#CFFF04] hover:text-black active:scale-95'
                    }`}
                  >
                    {loading === device.id ? 'Connecting...' : device.status === 'connected' ? 'Connected' : 'Link Device'}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-[#CFFF04]/5 border border-[#CFFF04]/10 rounded-2xl">
              <div className="flex gap-3">
                <Link2 className="w-5 h-5 text-[#CFFF04] shrink-0" />
                <p className="text-xs text-[#CFFF04]/80 leading-relaxed font-mono">
                  All biometric data is processed locally within the Strive ecosystem. 
                  Third-party integrations require explicit permission via OAuth 2.0.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
