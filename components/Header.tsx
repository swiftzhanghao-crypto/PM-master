
import React, { useState, useEffect } from 'react';
import { Menu, X, FileText, BarChart2, KanbanSquare, PenTool, GraduationCap, Mic2, LogIn, Target } from 'lucide-react';
import { SkillCategory, User } from '../types';

interface HeaderProps {
  activeSkill: SkillCategory;
  onNavigate: (skill: SkillCategory) => void;
  user: User | null;
  onLoginClick: () => void;
  onProfileClick: () => void;
}

// --- New Composite Logo Component ---
const CompositeLogo = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10 md:w-11 md:h-11 drop-shadow-md hover:scale-110 transition-transform duration-500 cursor-pointer flex-shrink-0">
    <defs>
        <linearGradient id="grad-l1" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="grad-l2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#e879f9', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#9333ea', stopOpacity: 1 }} />
        </linearGradient>
         <linearGradient id="grad-l3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#fb923c', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ea580c', stopOpacity: 1 }} />
        </linearGradient>
         <linearGradient id="grad-l4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#facc15', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#b45309', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="logo-glow">
           <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
           <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
           </feMerge>
        </filter>
    </defs>

    {/* L4: Circle (Orbit) - Strategic Ecology - Outer Ring */}
    <g className="origin-center animate-[spin_20s_linear_infinite]">
        <circle cx="32" cy="32" r="28" stroke="url(#grad-l4)" strokeWidth="1.5" fill="none" strokeDasharray="4 3" opacity="0.8" />
        <circle cx="32" cy="32" r="28" stroke="url(#grad-l4)" strokeWidth="0.5" fill="none" opacity="0.3" />
    </g>

    {/* L3: Hexagon - Connection & Loop - Middle Ring */}
    <g className="origin-center animate-[spin_15s_linear_infinite_reverse]">
       {/* Simplified Hexagon Path centered at 32,32 */}
       <path d="M32 10 L51 21 V43 L32 54 L13 43 V21 Z" stroke="url(#grad-l3)" strokeWidth="1.5" fill="none" opacity="0.9" />
    </g>

    {/* L2: Square (Diamond) - Structural Thinking - Inner Ring */}
    <g className="origin-center animate-[pulse_3s_ease-in-out_infinite]">
       {/* Rotated Square */}
       <rect x="23" y="23" width="18" height="18" rx="2" stroke="url(#grad-l2)" strokeWidth="2" fill="none" transform="rotate(45 32 32)" />
    </g>

    {/* L1: Triangle - Execution Foundation - Core */}
    <g filter="url(#logo-glow)">
       {/* Triangle centered visually */}
       <path d="M32 24 L40 38 H24 Z" fill="url(#grad-l1)" />
    </g>
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ activeSkill, onNavigate, user, onLoginClick, onProfileClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: SkillCategory.COURSES, label: '课程', icon: GraduationCap },
    { id: SkillCategory.REQUIREMENTS, label: '需求', icon: FileText },
    { id: SkillCategory.DATA_ANALYSIS, label: '数据', icon: BarChart2 },
    { id: SkillCategory.PROJECT_MANAGEMENT, label: '项目', icon: KanbanSquare },
    { id: SkillCategory.PROTOTYPING, label: '原型', icon: PenTool },
    { id: SkillCategory.INTERVIEW, label: '面试', icon: Mic2 },
    { id: SkillCategory.EXAM, label: '能力测评', icon: Target },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || isOpen 
            ? 'bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-sm supports-[backdrop-filter]:bg-white/60' 
            : 'bg-white/70 backdrop-blur-md border-b border-transparent supports-[backdrop-filter]:bg-white/50'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          
          {/* Left Side: Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
                onNavigate(SkillCategory.DASHBOARD);
                setIsOpen(false);
            }}
          >
             <CompositeLogo />
             <div className="flex flex-col">
                <span className="text-[#1d1d1f] font-bold tracking-tight text-lg leading-none group-hover:text-[#0071e3] transition-colors">PM Master Class</span>
                <span className="text-[10px] text-slate-500 tracking-widest uppercase mt-0.5 scale-90 origin-left font-medium">Product Energy Core</span>
             </div>
          </div>

          {/* Desktop Nav - Centered */}
          <div className="hidden lg:flex items-center space-x-4 text-[13px] font-medium tracking-wide absolute left-1/2 transform -translate-x-1/2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`transition-all duration-300 px-4 py-1.5 rounded-full flex items-center gap-1.5 ${
                  activeSkill === item.id 
                    ? 'text-[#1d1d1f] bg-black/5 font-semibold' 
                    : 'text-slate-500 hover:text-[#1d1d1f] hover:bg-black/5'
                }`}
              >
                <item.icon size={14} className={activeSkill === item.id ? 'text-[#0071e3]' : 'opacity-70'} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Side: User & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
             {user ? (
               <div 
                 onClick={onProfileClick}
                 className="flex items-center gap-3 cursor-pointer pl-3 pr-1 py-1 rounded-full hover:bg-black/5 transition-colors border border-transparent"
                 title="个人中心"
               >
                 <div className="text-right hidden md:block leading-tight">
                    <p className="text-[#1d1d1f] text-xs font-bold">{user.name}</p>
                    <p className="text-[10px] text-[#0071e3]">{user.level}</p>
                 </div>
                 <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 text-sm flex items-center justify-center font-bold text-white shadow-md ring-2 ring-white">
                    {user.avatar}
                 </div>
               </div>
             ) : (
               <button 
                 onClick={onLoginClick}
                 className="text-xs font-bold text-white bg-[#1d1d1f] px-5 py-2 rounded-full hover:bg-black hover:scale-105 transition-all flex items-center gap-1.5 shadow-lg"
               >
                 <LogIn size={14} /> 登录
               </button>
             )}

             {/* Mobile Menu Button */}
             <div className="lg:hidden flex items-center ml-2">
                <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-[#1d1d1f] p-2 rounded-lg hover:bg-black/5 transition-colors"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
             </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'max-h-screen opacity-100 bg-white/95 backdrop-blur-xl' : 'max-h-0 opacity-0'}`}>
           <div className="px-8 py-8 flex flex-col space-y-2">
              {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                        onNavigate(item.id);
                        setIsOpen(false);
                    }}
                    className={`text-left text-lg font-medium border-b border-slate-100 py-4 flex items-center gap-4 ${
                        activeSkill === item.id ? 'text-[#0071e3] font-bold' : 'text-slate-600'
                    }`}
                  >
                    <item.icon size={20} className={activeSkill === item.id ? 'text-[#0071e3]' : 'text-slate-400'} />
                    {item.label}
                  </button>
              ))}
              {!user && (
                <button 
                  onClick={() => {
                    onLoginClick();
                    setIsOpen(false);
                  }}
                  className="text-left text-lg font-bold text-[#1d1d1f] py-6 flex items-center gap-3 border-b border-slate-100"
                >
                  <LogIn size={24} /> 立即登录
                </button>
              )}
           </div>
        </div>
      </nav>
      {/* Spacer to prevent content hiding behind fixed header */}
      <div className="h-16 w-full bg-transparent"></div>
    </>
  );
};
