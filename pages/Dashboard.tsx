
import React from 'react';
import { BookOpen, CheckCircle, Star, TrendingUp, ArrowRight, Zap, PenLine, ChevronRight } from 'lucide-react';
import { SkillCategory } from '../types';

interface DashboardProps {
  onNavigate: (skill: SkillCategory) => void;
  onShowCareerLadder: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onShowCareerLadder }) => {
  const learningModules = [
    {
      title: "需求分析与文档",
      desc: "从模糊的想法到精确的 PRD。深入学习用户故事、验收标准及功能定义。",
      progress: 65,
      skill: SkillCategory.REQUIREMENTS,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      tag: "核心必修"
    },
    {
      title: "数据驱动决策",
      desc: "掌握 SQL、A/B 测试及关键业务指标（DAU/LTV），让数据说话。",
      progress: 30,
      skill: SkillCategory.DATA_ANALYSIS,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      tag: "进阶技能"
    },
    {
      title: "敏捷项目管理",
      desc: "精通 Scrum 与看板方法，高效管理 Sprint，确保产品按时交付。",
      progress: 80,
      skill: SkillCategory.PROJECT_MANAGEMENT,
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
      tag: "团队协作"
    },
    {
      title: "原型与交互设计",
      desc: "学习绘制线框图与高保真原型，理解用户体验设计（UX）的核心原则。",
      progress: 10,
      skill: SkillCategory.PROTOTYPING,
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
      tag: "设计思维"
    }
  ];

  return (
    <div className="space-y-16 pb-12">
      
      {/* New Hero Section: Image Based */}
      <div className="relative w-full h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer mt-4" onClick={() => onNavigate(SkillCategory.COURSES)}>
        {/* Background Image */}
        <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80" 
            alt="Product Management Team"
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 w-fit mb-6 animate-fade-in-up">
                <Star size={14} className="text-yellow-400" fill="currentColor" />
                <span className="text-white text-xs font-bold tracking-wider uppercase">PM Master Class 2024</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 tracking-tight animate-fade-in-up delay-100">
                构建你的<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">产品思维体系</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed mb-10 animate-fade-in-up delay-200">
                从需求分析到商业闭环。结合大厂实战案例与 AI 辅助教学，打造属于你的产品经理核心竞争力。
            </p>
            
            <div className="flex gap-4 animate-fade-in-up delay-300">
                <button 
                    onClick={(e) => { e.stopPropagation(); onNavigate(SkillCategory.COURSES); }}
                    className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors flex items-center gap-2"
                >
                    开始学习 <ArrowRight size={20} />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onNavigate(SkillCategory.EXAM); }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-colors"
                >
                    测评产品能力
                </button>
            </div>
        </div>
      </div>

      {/* Quick Access / Value Props */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate(SkillCategory.REQUIREMENTS)}>
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                 <PenLine size={24} />
             </div>
             <div>
                <h3 className="font-bold text-[#1d1d1f]">PRD 撰写</h3>
                <p className="text-xs text-slate-500 mt-1">标准文档模版</p>
             </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate(SkillCategory.DATA_ANALYSIS)}>
             <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                 <TrendingUp size={24} />
             </div>
             <div>
                <h3 className="font-bold text-[#1d1d1f]">数据分析</h3>
                <p className="text-xs text-slate-500 mt-1">SQL & 漏斗模型</p>
             </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate(SkillCategory.PROTOTYPING)}>
             <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                 <Zap size={24} />
             </div>
             <div>
                <h3 className="font-bold text-[#1d1d1f]">原型设计</h3>
                <p className="text-xs text-slate-500 mt-1">高保真交互</p>
             </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow cursor-pointer" onClick={onShowCareerLadder}>
             <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center">
                 <Star size={24} fill="currentColor" />
             </div>
             <div>
                <h3 className="font-bold text-[#1d1d1f]">职级晋升</h3>
                <p className="text-xs text-slate-500 mt-1">L1 - L4 路线图</p>
             </div>
         </div>
      </div>

      {/* Learning Path - Large Image Cards */}
      <div className="space-y-8">
        <div className="flex items-baseline justify-between px-2">
          <h3 className="text-3xl font-semibold text-[#1d1d1f]">深度技能模块</h3>
          <button onClick={() => onNavigate(SkillCategory.COURSES)} className="text-[#0071e3] font-medium flex items-center gap-1 hover:underline">
            查看全部课程 <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {learningModules.map((module, idx) => (
            <div 
              key={idx} 
              onClick={() => onNavigate(module.skill)}
              className="group bg-white rounded-3xl shadow-apple hover:shadow-apple-hover transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10"></div>
                <img 
                  src={module.image} 
                  alt={module.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-white/90 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full shadow-sm text-[#1d1d1f]">
                    {module.tag}
                  </span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-2xl font-bold text-[#1d1d1f]">
                    {module.title}
                  </h4>
                  <div className="p-2 rounded-full bg-slate-50 text-[#1d1d1f] group-hover:bg-[#0071e3] group-hover:text-white transition-colors duration-300">
                    <ArrowRight size={20} />
                  </div>
                </div>
                
                <p className="text-slate-500 text-lg font-light leading-relaxed mb-8 flex-1">
                  {module.desc}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>学习进度</span>
                    <span>{module.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-[#1d1d1f] transition-all duration-1000 ease-out" 
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
