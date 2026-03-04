
import React from 'react';
import { ScanResult } from '../types';

interface HistoryViewProps {
  history: ScanResult[];
  clearHistory: () => void;
  deleteItem: (id: string) => void;
  onSelectItem: (result: ScanResult) => void;
  t: any;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, clearHistory, deleteItem, onSelectItem, t }) => {
  const exportToJSON = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `somiddho-history-${new Date().toISOString()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Type', 'Data', 'Timestamp', 'Date'];
    const rows = history.map(item => [
      item.id,
      item.type,
      `"${item.data.replace(/"/g, '""')}"`,
      item.timestamp,
      new Date(item.timestamp).toLocaleString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `somiddho-history-${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full overflow-y-auto bg-rose-950 p-6 hide-scrollbar">
      <header className="flex justify-between items-center py-8 mb-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">{t.history}</h1>
          <p className="text-primary text-base font-black uppercase tracking-widest mt-1">{history.length} {t.saved_scans}</p>
        </div>
        <div className="flex gap-2">
          {history.length > 0 && (
            <>
              <button 
                onClick={exportToCSV} 
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:bg-primary/10 hover:text-primary transition-all"
                title="Export CSV"
              >
                <span className="material-icons-round">table_view</span>
              </button>
              <button 
                onClick={exportToJSON} 
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:bg-primary/10 hover:text-primary transition-all"
                title="Export JSON"
              >
                <span className="material-icons-round">data_object</span>
              </button>
            </>
          )}
          <button onClick={clearHistory} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:bg-red-500/10 hover:text-red-500 transition-all">
            <span className="material-icons-round">delete_sweep</span>
          </button>
        </div>
      </header>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-20">
          <span className="material-icons-round text-9xl mb-4 text-white">history</span>
          <p className="text-base font-black uppercase tracking-[0.3em] text-white">{t.empty_activity}</p>
        </div>
      ) : (
        <div className="space-y-4 mb-32">
          {history.map((item) => (
            <div 
              key={item.id} 
              className="group relative"
            >
              <div 
                onClick={() => onSelectItem(item)}
                className="glass-panel p-4 rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-all active:scale-[0.98] border border-white/5"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary overflow-hidden shrink-0">
                  {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover opacity-80" /> : <span className="material-icons-round text-2xl">qr_code</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black text-primary uppercase tracking-widest mb-1">{item.type}</p>
                  <p className="text-lg font-black text-white truncate">{item.data}</p>
                  <p className="text-[12px] text-white/40 mt-1 uppercase font-bold">{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {new Date(item.timestamp).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(item.id);
                  }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <span className="material-icons-round text-lg">close</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
