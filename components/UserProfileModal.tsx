
import React, { useState } from 'react';
import { X, LogOut, ShoppingBag, CreditCard, Award, User, Star, Zap, CheckCircle, LayoutDashboard, ScrollText, ArrowRight, Medal } from 'lucide-react';
import { User as UserType, Order } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  orders: Order[];
  onLogout: () => void;
  onShowCareerLadder: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user, orders, onLogout, onShowCareerLadder }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'certificates'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#f5f5f7] w-full max-w-lg h-full shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="bg-white px-6 py-6 flex items-center justify-between border-b border-slate-200 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-[#1d1d1f]">个人中心</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card (Always Visible) */}
        <div className="px-6 pt-8 pb-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg ring-4 ring-slate-50">
                {user.avatar}
                </div>
                <div>
                <h3 className="text-xl font-bold text-[#1d1d1f]">{user.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <span className="bg-[#1d1d1f] text-white text-[10px] px-2 py-0.5 rounded font-bold">{user.level}</span>
                    <span className="text-sm text-slate-500">{user.role}</span>
                </div>
                </div>
            </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 mb-4">
            <div className="bg-slate-200/60 p-1 rounded-xl flex gap-1">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'overview' ? 'bg-white shadow-sm text-[#1d1d1f]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <LayoutDashboard size={16} /> 学习
                </button>
                <button 
                    onClick={() => setActiveTab('certificates')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'certificates' ? 'bg-white shadow-sm text-[#1d1d1f]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Medal size={16} /> 证书
                </button>
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'orders' ? 'bg-white shadow-sm text-[#1d1d1f]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <ScrollText size={16} /> 订单
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 custom-scrollbar">
          
          {/* --- Tab Content: Overview --- */}
          {activeTab === 'overview' && (
             <div className="space-y-6 animate-fade-in">
                {/* 1. Career Status Card */}
                <div 
                    onClick={onShowCareerLadder}
                    className="bg-black p-6 rounded-3xl shadow-lg text-white relative overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black z-0"></div>
                    <div className="absolute top-0 right-0 p-4 opacity-20 z-10">
                        <Star size={80} fill="currentColor" />
                    </div>
                    <div className="z-10 relative">
                        <div className="flex items-center gap-2 text-yellow-500 mb-2">
                            <Star size={16} fill="currentColor" />
                            <span className="font-semibold uppercase tracking-wider text-[10px]">当前职级</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-3xl font-bold">{user.level}</p>
                                <p className="text-slate-400 text-xs mt-1">{user.role}</p>
                            </div>
                            <div className="bg-white/10 p-2 rounded-full">
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Progress & Exam Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Learning Progress */}
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-40">
                        <div className="text-blue-600">
                             <Zap size={24} fill="currentColor" className="opacity-20 absolute" />
                             <Zap size={24} className="relative z-10" />
                        </div>
                        <div>
                             <p className="text-3xl font-bold text-[#1d1d1f]">{user.progress}</p>
                             <p className="text-xs text-slate-500 mt-1">已解锁模块</p>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-2">
                             <div className="bg-blue-600 h-full w-[45%]"></div>
                        </div>
                    </div>

                    {/* Exam Score */}
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-40">
                         <div className="text-green-600">
                             <CheckCircle size={24} className="relative z-10" />
                        </div>
                        <div>
                             <p className="text-3xl font-bold text-[#1d1d1f]">{user.examScore}%</p>
                             <p className="text-xs text-slate-500 mt-1">实战平均分</p>
                        </div>
                         <div className="flex -space-x-1 overflow-hidden mt-2">
                            {[1,2,3].map(i => (
                            <div key={i} className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-slate-200" />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                    <h4 className="font-bold text-[#1d1d1f] mb-2 text-sm">学习建议</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        您的实战分数表现优异！建议继续挑战 <span className="font-bold text-blue-700">Level 4 产品战略</span> 课程，提升宏观视野，向总监职级迈进。
                    </p>
                </div>
             </div>
          )}

          {/* --- Tab Content: Certificates --- */}
          {activeTab === 'certificates' && (
             <div className="space-y-4 animate-fade-in">
                {user.certificates.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-300">
                        <Medal size={48} className="text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 font-medium text-sm">完成课程等级以获取证书</p>
                    </div>
                ) : (
                    user.certificates.map(cert => (
                        <div key={cert.id} className="relative bg-[#fffdf5] rounded-xl border-[6px] border-double border-[#d4af37] p-6 shadow-md text-center group hover:scale-[1.02] transition-transform">
                            {/* Decorative Corners */}
                            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]"></div>
                            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]"></div>
                            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]"></div>
                            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]"></div>
                            
                            {/* Badge */}
                            <div className="absolute -top-3 right-6 bg-[#d4af37] text-white text-[10px] px-2 py-0.5 shadow-sm rounded-b font-bold tracking-wider">
                                OFFICIAL
                            </div>

                            <div className="mb-2">
                                <Award className="mx-auto text-[#d4af37]" size={32} />
                            </div>
                            
                            <h3 className="font-serif font-bold text-xl text-[#1d1d1f] mb-1">结业证书</h3>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-4">Certificate of Completion</p>
                            
                            <div className="text-xs text-slate-500 mb-1">授予学员</div>
                            <div className="font-serif font-bold text-lg text-[#1d1d1f] underline decoration-slate-300 underline-offset-4 mb-4">
                                {user.name}
                            </div>
                            
                            <div className="text-xs text-slate-500 mb-2">已完成课程</div>
                            <div className="font-bold text-sm text-[#0071e3] mb-6">{cert.title}</div>
                            
                            <div className="flex justify-between items-end border-t border-[#d4af37]/20 pt-4 mt-2">
                                <div className="text-left">
                                    <div className="text-[9px] text-slate-400">颁发日期</div>
                                    <div className="text-[10px] font-mono font-medium">{cert.issueDate}</div>
                                </div>
                                <div className="text-right">
                                    <div className="h-6 opacity-60">
                                       {/* Mock Signature */}
                                       <span className="font-cursive text-lg text-[#d4af37] italic" style={{fontFamily: 'cursive'}}>PM Master Class</span>
                                    </div>
                                    <div className="text-[9px] text-slate-400 border-t border-slate-300 w-24 text-center mt-1">官方认证</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
             </div>
          )}

          {/* --- Tab Content: Orders --- */}
          {activeTab === 'orders' && (
             <div className="space-y-4 animate-fade-in">
                {orders.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-300">
                    <ShoppingBag size={48} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium text-sm">暂无购买记录</p>
                </div>
                ) : (
                <div className="space-y-3">
                    {orders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-slate-100">
                        <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Award size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-[#1d1d1f] text-sm">{order.itemTitle}</div>
                            <div className="text-[10px] text-slate-400">{order.date}</div>
                        </div>
                        </div>
                        <div className="text-right">
                        <div className="font-bold text-[#1d1d1f] text-sm">- ¥{order.price}</div>
                        <div className="text-[10px] text-green-600 font-medium flex items-center justify-end gap-1">
                            <CreditCard size={10} /> 已支付
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                )}
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-slate-200">
          <button 
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full bg-slate-100 text-red-500 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <LogOut size={16} /> 退出登录
          </button>
        </div>
      </div>
    </div>
  );
};
