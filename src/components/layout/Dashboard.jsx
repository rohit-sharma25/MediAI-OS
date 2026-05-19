import React from 'react';
import { Menu, Key, ShieldAlert, Cpu } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Sidebar from './Sidebar';
import ChatWindow from '../chat/ChatWindow';
import AgentHub from '../ui/AgentHub';
import FloatingBackground from '../ui/FloatingBackground';
import ApiKeyModal from '../ui/ApiKeyModal';

export default function Dashboard() {
  const { 
    isSidebarOpen, 
    setIsSidebarOpen, 
    apiStatus, 
    setIsApiKeyModalOpen,
    activeAgent,
    apiProvider,
    activeModel,
    setActiveModel
  } = useApp();

  const GEMINI_MODELS = [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' }
  ];

  const GROQ_MODELS = [
    { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B' },
    { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B' }
  ];

  const modelsList = apiProvider === 'gemini' ? GEMINI_MODELS : GROQ_MODELS;

  const getThemeTextClass = () => {
    if (!activeAgent) return 'text-slate-400';
    switch (activeAgent.avatarTheme) {
      case 'rose': return 'text-rose-400';
      case 'cyan': return 'text-cyan-400';
      case 'emerald': return 'text-emerald-400';
      case 'amber': return 'text-amber-400';
      default: return 'text-cyan-400';
    }
  };

  return (
    <div className="relative w-screen h-screen flex overflow-hidden font-sans select-none bg-black">
      
      {/* 1. Futuristic animated grid background */}
      <FloatingBackground />
 
      {/* 2. Left side retractable glass sidebar */}
      <Sidebar />
 
      {/* 3. Main Central Command panel */}
      <div className="flex-1 h-full flex flex-col overflow-hidden relative z-10">
        
        {/* Top Navigation / Mobile responsive header */}
        <header className="px-6 py-4 glass-panel border-b border-slate-800/50 flex items-center justify-between z-20">
          
          {/* Mobile Menu & Title */}
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-slate-400 hover:text-slate-200 transition cursor-pointer"
                title="Expand side options"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            
            {/* Desktop status info */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                <Cpu className="w-4 h-4 text-emerald-400 pulse-heart" />
              </div>
              <span className="font-bold text-xs uppercase tracking-widest font-orbitron text-slate-300">
                MediAI OS
              </span>
              <span className="hidden md:inline-block text-[9px] bg-slate-950/60 border border-slate-800 text-slate-500 px-1.5 py-0.5 rounded tracking-widest font-mono">
                SECURE CONSOLE
              </span>
            </div>
          </div>
 
          {/* Active Agent Subtitle Display */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="text-slate-500 uppercase font-rajdhani font-semibold tracking-wider">Active Channel:</span>
            <span className={`font-bold font-orbitron uppercase tracking-wide px-2 py-0.5 bg-slate-950/60 border border-slate-800 rounded ${getThemeTextClass()}`}>
              {activeAgent ? activeAgent.name : 'ALL INTEL UNITS'}
            </span>
          </div>
 
          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Active Provider Engine Badge */}
            {apiStatus === 'valid' && (
              <button
                onClick={() => setIsApiKeyModalOpen(true)}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold font-orbitron tracking-wider cursor-pointer uppercase transition-all duration-300 ${
                  apiProvider === 'gemini'
                    ? 'bg-cyan-950/20 border-cyan-800/30 text-cyan-300 hover:border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                    : 'bg-orange-950/20 border-orange-800/30 text-orange-300 hover:border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.1)]'
                }`}
                title="Switch secure intelligence engine"
              >
                <span className={`w-2 h-2 rounded-full ${apiProvider === 'gemini' ? 'bg-cyan-400' : 'bg-orange-400'} animate-pulse`} />
                {apiProvider}
              </button>
            )}

            {/* Model Selector Dropdown */}
            {apiStatus === 'valid' && (
              <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800/80 rounded-xl px-2.5 py-1.5">
                <Cpu className={`w-3.5 h-3.5 shrink-0 ${apiProvider === 'gemini' ? 'text-cyan-400' : 'text-orange-400'}`} />
                <select
                  value={activeModel}
                  onChange={(e) => setActiveModel(e.target.value)}
                  className="bg-transparent text-slate-200 text-xs font-semibold uppercase tracking-wider font-rajdhani focus:outline-none cursor-pointer pr-1"
                >
                  {modelsList.map((model) => (
                    <option 
                      key={model.value} 
                      value={model.value}
                      className="bg-[#030712] text-slate-300 font-sans normal-case"
                    >
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Status indicator button */}
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold uppercase tracking-wider font-rajdhani flex items-center gap-1.5 transition cursor-pointer ${
                apiStatus === 'valid'
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-400 hover:border-emerald-600'
                  : 'bg-rose-950/20 border-rose-800/40 text-rose-400 hover:border-rose-600'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {apiStatus === 'valid' ? 'Settings' : 'Configure API'}
              </span>
            </button>
          </div>
        </header>

        {/* Dynamic chat interface panel or Selector Hub */}
        <div className="flex-1 flex overflow-hidden relative">
          {activeAgent ? <ChatWindow /> : <AgentHub />}
        </div>
      </div>

      {/* 4. Credentials Configuration Modal overlay */}
      <ApiKeyModal />

    </div>
  );
}
