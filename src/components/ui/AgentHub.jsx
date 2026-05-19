import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  MapPin, 
  Shield, 
  AlertTriangle, 
  Cpu, 
  ChevronRight,
  Database
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { agents } from '../../data/agents';

const IconMap = {
  Activity: Activity,
  MapPin: MapPin,
  Shield: Shield,
  AlertTriangle: AlertTriangle
};

export default function AgentHub() {
  const { setActiveAgent } = useApp();

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  return (
    <div className="flex-1 w-full overflow-y-auto px-6 py-10 md:px-12 md:py-16 text-slate-100 bg-black flex flex-col justify-start items-center">
      {/* Welcome Banner */}
      <motion.div 
        className="max-w-4xl w-full text-center mb-12 md:mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 mb-4 justify-center items-center">
          <Cpu className="w-8 h-8 text-emerald-400 pulse-heart" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wider font-orbitron uppercase bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-3">
          MediAI Specialist Portal
        </h1>
        <p className="text-slate-400 text-sm md:text-base font-rajdhani tracking-widest uppercase max-w-xl mx-auto">
          Access specialized diagnostic intelligence units powered by client-side RAG systems
        </p>
      </motion.div>

      {/* Grid of Agent Cards */}
      <motion.div 
        className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {agents.map((agent) => {
          const AgentIcon = IconMap[agent.icon] || Shield;
          
          // Color themes for card glows & highlights
          const themeColor = 
            agent.avatarTheme === 'rose' ? 'text-rose-400' :
            agent.avatarTheme === 'cyan' ? 'text-cyan-400' :
            agent.avatarTheme === 'emerald' ? 'text-emerald-400' :
            'text-amber-400';

          const bgHoverGlow = 
            agent.avatarTheme === 'rose' ? 'hover:border-rose-500/40 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]' :
            agent.avatarTheme === 'cyan' ? 'hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]' :
            agent.avatarTheme === 'emerald' ? 'hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]' :
            'hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]';

          const iconBg = 
            agent.avatarTheme === 'rose' ? 'bg-rose-500/10 border-rose-500/20' :
            agent.avatarTheme === 'cyan' ? 'bg-cyan-500/10 border-cyan-500/20' :
            agent.avatarTheme === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20' :
            'bg-amber-500/10 border-amber-500/20';

          return (
            <motion.div
              key={agent.id}
              variants={itemVariants}
              onClick={() => setActiveAgent(agent)}
              className={`glass-card p-6 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 border border-slate-800/80 bg-slate-950/40 ${bgHoverGlow}`}
              whileHover={{ y: -6 }}
            >
              <div>
                {/* Header & Icon */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`p-3 rounded-xl border ${iconBg}`}>
                    <AgentIcon className={`w-6 h-6 ${themeColor}`} />
                  </div>
                  <span className="text-[9px] font-mono bg-slate-950 border border-slate-800 text-slate-500 px-2 py-0.5 rounded tracking-widest">
                    ACTIVE
                  </span>
                </div>

                {/* Agent Identity */}
                <h3 className="text-lg font-bold font-orbitron uppercase text-slate-100 mb-1 tracking-wide">
                  {agent.name}
                </h3>
                <p className={`text-xs font-semibold uppercase tracking-wider font-rajdhani mb-4 ${themeColor}`}>
                  {agent.role}
                </p>

                {/* Description */}
                <p className="text-slate-400 text-xs leading-relaxed mb-6 font-sans">
                  {agent.description}
                </p>
              </div>

              {/* Card Footer Info */}
              <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-slate-500 font-rajdhani">
                  <Database className="w-3.5 h-3.5" />
                  <span className="uppercase tracking-wider">RAG: {agent.knowledgeBaseFile}.md</span>
                </div>
                <div className={`flex items-center gap-0.5 font-semibold ${themeColor} uppercase tracking-wider font-rajdhani`}>
                  <span>Access</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Critical Hub Notice */}
      <motion.p 
        className="mt-16 text-[10px] text-slate-600 tracking-wider text-center max-w-md font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        MediAI diagnostic engines evaluate informational parameters only. Please confirm critical decisions with primary care physicians or institutional health resources.
      </motion.p>
    </div>
  );
}
