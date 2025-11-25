import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Star, Loader2, CreditCard } from 'lucide-react';

interface CourseLevel {
  id: string;
  level: string;
  title: string;
  price: number;
}

interface CourseCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: CourseLevel | null;
  onSuccess: () => void;
}

export const CourseCheckoutModal: React.FC<CourseCheckoutModalProps> = ({ isOpen, onClose, level, onSuccess }) => {
  const [step, setStep] = useState<'info' | 'processing' | 'success'>('info');

  if (!isOpen || !level) return null;

  const handlePurchase = () => {
    setStep('processing');
    // Simulate API call
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
        setTimeout(() => {
            onClose();
            setStep('info'); // Reset for next time
        }, 1000);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        
        {/* Close Button */}
        {step === 'info' && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors z-10"
          >
            <X size={20} />
          </button>
        )}

        {/* Header Image/Gradient */}
        <div className="h-32 bg-gradient-to-br from-[#0071e3] to-[#42a1ff] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <Star size={64} className="text-white opacity-20 absolute -bottom-4 -right-4 rotate-12" />
          <h2 className="text-3xl font-bold text-white relative z-10 drop-shadow-md">
            解锁 {level.level}
          </h2>
        </div>

        <div className="p-8">
          {step === 'info' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#1d1d1f]">{level.title}</h3>
                <p className="text-slate-500 mt-2">获取完整的进阶课程访问权限</p>
              </div>

              <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-sm text-slate-700">解锁该阶段所有 {level.title} 视频课程</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-sm text-slate-700">获取配套的实战模版与案例源文件</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-sm text-slate-700">加入专属学员交流群</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-end mb-6 px-2">
                  <span className="text-slate-500 font-medium">总计</span>
                  <span className="text-3xl font-bold text-[#1d1d1f]">¥ {level.price}</span>
                </div>

                <button
                  onClick={handlePurchase}
                  className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <CreditCard size={20} />
                  立即支付
                </button>
                <div className="mt-4 flex justify-center items-center gap-2 text-[10px] text-slate-400">
                  <ShieldCheck size={12} />
                  <span>安全支付 · 随时退款保障</span>
                </div>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="animate-spin text-[#0071e3]" size={48} />
              <p className="text-slate-600 font-medium">正在处理您的订单...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#1d1d1f]">支付成功！</h3>
              <p className="text-slate-500">欢迎加入 {level.title} 的学习旅程。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};