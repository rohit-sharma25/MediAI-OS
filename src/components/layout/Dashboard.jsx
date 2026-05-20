import React from 'react';
import { Menu, Key, Cpu } from 'lucide-react';
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
    activeAgent
  } = useApp();

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
        <header className="px-5 py-3 border-b border-slate-800/40 bg-slate-950/20 flex items-center justify-between z-20">
          
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
                <Cpu className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-bold text-xs uppercase tracking-widest font-orbitron text-slate-300">
                MediAI OS
              </span>
            </div>
          </div>
 
          
 
          {/* Right Controls */}
          <div className="flex items-center gap-3">
            

            

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
