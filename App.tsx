
import React, { useState, useEffect } from 'react';
import { View, ScanResult } from './types';
import ScannerView from './components/ScannerView';
import GeneratorView from './components/GeneratorView';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import ResultDetailsView from './components/ResultDetailsView';
import LegalView, { PrivacyContent, TermsContent } from './components/LegalView';
import Layout from './components/Layout';
import FavoritesView from './components/FavoritesView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.SCANNER);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ScanResult | null>(null);
  
  const [vibrateOnScan, setVibrateOnScan] = useState(true);
  const [soundOnScan, setSoundOnScan] = useState(true);
  const [autoOpenUrl, setAutoOpenUrl] = useState(false);
  const [themeColor, setThemeColor] = useState('#0df259');

  useEffect(() => {
    const savedHistory = localStorage.getItem('somiddho_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedPrefs = localStorage.getItem('somiddho_prefs');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setVibrateOnScan(prefs.vibrate ?? true);
      setSoundOnScan(prefs.sound ?? true);
      setAutoOpenUrl(prefs.autoOpen ?? false);
      setThemeColor(prefs.theme ?? '#0df259');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('somiddho_prefs', JSON.stringify({
      vibrate: vibrateOnScan,
      sound: soundOnScan,
      autoOpen: autoOpenUrl,
      theme: themeColor
    }));
    document.documentElement.style.setProperty('--primary-color', themeColor);
  }, [vibrateOnScan, soundOnScan, autoOpenUrl, themeColor]);

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

    setHistory(prev => [result, ...prev].slice(0, 100));
    
    if (autoOpenUrl && result.data.startsWith('http')) {
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
          />
        );
      case View.GENERATOR:
        return <GeneratorView />;
      case View.HISTORY:
        return (
          <HistoryView 
            history={history} 
            deleteItem={handleDeleteHistoryItem}
            onSelectItem={(res) => { setSelectedResult(res); setCurrentView(View.RESULT_DETAILS); }} 
            clearHistory={() => { if(confirm("Clear all history?")) setHistory([]); }} 
          />
        );
      case View.FAVORITES:
        return (
          <FavoritesView 
            favorites={history.filter(i => i.isFavorite)} 
            onSelectItem={(res) => { setSelectedResult(res); setCurrentView(View.RESULT_DETAILS); }} 
            toggleFavorite={toggleFavorite}
          />
        );
      case View.SETTINGS:
        return (
          <SettingsView 
            vibrate={vibrateOnScan} setVibrate={setVibrateOnScan}
            sound={soundOnScan} setSound={setSoundOnScan}
            autoOpen={autoOpenUrl} setAutoOpen={setAutoOpenUrl}
            theme={themeColor} setTheme={setThemeColor}
            onReset={() => { setHistory([]); localStorage.clear(); window.location.reload(); }}
            onOpenPrivacy={() => setCurrentView(View.PRIVACY)}
            onOpenTerms={() => setCurrentView(View.TERMS)}
          />
        );
      case View.RESULT_DETAILS:
        return selectedResult ? (
          <ResultDetailsView 
            result={selectedResult} 
            onBack={() => setCurrentView(View.SCANNER)} 
            onToggleFavorite={toggleFavorite}
          />
        ) : <ScannerView onResult={handleScanComplete} onViewRecent={(res) => { setSelectedResult(res); setCurrentView(View.RESULT_DETAILS); }} />;
      case View.PRIVACY:
        return <LegalView title="Privacy Policy" content={<PrivacyContent />} onBack={() => setCurrentView(View.SETTINGS)} />;
      case View.TERMS:
        return <LegalView title="Terms & Conditions" content={<TermsContent />} onBack={() => setCurrentView(View.SETTINGS)} />;
      default:
        return <ScannerView onResult={handleScanComplete} onViewRecent={(res) => { setSelectedResult(res); setCurrentView(View.RESULT_DETAILS); }} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;
