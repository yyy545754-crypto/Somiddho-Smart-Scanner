
import React from 'react';
import { SearchEngine, Language } from '../types';

interface SettingsViewProps {
  vibrate: boolean; setVibrate: (val: boolean) => void;
  sound: boolean; setSound: (val: boolean) => void;
  autoOpen: boolean; setAutoOpen: (val: boolean) => void;
  batchMode: boolean; setBatchMode: (val: boolean) => void;
  autoCopy: boolean; setAutoCopy: (val: boolean) => void;
  searchEngine: SearchEngine; setSearchEngine: (val: SearchEngine) => void;
  language: Language; setLanguage: (val: Language) => void;
  theme: string; setTheme: (val: string) => void;
  lockEnabled: boolean; setLockEnabled: (val: boolean) => void;
  onReset: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onViewFavorites: () => void;
  t: any;
  scanConfirmation: boolean;
  setScanConfirmation: (val: boolean) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  vibrate, setVibrate, 
  sound, setSound, 
  autoOpen, setAutoOpen, 
  batchMode, setBatchMode,
  autoCopy, setAutoCopy,
  searchEngine, setSearchEngine,
  language, setLanguage,
  theme, setTheme,
  lockEnabled, setLockEnabled,
  onReset,
  onOpenPrivacy,
  onOpenTerms,
  onViewFavorites,
  t,
  scanConfirmation,
  setScanConfirmation
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
    <div className="h-full overflow-y-auto bg-rose-950 p-6 pb-32 hide-scrollbar">
      <header className="py-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t.settings}</h1>
        <p className="text-primary text-sm font-medium mt-1 uppercase tracking-widest">{t.appearance.toLowerCase()}</p>
      </header>

      <div className="space-y-8">
        {/* Scanning Section */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4 px-1">{t.scanner}</h2>
          <div className="glass-panel rounded-3xl divide-y divide-white/5">
            <ToggleItem 
              icon="vibration" 
              label={t.vibrate} 
              desc="Physical haptic feedback" 
              active={vibrate} 
              onToggle={() => setVibrate(!vibrate)} 
            />
            <ToggleItem 
              icon="volume_up" 
              label={t.sound} 
              desc="Play beep on success" 
              active={sound} 
              onToggle={() => setSound(!sound)} 
            />
            <ToggleItem 
              icon="open_in_browser" 
              label={t.auto_open} 
              desc="Skip result preview" 
              active={autoOpen} 
              onToggle={() => setAutoOpen(!autoOpen)} 
            />
            <ToggleItem 
              icon="verified_user" 
              label={t.scan_confirmation} 
              desc={t.scan_confirmation_desc} 
              active={scanConfirmation} 
              onToggle={() => setScanConfirmation(!scanConfirmation)} 
            />
            <ToggleItem 
              icon="dynamic_feed" 
              label={t.batch_mode} 
              desc="Scan multiple without stopping" 
              active={batchMode} 
              onToggle={() => setBatchMode(!batchMode)} 
            />
            <ToggleItem 
              icon="content_paste" 
              label={t.auto_copy} 
              desc="Copy text automatically after scan" 
              active={autoCopy} 
              onToggle={() => setAutoCopy(!autoCopy)} 
            />
          </div>
        </section>

        {/* Security Section */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4 px-1">{t.security}</h2>
          <div className="glass-panel rounded-3xl">
            <ToggleItem 
              icon="lock" 
              label={t.app_lock} 
              desc={t.app_lock_desc} 
              active={lockEnabled} 
              onToggle={() => setLockEnabled(!lockEnabled)} 
            />
          </div>
        </section>

        {/* Appearance Section */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4 px-1">{t.appearance}</h2>
          <div className="glass-panel rounded-3xl p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-icons-round">palette</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t.theme_accent}</p>
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

        {/* Language Section */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4 px-1">{t.language}</h2>
          <div className="glass-panel rounded-3xl p-2 grid grid-cols-2 gap-1">
            {[Language.EN, Language.BN, Language.JP, Language.KR, Language.RU].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${language === lang ? 'bg-primary text-black shadow-lg' : 'text-white/40 hover:text-white/60'}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </section>

        {/* Search Engine Section */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4 px-1">{t.search_engine}</h2>
          <div className="glass-panel rounded-3xl p-2 flex gap-1">
            {[SearchEngine.GOOGLE, SearchEngine.BING, SearchEngine.DUCKDUCKGO].map((engine) => (
              <button
                key={engine}
                onClick={() => setSearchEngine(engine)}
                className={`flex-1 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${searchEngine === engine ? 'bg-primary text-black shadow-lg' : 'text-white/40 hover:text-white/60'}`}
              >
                {engine}
              </button>
            ))}
          </div>
        </section>

        {/* Favorites Section */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4 px-1">{t.favorites}</h2>
          <div className="glass-panel rounded-3xl overflow-hidden">
            <button 
              onClick={onViewFavorites}
              className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-icons-round">star</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.favorites}</p>
                  <p className="text-xs text-white/40">View your starred items</p>
                </div>
              </div>
              <span className="material-icons-round text-white/10">chevron_right</span>
            </button>
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
                  <p className="text-sm font-semibold text-white">{t.share_app}</p>
                  <p className="text-xs text-white/40">{t.share_app_desc}</p>
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
                <span className="text-sm font-semibold text-white">{t.privacy_policy}</span>
              </div>
              <span className="material-icons-round text-white/10">chevron_right</span>
            </button>
            <button onClick={onOpenTerms} className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors text-left">
              <div className="flex items-center gap-4">
                <span className="material-icons-round text-white/30">description</span>
                <span className="text-sm font-semibold text-white">{t.terms_conditions}</span>
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
                <p className="text-sm font-semibold text-red-500">{t.reset_data}</p>
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
