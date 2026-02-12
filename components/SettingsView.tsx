
import React from 'react';

interface SettingsViewProps {
  vibrate: boolean; setVibrate: (val: boolean) => void;
  sound: boolean; setSound: (val: boolean) => void;
  autoOpen: boolean; setAutoOpen: (val: boolean) => void;
  theme: string; setTheme: (val: string) => void;
  onReset: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  vibrate, setVibrate, 
  sound, setSound, 
  autoOpen, setAutoOpen, 
  theme, setTheme,
  onReset,
  onOpenPrivacy,
  onOpenTerms
}) => {
  const themeColors = ['#0df259', '#1392ec', '#f43f5e', '#f59e0b', '#8b5cf6', '#ffffff'];

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Somiddho Smart Scanner',
          text: 'Check out this professional, private, and secure QR code scanner and generator!',
          url: window.location.origin,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(window.location.origin);
        alert('App link copied to clipboard!');
      } catch (err) {
        alert('Sharing is not supported on this browser.');
      }
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-background-dark p-6 pb-32 hide-scrollbar">
      <header className="py-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-primary text-sm font-medium mt-1 uppercase tracking-widest">Customize your experience</p>
      </header>

      <div className="space-y-8">
        {/* Scanning Section */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4 px-1">Scanning Feedback</h2>
          <div className="glass-panel rounded-3xl divide-y divide-white/5">
            <ToggleItem 
              icon="vibration" 
              label="Vibrate on Scan" 
              desc="Physical haptic feedback" 
              active={vibrate} 
              onToggle={() => setVibrate(!vibrate)} 
            />
            <ToggleItem 
              icon="volume_up" 
              label="Sound Feedback" 
              desc="Play beep on success" 
              active={sound} 
              onToggle={() => setSound(!sound)} 
            />
            <ToggleItem 
              icon="open_in_browser" 
              label="Auto-Open URLs" 
              desc="Skip result preview" 
              active={autoOpen} 
              onToggle={() => setAutoOpen(!autoOpen)} 
            />
          </div>
        </section>

        {/* Appearance Section */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4 px-1">Appearance</h2>
          <div className="glass-panel rounded-3xl p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-icons-round">palette</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Theme Accent</p>
                <p className="text-xs text-white/40">Select app accent color</p>
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              {themeColors.map(c => (
                <button 
                  key={c}
                  onClick={() => setTheme(c)}
                  className={`w-9 h-9 rounded-full border-2 transition-all active:scale-90 ${theme === c ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Social & Sharing Section */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4 px-1">Spread the word</h2>
          <div className="glass-panel rounded-3xl overflow-hidden">
            <button 
              onClick={handleShareApp}
              className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-icons-round">share</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Share App</p>
                  <p className="text-xs text-white/40">Invite friends to use Somiddho</p>
                </div>
              </div>
              <span className="material-icons-round text-white/10">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Legal Section */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4 px-1">Legal & Support</h2>
          <div className="glass-panel rounded-3xl divide-y divide-white/5">
            <button onClick={onOpenPrivacy} className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors text-left">
              <div className="flex items-center gap-4">
                <span className="material-icons-round text-white/30">verified_user</span>
                <span className="text-sm font-semibold text-white">Privacy Policy</span>
              </div>
              <span className="material-icons-round text-white/10">chevron_right</span>
            </button>
            <button onClick={onOpenTerms} className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors text-left">
              <div className="flex items-center gap-4">
                <span className="material-icons-round text-white/30">description</span>
                <span className="text-sm font-semibold text-white">Terms & Conditions</span>
              </div>
              <span className="material-icons-round text-white/10">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Data Section */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4 px-1">App Data</h2>
          <button 
            onClick={onReset}
            className="w-full glass-panel rounded-3xl p-5 flex items-center justify-between group hover:bg-red-500/10 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                <span className="material-icons-round">restart_alt</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-red-500">Reset App Data</p>
                <p className="text-xs text-white/30">Clear all scans and settings</p>
              </div>
            </div>
            <span className="material-icons-round text-white/10 group-hover:text-red-500/50">chevron_right</span>
          </button>
        </section>

        {/* System Info */}
        <section className="text-center pt-8">
          <p className="text-xs font-bold text-white/10 uppercase tracking-widest">Somiddho Pro v3.5</p>
          <p className="text-[9px] text-white/5 mt-1">Built with Privacy in Mind</p>
        </section>
      </div>
    </div>
  );
};

interface ToggleItemProps {
  icon: string;
  label: string;
  desc: string;
  active: boolean;
  onToggle: () => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({ icon, label, desc, active, onToggle }) => (
  <div className="flex items-center justify-between p-5">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${active ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/30'}`}>
        <span className="material-icons-round">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-white/40">{desc}</p>
      </div>
    </div>
    <button 
      onClick={onToggle}
      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-all ${active ? 'bg-primary' : 'bg-white/10'}`}
    >
      <span className={`inline-block w-4 h-4 transform bg-white rounded-full shadow-md transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

export default SettingsView;
