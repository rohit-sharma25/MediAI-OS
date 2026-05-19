import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, AlertCircle, Info, HeartHandshake } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import MessageBubble from './MessageBubble';
import TypingAnimation from '../ui/TypingAnimation';

export default function ChatWindow() {
  const { 
    activeAgent, 
    chats, 
    sendMessage, 
    isAiLoading, 
    apiStatus, 
    setIsApiKeyModalOpen 
  } = useApp();
  
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);
  const activeChat = chats[activeAgent.id] || [];

  // Scroll to bottom whenever messages or loading state changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat, isAiLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isAiLoading) return;
    
    // Check if API key is valid first
    if (apiStatus !== 'valid') {
      setIsApiKeyModalOpen(true);
      return;
    }

    const textToSend = inputText;
    setInputText('');
    await sendMessage(textToSend);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const handlePromptClick = async (prompt) => {
    if (isAiLoading) return;
    if (apiStatus !== 'valid') {
      setIsApiKeyModalOpen(true);
      return;
    }
    await sendMessage(prompt);
  };

  const getThemeTextClass = () => {
    switch (activeAgent.avatarTheme) {
      case 'rose': return 'text-rose-400';
      case 'cyan': return 'text-cyan-400';
      case 'emerald': return 'text-emerald-400';
      case 'amber': return 'text-amber-400';
      default: return 'text-cyan-400';
    }
  };

  const getThemeBorderClass = () => {
    switch (activeAgent.avatarTheme) {
      case 'rose': return 'focus:border-rose-500 focus:ring-rose-500/20';
      case 'cyan': return 'focus:border-cyan-500 focus:ring-cyan-500/20';
      case 'emerald': return 'focus:border-emerald-500 focus:ring-emerald-500/20';
      case 'amber': return 'focus:border-amber-500 focus:ring-amber-500/20';
      default: return 'focus:border-cyan-500 focus:ring-cyan-500/20';
    }
  };

  const getThemeGlowButton = () => {
    switch (activeAgent.avatarTheme) {
      case 'rose': return 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_20px_rgba(244,63,94,0.5)]';
      case 'cyan': return 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]';
      case 'emerald': return 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]';
      case 'amber': return 'bg-amber-600 hover:bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]';
      default: return 'bg-cyan-600 hover:bg-cyan-500';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-slate-100 relative">
      
      {/* 1. Header showing active agent */}
      <div className="px-8 py-5 border-b border-slate-800/60 bg-slate-950/20 flex items-center justify-between z-10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-orbitron uppercase tracking-wider text-slate-100">
              {activeAgent.name}
            </h2>
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${
              apiStatus === 'valid' ? 'bg-emerald-500' : 'bg-rose-500'
            } animate-pulse`} />
          </div>
          <p className="text-xs text-slate-400 font-rajdhani tracking-wider uppercase">
            {activeAgent.role}
          </p>
        </div>
      </div>

      {/* 2. Messages Viewport */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        
        {activeChat.length === 0 ? (
          /* Empty Chat state: Sleek, minimal and simplified greeting */
          <motion.div 
            className="h-full flex flex-col items-center justify-center max-w-xl mx-auto text-center px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-xl font-bold uppercase tracking-wider font-orbitron text-slate-200 mb-2">
              {activeAgent.name}
            </h3>
            
            <p className="text-slate-400 text-xs tracking-widest uppercase mb-8 font-rajdhani">
              {activeAgent.role}
            </p>

            {/* Suggested prompts list */}
            <div className="w-full space-y-2">
              <div className="grid grid-cols-1 gap-2">
                {activeAgent.suggestedPrompts.slice(0, 3).map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(prompt)}
                    className="p-3.5 text-center text-xs bg-slate-950/40 hover:bg-slate-900/60 border border-slate-800/65 hover:border-slate-700/60 rounded-xl text-slate-300 hover:text-slate-100 transition duration-300 cursor-pointer"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            {/* Subtle disclaimers */}
            <p className="mt-8 text-[9px] text-slate-650 leading-relaxed max-w-md mx-auto italic opacity-75">
              *Disclaimer: Informational resources only. In case of emergency, call 112 or 108 immediately.
            </p>
          </motion.div>
        ) : (
          /* Render conversation history */
          <div className="space-y-4 max-w-4xl mx-auto">
            {activeChat.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                theme={activeAgent.avatarTheme} 
              />
            ))}
            
            {/* Show typing loader if AI is loading */}
            {isAiLoading && <TypingAnimation />}
            
            <div ref={chatEndRef} />
          </div>
        )}

      </div>

      {/* 3. Input Text Bar Form */}
      <div className="p-6 border-t border-slate-800/60 bg-slate-950/20 z-10">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto">
          {apiStatus !== 'valid' && (
            <div className="mb-3.5 p-3 rounded-xl bg-rose-950/20 border border-rose-800/40 flex items-center justify-between text-xs text-rose-400">
              <div className="flex gap-2 items-center">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>API Connection is inactive. Authenticate to enable diagnostics.</span>
              </div>
              <button
                type="button"
                onClick={() => setIsApiKeyModalOpen(true)}
                className="px-3 py-1.5 bg-rose-900/30 hover:bg-rose-900/50 border border-rose-700/50 rounded-lg font-semibold uppercase tracking-wider font-rajdhani transition cursor-pointer"
              >
                Connect Key
              </button>
            </div>
          )}

          <div className="relative flex items-end">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`Query ${activeAgent.name}... (Press Enter to Send)`}
              rows="1"
              disabled={isAiLoading}
              className={`w-full bg-slate-950/70 border border-slate-800 rounded-2xl py-4 pl-5 pr-16 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition duration-300 resize-none font-sans min-h-[56px] max-h-[160px] ${getThemeBorderClass()}`}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isAiLoading}
              className={`absolute right-3.5 bottom-3.5 p-2 rounded-xl text-slate-100 cursor-pointer transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${getThemeGlowButton()}`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
