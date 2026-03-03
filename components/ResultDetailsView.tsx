
import React, { useState } from 'react';
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

  const isUrl = result.data.trim().toLowerCase().startsWith('http');

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
    // Ensuring the layout is ready for print
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

  return (
    <div className="h-full overflow-y-auto bg-rose-950 text-white flex flex-col font-display hide-scrollbar">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-rose-950/90 backdrop-blur-2xl border-b border-white/5 no-print">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-start text-white/40 active:scale-90 transition-transform">
          <span className="material-icons-round">arrow_back_ios</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight">{t.scan_result}</h1>
        <button onClick={() => onToggleFavorite(result.id)} className={`w-10 h-10 flex items-center justify-end transition-all active:scale-90 ${result.isFavorite ? 'text-primary' : 'text-white/40'}`}>
          <span className="material-icons-round">{result.isFavorite ? 'star' : 'star_outline'}</span>
        </button>
      </header>

      <main className="flex-1 px-6 pb-32 space-y-6 pt-6 max-w-lg mx-auto w-full">
        {/* Main Content Card */}
        <section className="glass-panel rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="aspect-square w-full bg-white flex items-center justify-center p-8 relative">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(result.data)}`} 
              className="w-full h-full object-contain" 
              alt="QR Code" 
            />
            <div className="absolute top-4 right-4 bg-primary text-black text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg no-print">
              {result.type}
            </div>
          </div>
          <div className="p-8 bg-rose-950/40">
            <p className="text-[10px] uppercase font-bold text-primary/60 mb-2 tracking-[0.2em]">{t.scanned_content}</p>
            <p className="text-lg font-bold break-all text-white leading-tight mb-4">{result.data}</p>
            <p className="text-[10px] text-white/20 uppercase tracking-widest">{new Date(result.timestamp).toLocaleString()}</p>
          </div>
        </section>

        {/* Primary Action Button - Prominently Visible */}
        <section className="no-print">
          <button 
            onClick={handleAction} 
            className="w-full h-16 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_15px_40px_rgba(13,242,89,0.35)] uppercase tracking-[0.15em] text-sm"
          >
            <span className="material-icons-round">{isUrl ? 'open_in_browser' : 'search'}</span>
            {isUrl ? t.open_browser : `${t.search_on} ${searchEngine}`}
          </button>
        </section>

        {/* Secondary Actions Grid */}
        <section className="grid grid-cols-2 gap-4 no-print">
          <button onClick={handleCopy} className={`p-5 rounded-[2rem] border transition-all flex flex-col items-center gap-2 active:scale-95 ${copySuccess ? 'border-primary bg-primary/10 text-primary' : 'glass-panel border-white/5 text-white/60'}`}>
            <span className="material-icons-round">{copySuccess ? 'check' : 'content_copy'}</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{t.copy_text}</span>
          </button>
          <button onClick={handlePrint} className="p-5 rounded-[2rem] glass-panel border border-white/5 flex flex-col items-center gap-2 active:scale-95 text-white/60">
            <span className="material-icons-round">picture_as_pdf</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{t.download_pdf}</span>
          </button>
        </section>

        {/* Share Button */}
        <section className="no-print">
          <button onClick={handleShare} className="w-full p-5 glass-panel rounded-[2rem] border border-white/5 flex items-center justify-center gap-3 active:scale-95 transition-all text-white/60">
             <span className="material-icons-round text-primary">share</span>
             <span className="text-[10px] font-black uppercase tracking-widest">{t.share_result}</span>
          </button>
        </section>
        
        {/* Info Box */}
        <section className="glass-panel p-6 rounded-[2rem] border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-icons-round text-primary/40">security</span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">{t.privacy_protected}</p>
          </div>
          <p className="text-[11px] text-white/40 leading-relaxed italic">
            {t.privacy_desc}
          </p>
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
