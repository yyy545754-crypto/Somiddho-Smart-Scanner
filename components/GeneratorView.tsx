
import React, { useState, useEffect } from 'react';
import { QRType } from '../types';

interface GeneratorViewProps {
  t: any;
}

const GeneratorView: React.FC<GeneratorViewProps> = ({ t }) => {
  const [type, setType] = useState<QRType>(QRType.URL);
  const [color, setColor] = useState('#0df259');
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Common Fields
  const [value, setValue] = useState(''); // Used for URL, Text

  // WiFi Specific Fields
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');

  // WhatsApp Specific Fields
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  // Contact Specific Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const constructQRData = () => {
    switch (type) {
      case QRType.WIFI:
        return `WIFI:S:${ssid};T:${encryption};P:${password};;`;
      case QRType.WHATSAPP:
        const cleanPhone = phone.replace(/\D/g, '');
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      case QRType.CONTACT:
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
      case QRType.URL:
        let url = value;
        if (url && !url.startsWith('http')) url = 'https://' + url;
        return url;
      default:
        return value;
    }
  };

  const handleGenerate = () => {
    const data = constructQRData();
    if (!data) return;

    setIsGenerating(true);
    const encodedData = encodeURIComponent(data);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&color=${color.replace('#', '')}&data=${encodedData}&bgcolor=ffffff&margin=10`;
    
    const img = new Image();
    img.onload = () => {
      setGeneratedUrl(qrUrl);
      setIsGenerating(false);
    };
    img.src = qrUrl;
  };

  const handleSaveImage = async () => {
    if (!generatedUrl) return;
    try {
      const response = await fetch(generatedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `somiddho-qr-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const types = [
    { id: QRType.URL, icon: 'link', label: 'URL' },
    { id: QRType.WIFI, icon: 'wifi', label: 'Wi-Fi' },
    { id: QRType.TEXT, icon: 'textsms', label: 'Text' },
    { id: QRType.CONTACT, icon: 'contact_page', label: 'Contact' },
    { id: QRType.WHATSAPP, icon: 'chat', label: 'WA' },
  ];

  const colors = ['#0df259', '#1392ec', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ffffff'];

  return (
    <div className="h-full overflow-y-auto hide-scrollbar bg-rose-950 p-6 pb-32">
      <header className="flex justify-between items-center py-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{t.generator}</h1>
          <p className="text-primary text-sm font-medium">Somiddho Pro</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-icons-round">auto_fix_high</span>
        </button>
      </header>

      {/* Type Selector */}
      <section className="mb-8">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4 px-1">{t.select_type}</h2>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6">
          {types.map((t) => (
            <div key={t.id} className="flex-shrink-0 flex flex-col items-center gap-2">
              <button 
                onClick={() => { setType(t.id); setGeneratedUrl(null); }}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${type === t.id ? 'bg-primary text-black shadow-lg shadow-primary/40 scale-105' : 'bg-white/5 text-white/40'}`}
              >
                <span className="material-icons-round text-3xl">{t.icon}</span>
              </button>
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${type === t.id ? 'text-primary' : 'text-white/30'}`}>{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Input Fields */}
      <section className="mb-8">
        <div className="glass-panel rounded-3xl p-6 border border-white/5">
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4">{t.content_input}</label>
          
          <div className="space-y-4">
            {type === QRType.WIFI && (
              <>
                <InputField label="Network Name (SSID)" placeholder="Home WiFi" value={ssid} onChange={setSsid} />
                <InputField label="Password" placeholder="••••••••" type="password" value={password} onChange={setPassword} />
                <div>
                  <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-2 block">Security</label>
                  <div className="flex gap-2">
                    {['WPA', 'WEP', 'nopass'].map(enc => (
                      <button 
                        key={enc}
                        onClick={() => setEncryption(enc)}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${encryption === enc ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-white/30 border border-transparent'}`}
                      >
                        {enc === 'nopass' ? 'None' : enc}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {type === QRType.URL && (
              <InputField label="Website Link" placeholder="example.com" value={value} onChange={setValue} prefix="https://" />
            )}

            {type === QRType.TEXT && (
              <div className="space-y-1">
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-primary text-white placeholder-white/20 outline-none text-sm min-h-[100px]"
                  placeholder="Enter your text here..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            )}

            {type === QRType.WHATSAPP && (
              <>
                <InputField label="Phone Number" placeholder="+8801700000000" value={phone} onChange={setPhone} />
                <InputField label="Default Message" placeholder="Hello!" value={message} onChange={setMessage} />
              </>
            )}

            {type === QRType.CONTACT && (
              <>
                <InputField label="Full Name" placeholder="John Doe" value={name} onChange={setName} />
                <InputField label="Phone" placeholder="+123456789" value={phone} onChange={setPhone} />
                <InputField label="Email" placeholder="john@example.com" value={email} onChange={setEmail} />
              </>
            )}
          </div>
          <p className="mt-4 text-[9px] text-white/20 italic text-center">Auto-formatted for best compatibility.</p>
        </div>
      </section>

      {/* Customization & Generate */}
      <section className="space-y-6">
        <div className="glass-panel rounded-3xl p-5 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3">
             <span className="material-icons-round text-primary text-2xl">palette</span>
             <div>
                <p className="text-xs font-bold text-white leading-none">{t.qr_color}</p>
                <p className="text-[9px] text-white/30 uppercase mt-1 tracking-widest">{color}</p>
             </div>
          </div>
          <div className="flex gap-1.5">
            {colors.map((c) => (
              <button 
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${color === c ? 'border-white scale-110 shadow-lg shadow-white/10' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${isGenerating ? 'bg-white/5 text-white/20' : 'bg-white/10 text-white hover:bg-white/20 shadow-xl shadow-black/40'}`}
        >
          {isGenerating ? (
            <span className="material-icons-round animate-spin">sync</span>
          ) : (
            <>
              <span className="material-icons-round">qr_code_2</span>
              <span>{t.generate_qr}</span>
            </>
          )}
        </button>

        {generatedUrl && (
          <div className="mt-4 p-8 glass-panel rounded-[2.5rem] border border-primary/20 flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className="bg-white p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <img src={generatedUrl} alt="Generated QR" className="w-48 h-48" />
            </div>
            <div className="flex gap-3 w-full mt-8">
              <button 
                onClick={handleSaveImage}
                className="flex-1 bg-white/5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/10 hover:text-white transition-all"
              >
                {t.download}
              </button>
              <button 
                className="flex-1 bg-primary py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black shadow-lg shadow-primary/20 active:scale-95 transition-all"
                onClick={async () => {
                  if (navigator.share) {
                    try { await navigator.share({ title: 'QR Code', url: generatedUrl }); } catch (e) {}
                  } else {
                    alert('Sharing not supported on this browser');
                  }
                }}
              >
                {t.share}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

const InputField = ({ label, placeholder, value, onChange, type = 'text', prefix }: any) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest block ml-1">{label}</label>
    <div className="relative">
      {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 text-xs font-bold">{prefix}</span>}
      <input 
        type={type}
        className={`w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pr-4 focus:ring-1 focus:ring-primary text-white placeholder-white/10 outline-none text-sm transition-all ${prefix ? 'pl-16' : 'pl-4'}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

export default GeneratorView;
