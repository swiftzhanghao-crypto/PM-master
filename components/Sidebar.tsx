import React from 'react';
import { LayoutDashboard, FileText, BarChart2, KanbanSquare, PenTool, Bot, Menu, X } from 'lucide-react';
import { SkillCategory } from '../types';

interface SidebarProps {
  activeSkill: SkillCategory;
  onSelectSkill: (skill: SkillCategory) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSkill, onSelectSkill, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: SkillCategory.DASHBOARD, icon: LayoutDashboard, label: '仪表盘' },
    { id: SkillCategory.REQUIREMENTS, icon: FileText, label: '需求分析' },
    { id: SkillCategory.DATA_ANALYSIS, icon: BarChart2, label: '数据分析' },
    { id: SkillCategory.PROJECT_MANAGEMENT, icon: KanbanSquare, label: '项目管理' },
    { id: SkillCategory.PROTOTYPING, icon: PenTool, label: '原型设计' },
    { id: SkillCategory.AI_MENTOR, icon: Bot, label: 'AI 导师' },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white rounded-md shadow-md text-brand-600"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex md:flex-col
      `}>
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-cyan-400">
            PM 大师班
          </h1>
          <p className="text-xs text-slate-400 mt-1">互动式学习工作区</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectSkill(item.id);
                if (window.innerWidth < 768) setIsOpen(false);
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${activeSkill === item.id 
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-purple-500 flex items-center justify-center font-bold text-xs">
              PM
            </div>
            <div>
              <p className="text-sm font-medium">初级产品经理</p>
              <p className="text-xs text-slate-500">LV1 学员</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};