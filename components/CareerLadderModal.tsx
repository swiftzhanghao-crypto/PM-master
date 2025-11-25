
import React from 'react';
import { X, Briefcase, Star, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

interface CareerLadderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: string; // 'Lvl 1', 'Lvl 2', 'Lvl 3'
}

const LEVELS = [
  {
    id: 'lvl1',
    name: 'Lvl 1: 产品助理 (APM)',
    salary: '8k - 15k',
    reqs: ['掌握 PRD 撰写', '熟练使用 Axure/Figma', '具备基本沟通能力'],
    status: 'completed'
  },
  {
    id: 'lvl2',
    name: 'Lvl 2: 产品经理 (PM)',
    salary: '15k - 25k',
    reqs: ['独立负责功能模块', '数据分析驱动迭代', '跨部门项目推进'],
    status: 'completed'
  },
  {
    id: 'lvl3',
    name: 'Lvl 3: 高级产品经理 (Senior PM)',
    salary: '25k - 40k',
    reqs: ['负责完整产品线', '商业模式设计', '指导新人 (Mentor)'],
    status: 'current'
  },
  {
    id: 'lvl4',
    name: 'Lvl 4: 产品总监 (Director)',
    salary: '50k - 100k+',
    reqs: ['制定产品战略', '团队管理与招聘', '对 P&L (损益) 负责'],
    status: 'locked'
  }
];

export const CareerLadderModal: React.FC<CareerLadderModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#1d1d1f]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl bg-black rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 animate-fade-in-up flex flex-col md:flex-row h-[80vh] md:h-[600px]">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-20"
        >
          <X size={24} />
        </button>

        {/* Left Panel: Intro */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-10 text-white md:w-1/3 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
               <Star size={32} fill="currentColor" className="text-yellow-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2">职业晋升路线图</h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              清晰规划你的每一步成长。<br/>从执行者到决策者的蜕变。
            </p>
          </div>
          <div className="relative z-10">
            <div className="text-sm font-mono opacity-60 mb-1">CURRENT STATUS</div>
            <div className="text-2xl font-bold">Level 3</div>
            <div className="h-1 w-full bg-white/20 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-yellow-400 w-3/4"></div>
            </div>
            <div className="text-xs mt-2 text-blue-200">距离 Lvl 4 还需要掌握战略规划技能</div>
          </div>
        </div>

        {/* Right Panel: Timeline */}
        <div className="flex-1 bg-[#0d0d0d] p-10 overflow-y-auto custom-scrollbar">
           <div className="space-y-0 relative">
             {/* Vertical Line */}
             <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-white/10"></div>

             {LEVELS.map((lvl, idx) => (
               <div key={lvl.id} className="relative pl-12 pb-12 last:pb-0 group">
                 {/* Dot */}
                 <div className={`absolute left-0 w-8 h-8 rounded-full border-4 flex items-center justify-center z-10 bg-[#0d0d0d] transition-all
                    ${lvl.status === 'completed' ? 'border-green-500 text-green-500' : 
                      lvl.status === 'current' ? 'border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 
                      'border-slate-700 text-slate-700'}
                 `}>
                    {lvl.status === 'completed' && <CheckCircle2 size={16} />}
                    {lvl.status === 'current' && <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>}
                    {lvl.status === 'locked' && <Lock size={14} />}
                 </div>

                 {/* Card */}
                 <div className={`p-6 rounded-2xl border transition-all duration-300
                    ${lvl.status === 'current' 
                      ? 'bg-white/10 border-blue-500/50 shadow-lg' 
                      : lvl.status === 'locked' 
                        ? 'bg-white/5 border-white/5 opacity-50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'}
                 `}>
                    <div className="flex justify-between items-start mb-3">
                       <h3 className={`text-lg font-bold ${lvl.status === 'current' ? 'text-white' : 'text-slate-300'}`}>
                         {lvl.name}
                       </h3>
                       <span className="text-sm font-mono text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                         {lvl.salary}
                       </span>
                    </div>
                    
                    <ul className="space-y-2 mb-4">
                      {lvl.reqs.map((req, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                          {req}
                        </li>
                      ))}
                    </ul>

                    {lvl.status === 'current' && (
                       <div className="inline-flex items-center gap-2 text-blue-400 text-sm font-bold animate-pulse">
                          当前阶段 <ArrowRight size={16} />
                       </div>
                    )}
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};
