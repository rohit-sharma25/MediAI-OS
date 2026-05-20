import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  MapPin, 
  Shield, 
  AlertTriangle, 
  Cpu, 
  Clock,
  ShieldCheck,
  Brain
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { agents } from '../../data/agents';

const IconMap = {
  Activity: Activity,
  MapPin: MapPin,
  Shield: Shield,
  AlertTriangle: AlertTriangle
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const features = [
  {
    icon: Clock,
    title: '24/7 Available',
    description: 'Access medical assistance anytime'
  },
  {
    icon: Brain,
    title: 'RAG-Powered',
    description: 'Intelligent responses from medical knowledge'
  },
  {
    icon: ShieldCheck,
    title: 'Privacy-Focused',
    description: 'Your data stays on your device'
  }
];

const footerLinks = [
  { label: 'About', href: '#' },
  { label: 'Help', href: '#' },
  { label: 'Privacy', href: '#' }
];

export default function AgentHub() {
  const { setActiveAgent } = useApp();

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
    <div className="flex-1 w-full overflow-y-auto px-6 py-10 md:px-12 md:py-16 text-slate-100 bg-gradient-to-b from-black via-slate-950/30 to-black flex flex-col justify-start items-center">
      {/* Welcome Banner with Time-based Greeting */}
      <motion.div 
        className="max-w-4xl w-full text-center mb-10 md:mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-slate-500 text-xs font-medium tracking-wider mb-2">
          {getGreeting()}
        </p>
        <div className="inline-flex p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 mb-4 justify-center items-center">
          <Cpu className="w-6 h-6 text-emerald-400" />
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-wider text-slate-200 mb-2">
          Welcome to MediAI
        </h1>
        <p className="text-slate-500 text-sm font-rajdhani tracking-wider max-w-xl mx-auto">
          Select an agent to get started
        </p>
      </motion.div>

      {/* Feature Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full mb-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {features.map((feature, idx) => (
          <div 
            key={idx}
            className="flex items-center gap-3 p-3 rounded-lg border border-slate-800/60 bg-slate-900/30"
          >
            <div className="p-2 rounded-md bg-slate-800/50">
              <feature.icon className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-300">{feature.title}</p>
              <p className="text-[10px] text-slate-500">{feature.description}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Grid of Agent Cards with Accent Border */}
      <motion.div 
        className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 max-w-7xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {agents.map((agent) => {
          const AgentIcon = IconMap[agent.icon] || Shield;
          
          const themeColor = 
            agent.avatarTheme === 'rose' ? 'text-rose-400' :
            agent.avatarTheme === 'cyan' ? 'text-cyan-400' :
            agent.avatarTheme === 'emerald' ? 'text-emerald-400' :
            'text-amber-400';

          const accentBorder = 
            agent.avatarTheme === 'rose' ? 'border-l-rose-500' :
            agent.avatarTheme === 'cyan' ? 'border-l-cyan-500' :
            agent.avatarTheme === 'emerald' ? 'border-l-emerald-500' :
            'border-l-amber-500';

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
              className={`p-5 rounded-xl flex flex-col justify-between cursor-pointer transition-all duration-200 border border-slate-800/60 border-l-2 ${accentBorder} bg-slate-900/40 hover:bg-slate-800/40`}
              whileHover={{ y: -2 }}
            >
              <div>
                {/* Header & Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-lg border ${iconBg}`}>
                    <AgentIcon className={`w-5 h-5 ${themeColor}`} />
                  </div>
                </div>

                {/* Agent Identity */}
                <h3 className="text-base font-semibold text-slate-100 mb-1 tracking-wide">
                  {agent.name}
                </h3>
                <p className={`text-xs font-medium uppercase tracking-wider font-rajdhani mb-3 ${themeColor}`}>
                  {agent.role}
                </p>

                {/* Description */}
                <p className="text-slate-400 text-xs leading-relaxed mb-2 font-sans">
                  {agent.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Footer Links */}
      <motion.div 
        className="mt-12 flex items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {footerLinks.map((link, idx) => (
          <a 
            key={idx}
            href={link.href}
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors duration-200"
          >
            {link.label}
          </a>
        ))}
      </motion.div>

      </div>
  );
}