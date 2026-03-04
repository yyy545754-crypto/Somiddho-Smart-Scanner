
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { View, ScanResult, SearchEngine, Language } from './types';
import { translations } from './i18n';
import ScannerView from './components/ScannerView';
import GeneratorView from './components/GeneratorView';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import ResultDetailsView from './components/ResultDetailsView';
import LegalView, { PrivacyContent, TermsContent } from './components/LegalView';
import Layout from './components/Layout';
import FavoritesView from './components/FavoritesView';
import SecurityLock from './components/SecurityLock';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.SCANNER);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ScanResult | null>(null);
  
  const [vibrateOnScan, setVibrateOnScan] = useState(true);
  const [soundOnScan, setSoundOnScan] = useState(true);
  const [autoOpenUrl, setAutoOpenUrl] = useState(false);
  const [scanConfirmation, setScanConfirmation] = useState(true);
  const [batchMode, setBatchMode] = useState(false);
  const [autoCopy, setAutoCopy] = useState(false);
  const [searchEngine, setSearchEngine] = useState<SearchEngine>(SearchEngine.GOOGLE);
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [themeColor, setThemeColor] = useState('#f43f5e');
  const [isLocked, setIsLocked] = useState(false);
  const [lockEnabled, setLockEnabled] = useState(false);
  const [savedPin, setSavedPin] = useState<string | null>(null);
  const [isSettingUpPin, setIsSettingUpPin] = useState(false);

  const t = translations[language];

  useEffect(() => {
    const savedHistory = localStorage.getItem('somiddho_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedPrefs = localStorage.getItem('somiddho_prefs');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setVibrateOnScan(prefs.vibrate ?? true);
      setSoundOnScan(prefs.sound ?? true);
      setAutoOpenUrl(prefs.autoOpen ?? false);
      setScanConfirmation(prefs.scanConfirmation ?? true);
      setBatchMode(prefs.batchMode ?? false);
      setAutoCopy(prefs.autoCopy ?? false);
      setSearchEngine(prefs.searchEngine ?? SearchEngine.GOOGLE);
      setLanguage(prefs.language ?? Language.EN);
      setThemeColor(prefs.theme ?? '#f43f5e');
      setLockEnabled(prefs.lockEnabled ?? false);
      setSavedPin(prefs.pin ?? null);

      if (prefs.lockEnabled && prefs.pin) {
        setIsLocked(true);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('somiddho_prefs', JSON.stringify({
      vibrate: vibrateOnScan,
      sound: soundOnScan,
      autoOpen: autoOpenUrl,
      scanConfirmation: scanConfirmation,
      batchMode: batchMode,
      autoCopy: autoCopy,
      searchEngine: searchEngine,
      language: language,
      theme: themeColor,
      lockEnabled: lockEnabled,
      pin: savedPin
    }));
    document.documentElement.style.setProperty('--primary-color', themeColor);
  }, [vibrateOnScan, soundOnScan, autoOpenUrl, batchMode, autoCopy, searchEngine, language, themeColor, lockEnabled, savedPin]);

  useEffect(() => {
    localStorage.setItem('somiddho_history', JSON.stringify(history));
  }, [history]);

  const playBeep = () => {
    if (!soundOnScan) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (e) {}
  };

  const handleScanComplete = (result: ScanResult) => {
    if (vibrateOnScan && navigator.vibrate) navigator.vibrate(100);
    if (soundOnScan) playBeep();
    if (autoCopy) {
      try {
        navigator.clipboard.writeText(result.data);
      } catch (e) {
        console.error('Failed to auto-copy:', e);
      }
    }

    setHistory(prev => [result, ...prev].slice(0, 100));
    
    if (batchMode) {
      // In batch mode, we stay on the scanner view
      return;
    }

    // If auto-open is on AND confirmation is off, open immediately
    if (autoOpenUrl && result.data.startsWith('http') && !scanConfirmation) {
      window.open(result.data, '_blank');
    } else {
      setSelectedResult(result);
      setCurrentView(View.RESULT_DETAILS);
    }
  };

  const toggleFavorite = (id: string) => {
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
    if (selectedResult && selectedResult.id === id) {
      setSelectedResult({ ...selectedResult, isFavorite: !selectedResult.isFavorite });
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const renderView = () => {
    switch (currentView) {
      case View.SCANNER:
        return (
          <ScannerView 
            onResult={handleScanComplete} 
            lastScan={history[0]} 
            onViewRecent={(res) => { setSelectedResult(res); setCurrentView(View.RESULT_DETAILS); }} 
            onViewHistory={() => setCurrentView(View.HISTORY)}
            onViewFavorites={() => setCurrentView(View.FAVORITES)}
            isAutoCopy={autoCopy}
            t={t}
          />
        );
      case View.GENERATOR:
        return <GeneratorView t={t} />;
      case View.HISTORY:
        return (
          <HistoryView 
            history={history} 
            deleteItem={handleDeleteHistoryItem}
            onSelectItem={(res) => { setSelectedResult(res); setCurrentView(View.RESULT_DETAILS); }} 
            clearHistory={() => { if(confirm("Clear all history?")) setHistory([]); }} 
            t={t}
          />
        );
      case View.FAVORITES:
        return (
          <FavoritesView 
            favorites={history.filter(i => i.isFavorite)} 
            onSelectItem={(res) => { setSelectedResult(res); setCurrentView(View.RESULT_DETAILS); }} 
            toggleFavorite={toggleFavorite}
            t={t}
          />
        );
      case View.SETTINGS:
        return (
          <SettingsView 
            vibrate={vibrateOnScan} setVibrate={setVibrateOnScan}
            sound={soundOnScan} setSound={setSoundOnScan}
            autoOpen={autoOpenUrl} setAutoOpen={setAutoOpenUrl}
            scanConfirmation={scanConfirmation} setScanConfirmation={setScanConfirmation}
            batchMode={batchMode} setBatchMode={setBatchMode}
            autoCopy={autoCopy} setAutoCopy={setAutoCopy}
            searchEngine={searchEngine} setSearchEngine={setSearchEngine}
            language={language} setLanguage={setLanguage}
            theme={themeColor} setTheme={setThemeColor}
            lockEnabled={lockEnabled} setLockEnabled={(val) => {
              if (val && !savedPin) {
                setIsSettingUpPin(true);
              } else {
                setLockEnabled(val);
              }
            }}
            onReset={() => { if(confirm(t.reset_data + "?")) { setHistory([]); localStorage.clear(); window.location.reload(); } }}
            onOpenPrivacy={() => setCurrentView(View.PRIVACY)}
            onOpenTerms={() => setCurrentView(View.TERMS)}
            onViewFavorites={() => setCurrentView(View.FAVORITES)}
            t={t}
          />
        );
      case View.SHOPPING:
        return (
          <div className="h-full overflow-y-auto bg-rose-950 p-6 pb-32 hide-scrollbar">
            <header className="py-8">
              <h1 className="text-4xl font-black tracking-tight text-white">{t.shopping}</h1>
              <p className="text-primary text-base font-black mt-1 uppercase tracking-widest">Exclusive Offers</p>
            </header>
            <div className="glass-panel rounded-[2.5rem] overflow-hidden p-10 text-center border border-white/10 shadow-2xl">
              <div className="w-24 h-24 rounded-[2rem] bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-8">
                <span className="material-icons-round text-5xl">shopping_bag</span>
              </div>
              <h2 className="text-2xl font-black text-white mb-4">{t.shopping}</h2>
              <p className="text-white/60 text-base font-bold mb-10 leading-relaxed">{t.shopping_desc}</p>
              <a 
                href="https://amzn.to/4l5mVYV"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-amber-500 text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_15px_40px_rgba(245,158,11,0.3)] text-base"
              >
                Shop Now
                <span className="material-icons-round text-2xl">open_in_new</span>
              </a>
            </div>
          </div>
        );
      case View.RESULT_DETAILS:
        return selectedResult ? (
          <ResultDetailsView 
            result={selectedResult} 
            searchEngine={searchEngine}
            scanConfirmation={scanConfirmation}
            onBack={() => setCurrentView(View.SCANNER)} 
            onToggleFavorite={toggleFavorite}
            t={t}
          />
        ) : <ScannerView onResult={handleScanComplete} onViewRecent={(res) => { setSelectedResult(res); setCurrentView(View.RESULT_DETAILS); }} t={t} />;
      case View.PRIVACY:
        return <LegalView title={t.privacy_policy} content={<PrivacyContent />} onBack={() => setCurrentView(View.SETTINGS)} />;
      case View.TERMS:
        return <LegalView title={t.terms_conditions} content={<TermsContent />} onBack={() => setCurrentView(View.SETTINGS)} />;
      default:
        return <ScannerView onResult={handleScanComplete} onViewRecent={(res) => { setSelectedResult(res); setCurrentView(View.RESULT_DETAILS); }} t={t} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView} t={t}>
      {renderView()}
      
      <AnimatePresence>
        {(isLocked || isSettingUpPin) && (
          <SecurityLock 
            isLocked={isLocked}
            onUnlock={() => setIsLocked(false)}
            savedPin={savedPin}
            onSetPin={(pin) => {
              setSavedPin(pin);
              setLockEnabled(true);
              setIsSettingUpPin(false);
            }}
            isSettingUp={isSettingUpPin}
            onCancelSetup={() => setIsSettingUpPin(false)}
            t={t}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default App;
