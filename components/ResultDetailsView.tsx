
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScanResult, SearchEngine } from '../types';

interface ResultDetailsViewProps {
  result: ScanResult;
  searchEngine: SearchEngine;
  scanConfirmation: boolean;
  onBack: () => void;
  onToggleFavorite: (id: string) => void;
  t: any;
}

const ResultDetailsView: React.FC<ResultDetailsViewProps> = ({ result, searchEngine, scanConfirmation, onBack, onToggleFavorite, t }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [trustScore, setTrustScore] = useState(0);

  const isUrl = result.data.trim().toLowerCase().startsWith('http');
  const score = result.trustScore || 50;

  useEffect(() => {
    // Animate trust score on mount
    const timer = setTimeout(() => setTrustScore(score), 500);
    return () => clearTimeout(timer);
  }, [score]);

  const handleAction = () => {
    if (scanConfirmation) {
      setShowConfirm(true);
    } else {
      confirmAction();
    }
  };

  const confirmAction = () => {
    setShowConfirm(false);
    if (isUrl) {
      window.open(result.data.trim(), '_blank', 'noopener,noreferrer');
    } else {
      let searchUrl = '';
      const query = encodeURIComponent(result.data);
      
      switch (searchEngine) {
        case SearchEngine.BING:
          searchUrl = `https://www.bing.com/search?q=${query}`;
          break;
        case SearchEngine.DUCKDUCKGO:
          searchUrl = `https://duckduckgo.com/?q=${query}`;
          break;
        case SearchEngine.GOOGLE:
        default:
          searchUrl = `https://www.google.com/search?q=${query}`;
          break;
      }
      
      window.open(searchUrl, '_blank');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.data);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) { console.error(err); }
  };

  const handlePrint = () => {
    window.focus();
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Somiddho Scan Result',
          text: result.data,
          url: isUrl ? result.data : undefined
        });
      } catch (e) { console.error(e); }
    } else {
      handleCopy();
      alert("Result copied to clipboard!");
    }
  };

  // SVG Circle calculations
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (trustScore / 100) * circumference;

  return (
    <div className="h-full overflow-y-auto bg-rose-950 text-white flex flex-col font-display hide-scrollbar">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-rose-950/80 backdrop-blur-2xl border-b border-white/5 no-print">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-start text-white/40 active:scale-90 transition-transform">
          <span className="material-icons-round">arrow_back_ios</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight">{t.scan_result}</h1>
        <button onClick={() => onToggleFavorite(result.id)} className={`w-10 h-10 flex items-center justify-end transition-all active:scale-90 ${result.isFavorite ? 'text-primary' : 'text-white/40'}`}>
          <span className="material-icons-round">{result.isFavorite ? 'star' : 'star_outline'}</span>
        </button>
      </header>

      <main className="flex-1 px-6 pb-32 space-y-6 pt-6 max-w-lg mx-auto w-full">
        {/* Safety Check Hero Card */}
        <section className="relative overflow-hidden p-8 rounded-[2rem] bg-white/10 border border-white/20 shadow-[0_0_40px_rgba(13,242,89,0.15)]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2 block">Security Status</span>
              <h2 className="text-4xl font-black flex items-center gap-3">
                {score > 70 ? 'Secure' : score > 40 ? 'Caution' : 'Warning'}
                <span className={`material-icons-round text-4xl ${score > 70 ? 'text-primary' : score > 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                  {score > 70 ? 'verified' : score > 40 ? 'warning' : 'gpp_maybe'}
                </span>
              </h2>
            </div>
            <div className="flex flex-col items-end">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle className="text-white/10" cx="40" cy="40" fill="transparent" r={radius} stroke="currentColor" strokeWidth="5"></circle>
                  <motion.circle 
                    className={score > 70 ? 'text-primary' : score > 40 ? 'text-amber-500' : 'text-rose-500'}
                    cx="40" cy="40" fill="transparent" r={radius} stroke="currentColor" strokeWidth="5"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  ></motion.circle>
                </svg>
                <span className="text-base font-black">{trustScore}</span>
              </div>
              <span className="text-[10px] mt-2 text-white/60 uppercase font-black tracking-widest">Trust Score</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 pt-6 border-t border-white/10">
            {result.safetyPoints?.map((point, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className={`material-icons-round text-base ${score > 70 ? 'text-primary' : 'text-amber-500'}`}>
                  {score > 70 ? 'check_circle' : 'info'}
                </span>
                <span className="text-sm font-black text-white/80">{point}</span>
              </div>
            )) || (
              <div className="flex items-center gap-4">
                <span className="material-icons-round text-primary text-base">lock</span>
                <span className="text-sm font-black text-white/80">Standard Security Check</span>
              </div>
            )}
          </div>
        </section>

        {/* URL Information */}
        <section className="space-y-4">
          <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
            <p className="text-xs uppercase font-black text-white/50 mb-4 tracking-widest">
              {isUrl ? 'Destination URL' : 'Scanned Content'}
            </p>
            <div className="flex items-center justify-between gap-4">
              <span className="truncate text-base font-black text-white break-all">{result.data}</span>
              <div className="flex gap-3 shrink-0">
                <button onClick={handleCopy} className="p-3 bg-white/10 rounded-xl border border-white/20 active:scale-90 transition-transform">
                  <span className="material-icons-round text-base">{copySuccess ? 'check' : 'content_copy'}</span>
                </button>
                <button onClick={handleShare} className="p-3 bg-white/10 rounded-xl border border-white/20 active:scale-90 transition-transform">
                  <span className="material-icons-round text-base">share</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* AI Summary */}
        {result.summary && (
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/50 ml-1">AI Insight</h3>
            <div className="bg-primary/10 p-6 rounded-3xl border border-primary/20">
              <p className="text-base text-white font-bold leading-relaxed italic">
                "{result.summary}"
              </p>
            </div>
          </section>
        )}

        {/* Preview Section */}
        {isUrl && (
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/50 ml-1">Website Preview</h3>
            <div className="bg-white/10 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
              <div className="aspect-video w-full bg-white/5 overflow-hidden relative">
                <img 
                  className="w-full h-full object-cover opacity-80" 
                  src={`https://picsum.photos/seed/${encodeURIComponent(result.data)}/800/450`} 
                  alt="Preview" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10">
                      <span className="material-icons-round text-white text-3xl">visibility</span>
                   </div>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden">
                    <span className="material-icons-round text-primary text-xl">public</span>
                  </div>
                  <h4 className="font-black text-white truncate text-base">{new URL(result.data).hostname}</h4>
                </div>
                <p className="text-sm text-white/60 font-bold line-clamp-2 leading-relaxed">
                  Secure gateway verified by Somiddho Smart Scanner. Content analyzed for potential risks and safety compliance.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Technical Metadata */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-white/50 ml-1">Metadata Details</h3>
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-sm text-white/60 font-bold">Content Type</span>
              <span className="text-sm font-black text-primary">{result.type}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-sm text-white/60 font-bold">Scanned At</span>
              <span className="text-sm font-black">{new Date(result.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-white/60 font-bold">Security Protocol</span>
              <span className="text-sm font-mono font-black text-primary">{isUrl ? 'HTTPS/SSL' : 'Plain Text'}</span>
            </div>
          </div>
        </section>

        {/* Primary Action Button */}
        <section className="no-print pt-4">
          <button 
            onClick={handleAction} 
            className="w-full h-16 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_15px_40px_rgba(13,242,89,0.3)] uppercase tracking-[0.15em] text-base"
          >
            <span className="material-icons-round text-2xl">{isUrl ? 'open_in_browser' : 'search'}</span>
            {isUrl ? t.open_browser : `${t.search_on} ${searchEngine}`}
          </button>
        </section>

        {/* Secondary Actions */}
        <section className="grid grid-cols-2 gap-4 no-print">
          <button onClick={handlePrint} className="h-16 rounded-2xl glass-panel border border-white/10 flex items-center justify-center gap-3 active:scale-95 text-white font-black">
            <span className="material-icons-round text-2xl">picture_as_pdf</span>
            <span className="text-xs font-black uppercase tracking-widest">{t.download_pdf}</span>
          </button>
          <button onClick={onBack} className="h-16 rounded-2xl glass-panel border border-white/10 flex items-center justify-center gap-3 active:scale-95 text-white font-black">
            <span className="material-icons-round text-2xl">qr_code_scanner</span>
            <span className="text-xs font-black uppercase tracking-widest">{t.back}</span>
          </button>
        </section>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setShowConfirm(false)}
            ></motion.div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm glass-panel rounded-[2.5rem] border border-white/10 p-8 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                <span className="material-icons-round text-primary text-3xl">{isUrl ? 'link' : 'search'}</span>
              </div>
              <h2 className="text-xl font-bold text-center mb-4 leading-tight">
                {isUrl ? t.confirm_open : t.confirm_search}
              </h2>
              <p className="text-white/40 text-xs text-center mb-8 leading-relaxed italic break-all px-4">
                {result.data}
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmAction}
                  className="w-full h-14 bg-primary text-black font-black rounded-2xl flex items-center justify-center active:scale-95 transition-all uppercase tracking-widest text-xs"
                >
                  {t.confirm}
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="w-full h-14 glass-panel border border-white/5 text-white/60 font-bold rounded-2xl flex items-center justify-center active:scale-95 transition-all uppercase tracking-widest text-xs"
                >
                  {t.cancel}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultDetailsView;
