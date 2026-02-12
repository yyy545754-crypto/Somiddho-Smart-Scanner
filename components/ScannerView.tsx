
import React, { useRef, useEffect, useState, useCallback } from 'react';
import jsQR from 'jsqr';
import { ScanResult } from '../types';

interface ScannerViewProps {
  onResult: (result: ScanResult) => void;
  lastScan?: ScanResult;
  onViewRecent: (result: ScanResult) => void;
  onViewHistory?: () => void;
  onViewFavorites?: () => void;
}

const ScannerView: React.FC<ScannerViewProps> = ({ onResult, lastScan, onViewRecent, onViewHistory, onViewFavorites }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanPaused, setScanPaused] = useState(false);

  useEffect(() => {
    async function setupCamera() {
      setCameraError(null);
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: any) {
        setCameraError(err.message || "Camera not found");
      }
    }
    setupCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScanSuccess = (data: string, explicitImageData?: string) => {
    if (isProcessing || scanPaused) return;
    setScanPaused(true);
    setIsProcessing(true);
    
    const imageData = explicitImageData || captureFrame();
    
    const result: ScanResult = {
      id: Date.now().toString(),
      data: data,
      timestamp: Date.now(),
      type: data.startsWith('http') ? 'URL' : 'TEXT',
      imageUrl: imageData || undefined,
      isFavorite: false
    };

    onResult(result);
    setIsProcessing(false);
    setTimeout(() => setScanPaused(false), 2000);
  };

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.8);
    }
    return null;
  }, []);

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            handleScanSuccess(code.data, event.target?.result as string);
          } else {
            alert("No QR code found in this image.");
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    let requestRef: number;
    const scanFrame = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && !scanPaused) {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) handleScanSuccess(code.data);
          }
        }
      }
      requestRef = requestAnimationFrame(scanFrame);
    };
    requestRef = requestAnimationFrame(scanFrame);
    return () => cancelAnimationFrame(requestRef);
  }, [scanPaused]);

  return (
    <div className="relative h-full flex flex-col">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      <div className="absolute inset-0 z-0 bg-black">
        {cameraError ? (
          <div className="flex flex-col items-center justify-center h-full p-10 text-center">
            <span className="material-icons-round text-6xl text-white/10 mb-4">videocam_off</span>
            <p className="text-white/30 text-xs font-medium uppercase tracking-widest">{cameraError}</p>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-60" />
        )}
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
      </div>

      <header className="relative z-10 px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(13,242,89,0.3)]">
            <span className="material-icons-round text-black text-xl">qr_code_scanner</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none">Somiddho</h1>
            <p className="text-[9px] uppercase tracking-[0.2em] text-primary font-bold mt-1">Pro Scanner</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={() => onViewFavorites && onViewFavorites()} 
            className="w-12 h-12 flex items-center justify-center rounded-full glass-panel text-white/40 active:scale-90"
          >
            <span className="material-icons-round text-xl">star_outline</span>
          </button>
          <button 
            onClick={() => setFlashOn(!flashOn)} 
            className={`w-12 h-12 flex items-center justify-center rounded-full glass-panel transition-all active:scale-90 ${flashOn ? 'text-primary border-primary/40 bg-primary/10' : 'text-white/40'}`}
          >
            <span className="material-icons-round text-xl">{flashOn ? 'flash_on' : 'flash_off'}</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 transition-all duration-500">
          <div className="hud-corner top-0 left-0 border-t-4 border-l-4 rounded-tl-2xl shadow-[0_0_10px_var(--primary-color)]"></div>
          <div className="hud-corner top-0 right-0 border-t-4 border-r-4 rounded-tr-2xl shadow-[0_0_10px_var(--primary-color)]"></div>
          <div className="hud-corner bottom-0 left-0 border-b-4 border-l-4 rounded-bl-2xl shadow-[0_0_10px_var(--primary-color)]"></div>
          <div className="hud-corner bottom-0 right-0 border-b-4 border-r-4 rounded-br-2xl shadow-[0_0_10px_var(--primary-color)]"></div>
          <div className="scanner-line opacity-60"></div>
        </div>
        
        <p className="mt-8 text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">Align QR code to scan</p>

        <div className="mt-auto w-full px-6 pb-8 space-y-4">
          <div className="flex gap-4">
            <button 
              onClick={handleGalleryClick}
              className="flex-1 h-14 glass-panel rounded-2xl flex items-center justify-center gap-2 text-white/60 hover:text-white transition-all active:scale-95 border-white/5"
            >
              <span className="material-icons-round text-xl">photo_library</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Gallery</span>
            </button>
            <button 
              onClick={() => onViewHistory && onViewHistory()}
              className="w-14 h-14 glass-panel rounded-2xl flex items-center justify-center text-white/60 active:scale-95 border-white/5"
            >
              <span className="material-icons-round text-xl">history</span>
            </button>
          </div>

          <div className="bg-black/60 backdrop-blur-2xl rounded-[2rem] p-5 border border-white/5">
            <div className="flex justify-center gap-4 mb-4">
              {[1, 2, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setZoom(val)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${zoom === val ? 'bg-primary text-black font-bold' : 'bg-white/5 text-white/40'}`}
                >
                  <span className="text-[10px] uppercase font-black">{val}x</span>
                </button>
              ))}
            </div>
            <input 
              type="range" min="1" max="10" step="0.1" value={zoom} 
              onChange={(e) => setZoom(parseFloat(e.target.value))} 
              className="w-full accent-primary h-1 bg-white/10 rounded-full appearance-none" 
            />
          </div>
        </div>
      </main>

      {lastScan && (
        <footer className="relative z-10 px-6 pb-6">
          <button 
            onClick={() => onViewRecent(lastScan)}
            className="w-full glass-panel p-3 rounded-2xl flex items-center gap-4 border-white/5 shadow-2xl animate-in slide-in-from-bottom-4 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden shrink-0">
              {lastScan.imageUrl ? (
                <img src={lastScan.imageUrl} className="w-full h-full object-cover" />
              ) : (
                <span className="material-icons-round text-primary">qr_code_2</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] text-primary font-black uppercase tracking-widest">Last Scan Found</p>
              <p className="text-xs font-bold text-white/80 truncate mt-0.5">{lastScan.data}</p>
            </div>
            <span className="material-icons-round text-white/20">chevron_right</span>
          </button>
        </footer>
      )}
    </div>
  );
};

export default ScannerView;
