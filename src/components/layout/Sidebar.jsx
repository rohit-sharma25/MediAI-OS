import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  MapPin, 
  Shield, 
  AlertTriangle, 
  Key, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  UserMinus,
  AlertCircle,
  Cpu,
  LayoutGrid
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { agents } from '../../data/agents';

const IconMap = {
  Activity: Activity,
  MapPin: MapPin,
  Shield: Shield,
  AlertTriangle: AlertTriangle
};

export default function Sidebar() {
  const { 
    activeAgent, 
    setActiveAgent, 
    clearChat, 
    removeApiKey, 
    apiStatus, 
    setIsApiKeyModalOpen,
    isSidebarOpen,
    setIsSidebarOpen
  } = useApp();

  return (
    <AnimatePresence initial={false}>
      {isSidebarOpen ? (
        <motion.div
          className="h-screen w-80 shrink-0 z-30 glass-panel border-r border-slate-800/80 flex flex-col relative text-slate-200"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 140 }}
        >
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute -right-3.5 top-8 p-1.5 rounded-full border border-slate-700/80 bg-slate-900 text-slate-400 hover:text-slate-200 z-40 transition cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Logo Brand Panel (Interactive Home link) */}
          <div 
            onClick={() => setActiveAgent(null)}
            className="p-5 border-b border-slate-800/60 flex items-center gap-3 cursor-pointer hover:bg-slate-900/20 transition-all duration-300"
            title="Return to Agent Selection Hub"
          >
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-wide text-slate-200">
                MediAI
              </h1>
              <p className="text-[10px] text-slate-500 font-rajdhani tracking-wider uppercase">
                Diagnostic System
              </p>
            </div>
          </div>

          {/* Active Agents List */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            <h3 className="px-2 text-xs font-medium tracking-wider text-slate-500 font-rajdhani mb-3">
              Agents
            </h3>

            {/* Selection Hub Switcher */}
            <button
              onClick={() => setActiveAgent(null)}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-start gap-3 cursor-pointer ${
                !activeAgent 
                  ? 'bg-slate-900/60 border-slate-700 text-slate-200' 
                  : 'bg-slate-900/30 border-slate-800/40 hover:bg-slate-900/60 hover:border-slate-700/50 text-slate-400'
              }`}
            >
              <div className={`p-1.5 rounded-md ${!activeAgent ? 'bg-slate-800/60' : 'bg-slate-800/30'} shrink-0`}>
                <LayoutGrid className={`w-4 h-4 ${!activeAgent ? 'text-slate-200' : 'text-slate-500'}`} />
              </div>
              <div>
                <h4 className="font-medium text-xs uppercase tracking-wide text-slate-200">
                  All Agents
                </h4>
                <p className="text-[10px] text-slate-500 font-rajdhani tracking-wider">
                  View all
                </p>
              </div>
            </button>
            
            {agents.map((agent) => {
              const AgentIcon = IconMap[agent.icon] || Shield;
              const isActive = activeAgent && activeAgent.id === agent.id;
              
              // Color themes for agent cards
              const activeClasses = 
                agent.avatarTheme === 'rose' ? 'bg-rose-950/15 border-rose-500/40 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.15)]' :
                agent.avatarTheme === 'cyan' ? 'bg-cyan-950/15 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]' :
                agent.avatarTheme === 'emerald' ? 'bg-emerald-950/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)]' :
                'bg-amber-950/15 border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]';

              const iconThemeColor = 
                agent.avatarTheme === 'rose' ? 'text-rose-400' :
                agent.avatarTheme === 'cyan' ? 'text-cyan-400' :
                agent.avatarTheme === 'emerald' ? 'text-emerald-400' :
                'text-amber-400';

              return (
                <button
                  key={agent.id}
                  onClick={() => setActiveAgent(agent)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex items-start gap-3 cursor-pointer ${
                    isActive 
                      ? activeClasses 
                      : 'bg-slate-900/30 border-slate-800/40 hover:bg-slate-900/60 hover:border-slate-700/50 text-slate-400'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-slate-900/60' : 'bg-slate-900/30'} shrink-0`}>
                    <AgentIcon className={`w-5 h-5 ${iconThemeColor}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-xs uppercase tracking-wide text-slate-200">
                      {agent.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-rajdhani tracking-wider uppercase">
                      {agent.role}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Security / API Control Panel */}
          <div className="p-3 border-t border-slate-800/50 space-y-2 bg-slate-950/10">
            {/* API Status */}
            <div className="flex items-center justify-between p-2 rounded-md bg-slate-900/40 border border-slate-800/40 text-xs">
              <span className="text-slate-500 font-rajdhani tracking-wider">API:</span>
              <div className="flex items-center gap-1.5">
                {apiStatus === 'valid' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-emerald-400 font-medium text-[10px]">Connected</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-rose-400 font-medium text-[10px]">Offline</span>
                  </>
                )}
              </div>
            </div>

            {/* Clear Chats & Key Management */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => activeAgent && clearChat(activeAgent.id)}
                disabled={!activeAgent}
                className={`py-2 px-2.5 border rounded-md transition duration-200 flex items-center justify-center gap-1.5 font-rajdhani font-medium ${
                  activeAgent 
                    ? 'bg-slate-900/40 hover:bg-rose-950/20 border-slate-800 hover:border-rose-900/50 text-slate-400 hover:text-rose-300 cursor-pointer' 
                    : 'bg-slate-950/40 border-slate-900/40 text-slate-600 cursor-not-allowed opacity-50'
                }`}
                title="Clear current agent chat history"
              >
                <Trash2 className="w-3 h-3 text-rose-500" />
                <span>Clear</span>
              </button>

              {apiStatus === 'valid' ? (
                <button
                  onClick={removeApiKey}
                  className="py-2 px-2.5 bg-slate-900/40 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-900/50 text-slate-400 hover:text-rose-300 rounded-md transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer font-rajdhani font-medium"
                  title="Remove API Key"
                >
                  <UserMinus className="w-3 h-3 text-rose-500" />
                  <span>Remove</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className="py-2 px-2.5 bg-emerald-950/20 border border-emerald-800/30 hover:border-emerald-600 text-emerald-400 hover:text-emerald-300 rounded-md transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer font-rajdhani font-medium"
                >
                  <Key className="w-3 h-3 text-emerald-400" />
                  <span>Setup</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
