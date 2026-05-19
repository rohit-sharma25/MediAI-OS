import React from 'react';
import { useApp } from '../../context/AppContext';

export default function TypingAnimation() {
  const { activeAgent } = useApp();

  const getThemeColor = () => {
    switch (activeAgent.avatarTheme) {
      case 'rose': return 'bg-rose-500 shadow-[0_0_10px_#f43f5e]';
      case 'cyan': return 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]';
      case 'emerald': return 'bg-emerald-500 shadow-[0_0_10px_#10b981]';
      case 'amber': return 'bg-amber-500 shadow-[0_0_10px_#f59e0b]';
      default: return 'bg-cyan-500';
    }
  };

  const getThemeTextColor = () => {
    switch (activeAgent.avatarTheme) {
      case 'rose': return 'text-rose-400';
      case 'cyan': return 'text-cyan-400';
      case 'emerald': return 'text-emerald-400';
      case 'amber': return 'text-amber-400';
      default: return 'text-cyan-400';
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 max-w-[200px] glass-card border border-slate-800 rounded-2xl ml-2 mb-6">
      {/* Micro-terminal text */}
      <span className={`text-[9px] font-mono tracking-widest uppercase ${getThemeTextColor()} animate-pulse`}>
        Analyzing diagnostics...
      </span>

      {/* Pulsating dots */}
      <div className="flex items-center gap-1.5 h-4">
        <span className={`w-2.5 h-2.5 rounded-full ${getThemeColor()} animate-bounce [animation-delay:-0.3s]`} />
        <span className={`w-2.5 h-2.5 rounded-full ${getThemeColor()} animate-bounce [animation-delay:-0.15s]`} />
        <span className={`w-2.5 h-2.5 rounded-full ${getThemeColor()} animate-bounce`} />
      </div>
    </div>
  );
}
