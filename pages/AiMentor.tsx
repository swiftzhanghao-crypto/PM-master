import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import { chatWithMentor } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AiMentor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '你好！我是你的 AI 产品导师。关于优先级框架（RICE, MoSCoW）、相关方管理或面试准备，尽管问我！',
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    const responseText = await chatWithMentor(history, userMsg.text);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] min-h-[600px] flex flex-col">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-semibold text-[#1d1d1f] flex items-center justify-center gap-3">
          AI 产品导师
        </h2>
        <p className="text-slate-500 font-light mt-2">
            你的全天候私人教练，由 Gemini 2.5 驱动
        </p>
      </div>

      <div className="flex-1 bg-white rounded-[2rem] shadow-apple border border-white/50 overflow-hidden flex flex-col backdrop-blur-sm">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-white/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-[#1d1d1f] text-white' : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={16} />}
                </div>
                <div 
                    className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                        msg.role === 'user' 
                        ? 'bg-[#0071e3] text-white rounded-br-sm' 
                        : 'bg-[#f5f5f7] text-[#1d1d1f] rounded-bl-sm'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start pl-11">
                <div className="bg-[#f5f5f7] px-4 py-3 rounded-2xl rounded-bl-sm">
                    <Loader2 className="animate-spin text-[#86868b]" size={18} />
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/80 backdrop-blur border-t border-slate-100">
          <div className="relative max-w-3xl mx-auto">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="输入你的问题..."
              className="w-full pl-6 pr-14 py-4 rounded-full bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3]/20 resize-none h-[60px] text-[15px] placeholder:text-slate-400 shadow-inner"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isTyping}
              className="absolute right-2 top-2 p-2.5 bg-[#0071e3] text-white rounded-full hover:bg-[#0077ed] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-3">
             AI 可能会犯错，请核对重要信息。
          </p>
        </div>
      </div>
    </div>
  );
};