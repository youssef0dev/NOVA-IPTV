
import React, { useState, useRef, useEffect } from 'react';
import { Message, Channel } from '../types';
import { processAgentCommand } from '../services/geminiService';

interface AIAgentProps {
  isOpen: boolean;
  onClose: () => void;
  channels: Channel[];
  onExecuteCommand: (command: any) => void;
}

const AIAgent: React.FC<AIAgentProps> = ({ isOpen, onClose, channels, onExecuteCommand }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Nova AI Agent Active. How can I manage your broadcast feed today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent, customInput?: string) => {
    if (e) e.preventDefault();
    const textToSend = customInput || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await processAgentCommand(textToSend, channels, messages);
      setIsTyping(false);
      
      if (result.command && result.command.type !== 'NONE') {
        onExecuteCommand(result.command);
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: result.response }]);
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: "Failed to connect to Nova Core. Check your uplink." }]);
    }
  };

  return (
    <div 
      className={`fixed top-0 right-0 h-full w-[380px] bg-black/95 backdrop-blur-3xl border-l border-white/10 z-[300] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-glow"></div>
          <h2 className="text-xl font-black uppercase tracking-tighter italic text-white/80">Nova Agent</h2>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center transition-all group">
          <span className="material-symbols-outlined text-xl text-gray-500 group-hover:text-white group-hover:rotate-90 transition-all">close</span>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth no-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[90%] p-5 rounded-3xl text-sm font-medium leading-relaxed ${
              msg.role === 'user' 
              ? 'bg-primary text-black rounded-tr-none font-bold shadow-glow' 
              : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl rounded-tl-none flex flex-col gap-3 min-w-[120px]">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
              </div>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Analyzing Playlist</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Access */}
      <div className="px-8 py-4 flex gap-2 overflow-x-auto no-scrollbar border-t border-white/5 bg-black/40">
        <button onClick={() => handleSend(undefined, "Categorize my feed")} className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-black text-gray-500 hover:text-primary hover:border-primary/40 transition-all whitespace-nowrap uppercase tracking-widest">Auto Categorize</button>
        <button onClick={() => handleSend(undefined, "Find sports channels")} className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-black text-gray-500 hover:text-primary hover:border-primary/40 transition-all whitespace-nowrap uppercase tracking-widest">Sports</button>
        <button onClick={() => handleSend(undefined, "Find movies")} className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-black text-gray-500 hover:text-primary hover:border-primary/40 transition-all whitespace-nowrap uppercase tracking-widest">Movies</button>
      </div>

      <form onSubmit={handleSend} className="p-8 border-t border-white/10 bg-black">
        <div className="relative flex items-center bg-white/5 rounded-3xl px-6 py-4 border border-white/5 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/5 transition-all">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search or command Nova..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-700 font-bold tracking-tight text-base"
          />
          <button type="submit" disabled={isTyping} className="w-11 h-11 rounded-full bg-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-glow disabled:opacity-50">
            <span className="material-symbols-outlined text-2xl font-black">send</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIAgent;
