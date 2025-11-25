import React, { useState } from 'react';
import { KanbanSquare, Plus, MoreHorizontal } from 'lucide-react';
import { Task } from '../types';

export const ProjectManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: '进行用户访谈', status: 'done', priority: 'high' },
    { id: '2', title: '起草搜索功能 PRD', status: 'in-progress', priority: 'high' },
    { id: '3', title: '与 UX 团队进行设计评审', status: 'todo', priority: 'medium' },
    { id: '4', title: '更新路线图幻灯片', status: 'todo', priority: 'low' },
  ]);

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityLabel = (p: string) => {
    switch (p) {
      case 'high': return '高';
      case 'medium': return '中';
      default: return '低';
    }
  };

  const Column = ({ title, status }: { title: string, status: Task['status'] }) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-700">{title} <span className="ml-2 text-xs bg-slate-200 px-2 py-0.5 rounded-full text-slate-600">{tasks.filter(t => t.status === status).length}</span></h3>
        <button className="text-slate-400 hover:text-slate-600"><Plus size={18} /></button>
      </div>
      <div className="bg-slate-50 p-3 rounded-xl min-h-[400px] border-2 border-dashed border-slate-200 space-y-3">
        {tasks.filter(t => t.status === status).map(task => (
          <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 group hover:shadow-md transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                {getPriorityLabel(task.priority)}
              </span>
              <button className="text-slate-300 hover:text-slate-500"><MoreHorizontal size={16} /></button>
            </div>
            <p className="text-sm font-medium text-slate-800">{task.title}</p>
            
            {/* Simple controls to simulate drag and drop for this demo */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
               {status !== 'todo' && (
                 <button onClick={() => moveTask(task.id, status === 'done' ? 'in-progress' : 'todo')} className="text-xs text-slate-500 hover:text-brand-600 font-medium">
                   &larr; 上一步
                 </button>
               )}
               {status !== 'done' && (
                 <button onClick={() => moveTask(task.id, status === 'todo' ? 'in-progress' : 'done')} className="text-xs text-slate-500 hover:text-brand-600 font-medium ml-auto">
                   下一步 &rarr;
                 </button>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 h-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <KanbanSquare className="text-brand-500" />
            项目管理模拟
          </h2>
          <p className="text-slate-500">
            管理你的 Sprint。确定任务优先级并将其移至完成状态。
          </p>
        </div>
        <div className="flex space-x-2">
            <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition">创建工单</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Column title="待办 (To Do)" status="todo" />
        <Column title="进行中 (In Progress)" status="in-progress" />
        <Column title="已完成 (Done)" status="done" />
      </div>
    </div>
  );
};