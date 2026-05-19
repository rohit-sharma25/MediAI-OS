import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ApiKeyModal() {
  const { 
    isApiKeyModalOpen, 
    setIsApiKeyModalOpen,
    saveApiKey, 
    apiStatus, 
    apiError, 
    apiProvider, 
    setApiProvider, 
    geminiKey, 
    groqKey 
  } = useApp();

  const [providerTab, setProviderTab] = useState(apiProvider);
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Sync inputs when active provider changes or modal opens
  useEffect(() => {
    setProviderTab(apiProvider);
    setKeyInput(apiProvider === 'gemini' ? geminiKey : groqKey);
    setErrorText('');
  }, [isApiKeyModalOpen, apiProvider, geminiKey, groqKey]);

  if (!isApiKeyModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorText('');

    const trimmedKey = keyInput.trim();
    if (!trimmedKey) {
      setErrorText(`${providerTab === 'gemini' ? 'Gemini' : 'Groq'} API key cannot be blank.`);
      return;
    }

    // Set active provider in context
    setApiProvider(providerTab);

    // Validate and save credentials
    const result = await saveApiKey(trimmedKey, providerTab);
    if (!result.success) {
      setErrorText(result.error || 'Connection handshake failed. Please verify credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        className="w-full max-w-lg overflow-hidden glass-panel rounded-2xl relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsApiKeyModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-lg border border-slate-800/80 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-slate-650 transition cursor-pointer z-10"
          title="Close Settings"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Animated Cybernetic border accent line */}
        <div 
          className={`absolute top-0 left-0 right-0 h-[3px] transition-all duration-500 ${
            providerTab === 'gemini' 
              ? 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500' 
              : 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500'
          }`} 
        />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div 
              className={`p-3 rounded-xl border transition-all duration-500 ${
                providerTab === 'gemini'
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                  : 'bg-orange-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.2)]'
              }`}
            >
              <Shield className="w-8 h-8 pulse-heart" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-wider uppercase text-slate-100 font-orbitron">
                MediAI OS Initializer
              </h2>
              <p className="text-xs text-slate-400 tracking-widest uppercase">
                Secure Client Portal Connection
              </p>
            </div>
          </div>

          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            Welcome to **MediAI Healthcare AI OS**. Authenticate your local session using a personal secure API token to initialize diagnostic operations.
          </p>

          {/* Provider Toggle Switch */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/60 border border-slate-800/80 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setProviderTab('gemini');
                setKeyInput(geminiKey);
                setErrorText('');
              }}
              className={`py-2.5 px-3 rounded-lg font-bold text-xs uppercase tracking-wider font-orbitron transition duration-300 flex items-center justify-center gap-2 ${
                providerTab === 'gemini'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-extrabold'
                  : 'border border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full bg-cyan-400 ${providerTab === 'gemini' && 'animate-ping'}`} />
              Google Gemini
            </button>
            <button
              type="button"
              onClick={() => {
                setProviderTab('groq');
                setKeyInput(groqKey);
                setErrorText('');
              }}
              className={`py-2.5 px-3 rounded-lg font-bold text-xs uppercase tracking-wider font-orbitron transition duration-300 flex items-center justify-center gap-2 ${
                providerTab === 'groq'
                  ? 'bg-gradient-to-r from-rose-500/20 to-orange-500/20 border border-orange-500/50 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.15)] font-extrabold'
                  : 'border border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full bg-orange-400 ${providerTab === 'groq' && 'animate-ping'}`} />
              Groq Cloud
            </button>
          </div>

          {/* Alert Security Note */}
          <div className="mb-6 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex gap-3 items-start">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-emerald-400">Zero Server Data Leak:</strong> Credentials are encrypted and hosted exclusively inside your sandbox browser (<code className="bg-slate-950 px-1 py-0.5 rounded text-emerald-300">localStorage</code>). No information is tracked or logs gathered.
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 font-rajdhani mb-2">
                {providerTab === 'gemini' ? 'Google Gemini' : 'Groq Cloud'} API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder={
                    providerTab === 'gemini' 
                      ? 'Enter AIzaSy... API key' 
                      : 'Enter gsk_... API key'
                  }
                  className="w-full bg-slate-950/70 border border-slate-800/80 rounded-xl py-3.5 pl-11 pr-12 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition duration-300 font-mono tracking-wide"
                  disabled={apiStatus === 'validating'}
                />
                <Key className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  disabled={apiStatus === 'validating'}
                >
                  {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {(errorText || apiError) && (
                <motion.div
                  className="mb-5 p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 flex gap-2 items-start text-xs text-rose-400"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorText || apiError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Button */}
            <button
              type="submit"
              className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-wider font-orbitron transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2 cursor-pointer text-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.5)] ${
                providerTab === 'gemini'
                  ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={apiStatus === 'validating'}
            >
              {apiStatus === 'validating' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-slate-100" />
                  <span>HANDSHAKE IN PROGRESS...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-slate-200" />
                  <span>ESTABLISH SECURE LINK</span>
                </>
              )}
            </button>
          </form>

          {/* Footer details */}
          <div className="mt-6 text-center">
            {providerTab === 'gemini' ? (
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline transition"
              >
                Obtain a free Gemini API Key from Google AI Studio
              </a>
            ) : (
              <a
                href="https://console.groq.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-orange-400 hover:text-orange-300 hover:underline transition"
              >
                Obtain a free Groq API Key from Groq Console
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
