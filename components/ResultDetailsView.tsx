
import React, { useState } from 'react';
import { ScanResult } from '../types';

interface ResultDetailsViewProps {
  result: ScanResult;
  onBack: () => void;
  onToggleFavorite: (id: string) => void;
}

const ResultDetailsView: React.FC<ResultDetailsViewProps> = ({ result, onBack, onToggleFavorite }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const isUrl = result.data.trim().toLowerCase().startsWith('http');

  const handleAction = () => {
    if (isUrl) {
      window.open(result.data.trim(), '_blank', 'noopener,noreferrer');
    } else {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(result.data)}`, '_blank');
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
    <div className="h-full overflow-y-auto bg-background-dark text-white flex flex-col font-display hide-scrollbar">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-background-dark/90 backdrop-blur-2xl border-b border-white/5 no-print">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-start text-white/40 active:scale-90 transition-transform">
          <span className="material-icons-round">arrow_back_ios</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight">Scan Result</h1>
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
          <div className="p-8 bg-background-dark/40">
            <p className="text-[10px] uppercase font-bold text-primary/60 mb-2 tracking-[0.2em]">Scanned Content</p>
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
            {isUrl ? 'Open in Browser' : 'Search on Web'}
          </button>
        </section>

        {/* Secondary Actions Grid */}
        <section className="grid grid-cols-2 gap-4 no-print">
          <button onClick={handleCopy} className={`p-5 rounded-[2rem] border transition-all flex flex-col items-center gap-2 active:scale-95 ${copySuccess ? 'border-primary bg-primary/10 text-primary' : 'glass-panel border-white/5 text-white/60'}`}>
            <span className="material-icons-round">{copySuccess ? 'check' : 'content_copy'}</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Copy Text</span>
          </button>
          <button onClick={handlePrint} className="p-5 rounded-[2rem] glass-panel border border-white/5 flex flex-col items-center gap-2 active:scale-95 text-white/60">
            <span className="material-icons-round">picture_as_pdf</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Download PDF</span>
          </button>
        </section>

        {/* Share Button */}
        <section className="no-print">
          <button onClick={handleShare} className="w-full p-5 glass-panel rounded-[2rem] border border-white/5 flex items-center justify-center gap-3 active:scale-95 transition-all text-white/60">
             <span className="material-icons-round text-primary">share</span>
             <span className="text-[10px] font-black uppercase tracking-widest">Share Result</span>
          </button>
        </section>
        
        {/* Info Box */}
        <section className="glass-panel p-6 rounded-[2rem] border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-icons-round text-primary/40">security</span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Privacy Protected</p>
          </div>
          <p className="text-[11px] text-white/40 leading-relaxed italic">
            This information is stored only on your device. You can safely open links or save this as a PDF document.
          </p>
        </section>
      </main>
    </div>
  );
};

export default ResultDetailsView;
