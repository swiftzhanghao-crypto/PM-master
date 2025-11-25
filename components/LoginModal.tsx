
import React, { useState } from 'react';
import { X, ArrowRight, UserCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      onLogin(username);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-scale-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 pt-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-6 text-slate-400">
            <UserCircle2 size={48} />
          </div>

          <h2 className="text-2xl font-bold text-[#1d1d1f] mb-2">登录 PM 大师班</h2>
          <p className="text-slate-500 text-sm mb-8">开启你的产品经理进阶之旅</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input 
                type="text" 
                placeholder="输入你的昵称" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-4 bg-[#f5f5f7] rounded-xl border-none outline-none focus:ring-2 focus:ring-[#0071e3]/30 text-center text-lg font-medium placeholder:font-normal"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '登录中...' : (
                <>
                  进入工作区 <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
          
          <p className="mt-6 text-[10px] text-slate-400">
            点击登录即代表同意服务条款。这是模拟登录，无需密码。
          </p>
        </div>
      </div>
    </div>
  );
};
