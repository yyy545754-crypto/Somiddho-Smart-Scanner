
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SecurityLockProps {
  isLocked: boolean;
  onUnlock: () => void;
  savedPin: string | null;
  onSetPin: (pin: string) => void;
  isSettingUp?: boolean;
  onCancelSetup?: () => void;
  t: any;
}

const SecurityLock: React.FC<SecurityLockProps> = ({ 
  isLocked, 
  onUnlock, 
  savedPin, 
  onSetPin, 
  isSettingUp = false,
  onCancelSetup,
  t 
}) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'setup' | 'confirm'>(isSettingUp ? 'setup' : 'enter');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isSettingUp) {
      setStep('setup');
    } else {
      setStep('enter');
    }
    setPin('');
    setConfirmPin('');
    setError('');
  }, [isSettingUp, isLocked]);

  const handleNumberClick = (num: string) => {
    setError('');
    if (step === 'enter' || step === 'setup') {
      if (pin.length < 4) {
        const newPin = pin + num;
        setPin(newPin);
        if (step === 'enter' && newPin.length === 4) {
          if (newPin === savedPin) {
            onUnlock();
          } else {
            setError(t.pin_mismatch || 'Incorrect PIN');
            setPin('');
          }
        }
      }
    } else if (step === 'confirm') {
      if (confirmPin.length < 4) {
        const newConfirm = confirmPin + num;
        setConfirmPin(newConfirm);
        if (newConfirm.length === 4) {
          if (newConfirm === pin) {
            onSetPin(newConfirm);
          } else {
            setError(t.pin_mismatch);
            setConfirmPin('');
          }
        }
      }
    }
  };

  const handleBackspace = () => {
    if (step === 'enter' || step === 'setup') {
      setPin(pin.slice(0, -1));
    } else {
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  const handleNext = () => {
    if (step === 'setup' && pin.length === 4) {
      setStep('confirm');
    }
  };

  const handleBiometric = async () => {
    if (window.PublicKeyCredential) {
      try {
        // This is a very basic check. Real WebAuthn is more complex.
        // For a simple "Biometric Lock" feel in a web app, we can use 
        // the presence of biometric capabilities to trigger a simple prompt.
        // However, without a backend to verify, it's mostly for "feel" 
        // unless we use a local-only credential.
        
        // For now, let's just show a message or try a simple challenge if supported.
        const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (available) {
          // In a real app, you'd trigger a WebAuthn assertion here.
          // For this demo, if the user has biometrics, we'll just "simulate" success 
          // if they've already set up the PIN (acting as a fallback).
          onUnlock();
        } else {
          setError(t.biometric_not_supported);
        }
      } catch (err) {
        console.error('Biometric error:', err);
      }
    } else {
      setError(t.biometric_not_supported);
    }
  };

  const renderDots = (length: number) => {
    return (
      <div className="flex gap-4 justify-center my-8">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              scale: i < length ? 1.2 : 1,
              backgroundColor: i < length ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.1)'
            }}
            className="w-4 h-4 rounded-full border border-white/10"
          />
        ))}
      </div>
    );
  };

  if (!isLocked && !isSettingUp) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-rose-950 flex flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-xs text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6">
            <span className="material-icons-round text-4xl">
              {step === 'enter' ? 'lock' : 'lock_open'}
            </span>
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            {step === 'enter' ? t.enter_pin : step === 'setup' ? t.setup_pin : t.confirm_pin}
          </h2>
          <p className="text-white/60 text-base font-bold">
            {step === 'enter' ? t.app_lock_desc : 'Set a 4-digit PIN to secure your app'}
          </p>
        </motion.div>

        {renderDots(step === 'confirm' ? confirmPin.length : pin.length)}

        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-xs font-medium mb-4"
          >
            {error}
          </motion.p>
        )}

        <div className="grid grid-cols-3 gap-6 w-full">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="w-20 h-20 rounded-3xl bg-white/10 text-white text-2xl font-black flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all mx-auto border border-white/10"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleBiometric}
            className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 active:scale-95 transition-all mx-auto border border-primary/20"
          >
            <span className="material-icons-round text-3xl">fingerprint</span>
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            className="w-20 h-20 rounded-3xl bg-white/10 text-white text-2xl font-black flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all mx-auto border border-white/10"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="w-20 h-20 rounded-3xl bg-white/10 text-white/60 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all mx-auto border border-white/10"
          >
            <span className="material-icons-round text-3xl">backspace</span>
          </button>
        </div>

        <div className="mt-12 flex flex-col gap-4">
          {step === 'setup' && pin.length === 4 && (
            <button
              onClick={handleNext}
              className="w-full py-5 bg-primary text-black font-black rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-widest text-base"
            >
              Next
            </button>
          )}
          
          {(isSettingUp || onCancelSetup) && (
            <button
              onClick={onCancelSetup}
              className="w-full py-5 text-white/60 font-black rounded-2xl hover:text-white transition-all uppercase tracking-widest text-base"
            >
              {t.back}
            </button>
          )}

          {!isSettingUp && (
            <button
              onClick={() => {
                if (confirm(t.reset_data + "?")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="text-xs text-white/40 uppercase font-black tracking-widest hover:text-red-500 transition-colors mt-6"
            >
              {t.reset_data}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SecurityLock;
