
import React from 'react';

interface LegalViewProps {
  title: string;
  content: React.ReactNode;
  onBack: () => void;
}

const LegalView: React.FC<LegalViewProps> = ({ title, content, onBack }) => {
  return (
    <div className="h-full overflow-y-auto bg-rose-950 text-white font-display flex flex-col">
      <header className="px-6 py-6 flex items-center gap-6 sticky top-0 z-50 bg-rose-950/90 backdrop-blur-2xl border-b border-white/10">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors active:scale-90">
          <span className="material-icons-round text-2xl">arrow_back</span>
        </button>
        <h1 className="text-2xl font-black tracking-tight">{title}</h1>
      </header>

      <main className="flex-1 px-6 py-10 pb-32 space-y-8 max-w-2xl mx-auto leading-relaxed text-white/90">
        {content}
      </main>
    </div>
  );
};

export const PrivacyContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-primary font-black text-xl mb-3 uppercase tracking-widest">Introduction</h2>
      <p className="text-base font-bold leading-relaxed">At Somiddho Smart Scanner, your privacy is our top priority. This Privacy Policy explains how we handle your information when you use our application.</p>
    </section>
    <section>
      <h2 className="text-primary font-black text-xl mb-3 uppercase tracking-widest">Local Data Processing</h2>
      <p className="text-base font-bold leading-relaxed">We believe in total privacy. All QR code scanning and image generation are performed locally on your device. We do not upload your camera feed, scanned content, or generated codes to any external servers.</p>
    </section>
    <section>
      <h2 className="text-primary font-black text-xl mb-3 uppercase tracking-widest">Permissions</h2>
      <p className="text-base font-bold leading-relaxed mb-4"><strong>Camera:</strong> Used exclusively for scanning QR codes. No images or videos are recorded or stored unless you manually save a scan result to your history.</p>
      <p className="text-base font-bold leading-relaxed"><strong>Storage:</strong> Used to save generated QR codes to your gallery and to keep your scan history on your device via LocalStorage.</p>
    </section>
    <section>
      <h2 className="text-primary font-black text-xl mb-3 uppercase tracking-widest">Information Security</h2>
      <p className="text-base font-bold leading-relaxed">Your scan history is stored locally in your browser/app cache. Clearing app data or browser cache will remove all your stored scans.</p>
    </section>
  </div>
);

export const TermsContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-primary font-black text-xl mb-3 uppercase tracking-widest">1. Usage Agreement</h2>
      <p className="text-base font-bold leading-relaxed">By using Somiddho Smart Scanner, you agree to these terms. This app is provided for personal and professional use to scan and generate QR codes.</p>
    </section>
    <section>
      <h2 className="text-primary font-black text-xl mb-3 uppercase tracking-widest">2. Limitation of Liability</h2>
      <p className="text-base font-bold leading-relaxed">Somiddho Labs is not responsible for the content of the QR codes you scan. Users are advised to exercise caution when scanning codes from untrusted sources, as they may lead to malicious websites or content.</p>
    </section>
    <section>
      <h2 className="text-primary font-black text-xl mb-3 uppercase tracking-widest">3. No Warranty</h2>
      <p className="text-base font-bold leading-relaxed">The application is provided "as is" without any warranties of any kind. While we strive for accuracy, we do not guarantee that the scanner will work perfectly in all conditions or with all code types.</p>
    </section>
    <section>
      <h2 className="text-primary font-black text-xl mb-3 uppercase tracking-widest">4. Changes to Terms</h2>
      <p className="text-base font-bold leading-relaxed">We reserve the right to update these terms at any time. Continued use of the app constitutes acceptance of the updated terms.</p>
    </section>
  </div>
);

export default LegalView;
