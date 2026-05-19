import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, ShieldAlert, Cpu } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MessageBubble({ message, theme }) {
  const { copyToClipboard } = useApp();
  const [copied, setCopied] = useState(false);

  const isUser = message.sender === 'user';
  const isError = message.isError;

  const handleCopy = () => {
    copyToClipboard(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine glow borders and colors depending on the agent theme
  const getAgentStyles = () => {
    if (isError) return 'bg-rose-950/20 border-rose-800/40 text-rose-200';
    
    switch (theme) {
      case 'rose':
        return 'bg-rose-950/5 border-rose-900/40 text-slate-200 shadow-[0_0_15px_rgba(244,63,94,0.05)]';
      case 'cyan':
        return 'bg-cyan-950/5 border-cyan-900/40 text-slate-200 shadow-[0_0_15px_rgba(6,182,212,0.05)]';
      case 'emerald':
        return 'bg-emerald-950/5 border-emerald-900/40 text-slate-200 shadow-[0_0_15px_rgba(16,185,129,0.05)]';
      case 'amber':
        return 'bg-amber-950/5 border-amber-900/40 text-slate-200 shadow-[0_0_15px_rgba(245,158,11,0.05)]';
      default:
        return 'bg-slate-900/40 border-slate-800 text-slate-200';
    }
  };

  const getAgentHeaderIconColor = () => {
    switch (theme) {
      case 'rose': return 'text-rose-400';
      case 'cyan': return 'text-cyan-400';
      case 'emerald': return 'text-emerald-400';
      case 'amber': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <motion.div
      className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`max-w-[80%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Meta Header (Timestamp & Node identifier) */}
        <div className="flex items-center gap-2 mb-1.5 px-2 text-[10px] tracking-wider font-rajdhani uppercase text-slate-400">
          {!isUser && (
            <div className="flex items-center gap-1">
              <Cpu className={`w-3.5 h-3.5 ${getAgentHeaderIconColor()} pulse-heart`} />
              <span className="font-bold text-slate-300">DIAGNOSTIC SYSTEM RESPONSE</span>
            </div>
          )}
          {isUser && <span className="font-bold text-slate-300">USER TERMINAL</span>}
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Message Card */}
        <div 
          className={`px-5 py-4 rounded-2xl border backdrop-blur-md relative group transition-all duration-300 ${
            isUser 
              ? 'bg-slate-900/60 border-slate-800 text-slate-100 shadow-[0_0_15px_rgba(255,255,255,0.02)]' 
              : getAgentStyles()
          }`}
        >
          {/* Custom Copy Message Overlay */}
          {!isStreamingTextPlaceholder() && (
            <button
              onClick={handleCopy}
              className="absolute right-3.5 top-3.5 p-1 rounded bg-slate-950/40 border border-slate-800 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-slate-200 hover:border-slate-700 transition cursor-pointer z-10"
              title="Copy details"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Markdown Content Parser */}
          <div className="prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed font-sans">
            {isError && (
              <div className="flex gap-2 items-start text-rose-400 font-semibold mb-2">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <span>Diagnostic Error Code</span>
              </div>
            )}
            
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-3 last:mb-0 text-sm leading-relaxed">{children}</p>,
                strong: ({ children }) => <strong className="text-slate-100 font-bold tracking-wide">{children}</strong>,
                code: ({ children }) => <code className="bg-slate-950/60 border border-slate-800/80 text-[12px] px-1.5 py-0.5 rounded font-mono text-cyan-200">{children}</code>,
                li: ({ children }) => <li className="mb-1 text-sm list-disc list-inside leading-relaxed">{children}</li>,
                ul: ({ children }) => <ul className="mb-3 last:mb-0 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="mb-3 last:mb-0 space-y-1 list-decimal pl-4">{children}</ol>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-slate-500 bg-slate-950/30 px-4 py-2 my-3 rounded text-xs text-slate-400 italic">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3 border border-slate-800 rounded-lg">
                    <table className="min-w-full divide-y divide-slate-800 text-xs text-left">{children}</table>
                  </div>
                ),
                th: ({ children }) => <th className="px-4 py-2 bg-slate-950 text-slate-300 font-bold uppercase tracking-wider">{children}</th>,
                td: ({ children }) => <td className="px-4 py-2 bg-slate-900/40 border-t border-slate-800 text-slate-300">{children}</td>,
                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 hover:underline">{children}</a>
              }}
            >
              {message.text}
            </ReactMarkdown>

            {/* Glowing stream-cursor when actively typing */}
            {message.isStreaming && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-cyan-400 animate-pulse align-middle" />
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );

  function isStreamingTextPlaceholder() {
    return message.isStreaming && !message.text;
  }
}
