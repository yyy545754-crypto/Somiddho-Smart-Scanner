
import React from 'react';
import { ScanResult } from '../types';

interface FavoritesViewProps {
  favorites: ScanResult[];
  onSelectItem: (result: ScanResult) => void;
  toggleFavorite: (id: string) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ favorites, onSelectItem, toggleFavorite }) => {
  return (
    <div className="h-full overflow-y-auto bg-background-dark p-6 hide-scrollbar">
      <header className="flex justify-between items-center py-8 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Favorites</h1>
          <p className="text-primary text-sm font-medium uppercase tracking-widest mt-1">{favorites.length} Starred Scans</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-icons-round">star</span>
        </div>
      </header>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-10">
          <span className="material-icons-round text-9xl mb-4">star_border</span>
          <p className="text-sm font-bold uppercase tracking-[0.3em]">No Favorites Yet</p>
        </div>
      ) : (
        <div className="space-y-4 mb-32">
          {favorites.map((item) => (
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
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">{item.type}</p>
                  <p className="text-sm font-bold text-white truncate">{item.data}</p>
                  <p className="text-[10px] text-white/20 mt-1 uppercase font-medium">{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {new Date(item.timestamp).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                >
                  <span className="material-icons-round text-sm">star</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesView;
