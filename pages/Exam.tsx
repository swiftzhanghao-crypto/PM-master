
import React, { useState, useEffect } from 'react';
import { PenLine, Timer, AlertCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Target, BarChart2 } from 'lucide-react';

interface Question {
  id: string;
  level: number; // 1-4
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation: string;
}

// 4 Levels * 5 Questions = 20 Questions Total
const QUESTIONS: Question[] = [
  // --- LEVEL 1: APM (基础执行) ---
  {
    id: 'l1-1', level: 1,
    question: '在 PRD（产品需求文档）中，MVP 指的是什么？',
    options: ['最大价值产品', '最小可行性产品', '主要视觉页面', '多版本计划'],
    correctAnswer: 1,
    explanation: 'MVP (Minimum Viable Product) 指最小可行性产品，用最小的成本验证核心假设。'
  },
  {
    id: 'l1-2', level: 1,
    question: '以下哪个工具最常用于绘制业务流程图？',
    options: ['PhotoShop', 'Excel', 'Visio/ProcessOn', 'Word'],
    correctAnswer: 2,
    explanation: 'Visio, ProcessOn, FigJam 等是标准的流程图绘制工具。'
  },
  {
    id: 'l1-3', level: 1,
    question: '在流程图中，菱形通常代表什么？',
    options: ['开始/结束', '具体操作', '逻辑判断/分支', '文档输出'],
    correctAnswer: 2,
    explanation: '菱形在标准流程图规范中代表判定节点（Decision），产生“是/否”分支。'
  },
  {
    id: 'l1-4', level: 1,
    question: 'User Story（用户故事）的标准格式是？',
    options: ['作为<角色>，我希望<活动>，以便<价值>', '需求名称-优先级-描述', '背景-目标-方案', '输入-处理-输出'],
    correctAnswer: 0,
    explanation: '标准格式：As a <Role>, I want to <Action>, so that <Benefit>。'
  },
  {
    id: 'l1-5', level: 1,
    question: '测试环境中发现一个阻断核心流程的 Bug，其优先级应定为？',
    options: ['P3 (Low)', 'P2 (Medium)', 'P1 (High)', 'P0 (Blocker)'],
    correctAnswer: 3,
    explanation: '阻断主流程（如无法登录、无法支付）属于最高优先级 P0，需立即修复。'
  },

  // --- LEVEL 2: PM (独立负责) ---
  {
    id: 'l2-1', level: 2,
    question: 'DAU 是什么指标的缩写？',
    options: ['日新增用户', '日活跃用户', '日均启动次数', '日均使用时长'],
    correctAnswer: 1,
    explanation: 'DAU = Daily Active Users。'
  },
  {
    id: 'l2-2', level: 2,
    question: 'SQL 中用于从数据库表中检索数据的关键字是？',
    options: ['UPDATE', 'DELETE', 'SELECT', 'INSERT'],
    correctAnswer: 2,
    explanation: 'SELECT * FROM table 是最基础的查询语句。'
  },
  {
    id: 'l2-3', level: 2,
    question: '在 A/B 测试中，如果 p-value < 0.05，说明什么？',
    options: ['结果具有统计显著性', '实验失败', '两组数据完全一样', '样本量不足'],
    correctAnswer: 0,
    explanation: 'p < 0.05 通常作为拒绝原假设的阈值，意味着差异不是随机产生的，具有统计显著性。'
  },
  {
    id: 'l2-4', level: 2,
    question: 'Kano 模型中，“必备属性”指的是？',
    options: ['用户无所谓的功能', '没有时不满意，有时理所当然', '有时很满意，没有时无所谓', '越多越好'],
    correctAnswer: 1,
    explanation: '必备属性 (Must-be)：做好了用户觉得是应该的，做不好用户会非常不满（如拨号功能之于手机）。'
  },
  {
    id: 'l2-5', level: 2,
    question: '当研发说“这个需求技术上实现不了”时，PM 首先应该？',
    options: ['直接砍掉需求', '向老板投诉研发能力差', '询问具体卡点，探讨替代方案', '强制要求加班做'],
    correctAnswer: 2,
    explanation: 'PM 应深入了解技术瓶颈是性能问题、逻辑矛盾还是排期问题，并寻求达到相同业务目标的其他路径（Workaround）。'
  },

  // --- LEVEL 3: Senior PM (商业策略) ---
  {
    id: 'l3-1', level: 3,
    question: '什么是“北极星指标” (North Star Metric)？',
    options: ['公司营收总额', '唯一的、反映产品核心价值的长期指标', 'APP 下载量', '员工满意度'],
    correctAnswer: 1,
    explanation: '北极星指标指引全员向同一个方向努力，必须能体现产品对用户的核心价值（如 Spotify 的“总收听时长”）。'
  },
  {
    id: 'l3-2', level: 3,
    question: 'LTV (Life Time Value) 计算的是用户的什么价值？',
    options: ['生命周期总价值', '单次购买价值', '最近一次访问价值', '推荐价值'],
    correctAnswer: 0,
    explanation: 'LTV 是用户在整个生命周期内为产品贡献的净利润总和。'
  },
  {
    id: 'l3-3', level: 3,
    question: '关于“网络效应” (Network Effect)，描述正确的是？',
    options: ['服务器越多网速越快', '用户越多，产品对每个用户的价值越大', '网络覆盖范围越广', '推广渠道越多'],
    correctAnswer: 1,
    explanation: '典型的网络效应如微信、电话。新用户的加入增加了老用户的使用价值。'
  },
  {
    id: 'l3-4', level: 3,
    question: 'RICE 优先级排序模型中的 I 代表什么？',
    options: ['Investment (投资)', 'Impact (影响力)', 'Idea (创意)', 'Income (收入)'],
    correctAnswer: 1,
    explanation: 'RICE = Reach (覆盖面) x Impact (影响力) x Confidence (信心) / Effort (工作量)。'
  },
  {
    id: 'l3-5', level: 3,
    question: 'SaaS 产品中，Churn Rate (流失率) 过高意味着？',
    options: ['获客能力太强', '产品未达到 PMF 或服务体系主要缺陷', '定价太低', '市场竞争小'],
    correctAnswer: 1,
    explanation: 'SaaS 依靠续费盈利。流失率高说明是个“漏桶”，通常意味着产品没解决问题或客户成功服务缺失。'
  },

  // --- LEVEL 4: Director (宏观战略) ---
  {
    id: 'l4-1', level: 4,
    question: '在商业模型中，CAC (获客成本) 和 LTV (生命周期价值) 的健康比例通常应大于？',
    options: ['1:1', '3:1', '10:1', '0.5:1'],
    correctAnswer: 1,
    explanation: 'LTV/CAC > 3 通常被认为是健康的商业模式。如果 < 1 则每拉一个新用户都在亏钱。'
  },
  {
    id: 'l4-2', level: 4,
    question: '“规模经济” (Economies of Scale) 的核心优势是？',
    options: ['规模越大，管理越简单', '规模越大，单位成本越低', '规模越大，定价可以越高', '规模越大，创新越快'],
    correctAnswer: 1,
    explanation: '规模经济指随着产量的增加，分摊到每个单位产品的固定成本下降，从而形成成本优势。'
  },
  {
    id: 'l4-3', level: 4,
    question: '在 P&L (损益表) 中，EBITDA 代表什么？',
    options: ['净利润', '毛利', '税息折旧及摊销前利润', '现金流'],
    correctAnswer: 2,
    explanation: 'EBITDA 剔除了融资、税务和会计折旧影响，更能反映企业主营业务的经营现金流能力。'
  },
  {
    id: 'l4-4', level: 4,
    question: '矩阵式组织架构 (Matrix Structure) 的主要挑战是？',
    options: ['缺乏专业分工', '多头汇报 (双重指挥链) 导致沟通成本高', '部门壁垒过深', '结构太简单'],
    correctAnswer: 1,
    explanation: '矩阵式架构中，员工既向职能经理汇报，又向项目经理汇报，容易产生指令冲突和推诿。'
  },
  {
    id: 'l4-5', level: 4,
    question: '企业进行 M&A (并购) 的主要动机不包括？',
    options: ['获取技术或专利', '消灭竞争对手', '即时增加员工数量以冲业绩', '进入新市场'],
    correctAnswer: 2,
    explanation: '单纯增加员工数量通常会带来管理负担，不是并购的战略目的。并购是为了协同效应、市场份额或核心资产。'
  }
];

const LEVEL_NAMES: Record<number, string> = {
  1: 'Lvl 1 - 产品助理 (APM)',
  2: 'Lvl 2 - 产品经理 (PM)',
  3: 'Lvl 3 - 高级产品经理 (Senior PM)',
  4: 'Lvl 4 - 产品总监 (Director)'
};

export const Exam: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(QUESTIONS.length).fill(null));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes for 20 questions
  const [finalLevel, setFinalLevel] = useState<string>('');
  const [scoreData, setScoreData] = useState<{total: number, levelScores: number[]}>({total: 0, levelScores: [0,0,0,0]});

  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const handleSelect = (optionIndex: number) => {
    if (isSubmitted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let totalCorrect = 0;
    const levelCorrect = [0, 0, 0, 0]; // Index 0 is Level 1

    QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        totalCorrect++;
        levelCorrect[q.level - 1]++;
      }
    });

    const totalScore = Math.round((totalCorrect / QUESTIONS.length) * 100);
    
    // Determine Level based on Total Score (Simplified Logic)
    let assessedLevel = 'Lvl 1 - 入门学员';
    if (totalScore >= 90) assessedLevel = LEVEL_NAMES[4];
    else if (totalScore >= 75) assessedLevel = LEVEL_NAMES[3];
    else if (totalScore >= 50) assessedLevel = LEVEL_NAMES[2];
    else if (totalScore >= 30) assessedLevel = LEVEL_NAMES[1];

    setScoreData({
      total: totalScore,
      levelScores: levelCorrect.map(c => c * 20) // Convert 5 questions to 100 scale per level (c/5*100)
    });
    setFinalLevel(assessedLevel);
    setIsSubmitted(true);
  };

  const resetExam = () => {
    setCurrentQIndex(0);
    setSelectedAnswers(new Array(QUESTIONS.length).fill(null));
    setIsSubmitted(false);
    setTimeLeft(1200);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = QUESTIONS[currentQIndex];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in max-w-6xl mx-auto">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-8 px-4 flex-none">
        <div>
          <h1 className="text-2xl font-bold text-[#1d1d1f] flex items-center gap-2">
            <Target className="text-[#0071e3]" size={24} />
            产品能力全维测评
          </h1>
          <p className="text-slate-500 mt-1 text-sm">20 道题 · 覆盖 L1 执行到 L4 战略 · 智能定级</p>
        </div>
        {!isSubmitted && (
          <div className="bg-slate-100 px-4 py-2 rounded-full font-mono font-bold text-[#1d1d1f] flex items-center gap-2">
            <Timer size={18} className={timeLeft < 60 ? "text-red-500 animate-pulse" : "text-slate-600"} />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="bg-white rounded-[2rem] shadow-apple border border-slate-100 overflow-hidden relative flex-1 flex flex-col mx-4 md:mx-0">
        
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-50 flex flex-none">
           {QUESTIONS.map((_, idx) => (
             <div key={idx} className={`flex-1 h-full border-r border-white/50 last:border-0 transition-colors duration-300 ${
                idx < currentQIndex ? 'bg-green-500' : 
                idx === currentQIndex ? 'bg-[#0071e3]' : 'bg-slate-200'
             }`}></div>
           ))}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isSubmitted ? (
            // Result View
            <div className="flex flex-col p-8 md:p-12 animate-scale-in">
                <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-10">
                    {/* Score Card */}
                    <div className="text-center">
                        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                            <circle 
                                cx="80" cy="80" r="70" stroke="#0071e3" strokeWidth="10" fill="transparent" 
                                strokeDasharray={440}
                                strokeDashoffset={440 - (440 * scoreData.total) / 100}
                                className="transition-all duration-1000 ease-out"
                            />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-[#1d1d1f]">{scoreData.total}</span>
                                <span className="text-xs text-slate-400">综合得分</span>
                            </div>
                        </div>
                    </div>

                    {/* Level Result */}
                    <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center md:text-left">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">系统评估定级</h3>
                        <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4 flex items-center justify-center md:justify-start gap-2">
                            <Award className="text-yellow-500" size={32} />
                            {finalLevel}
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            {scoreData.total >= 80 
                            ? '您的产品思维非常成熟，在战略规划和商业洞察上表现出色，具备带领团队的潜质。' 
                            : scoreData.total >= 60 
                                ? '您具备扎实的产品执行能力，但在宏观战略和商业模式的理解上还有提升空间。'
                                : '您处于产品经理的入门阶段，建议重点加强基础技能的学习和实践。'}
                        </p>
                    </div>
                </div>

                {/* Dimension Analysis */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: '基础执行 (L1)', score: scoreData.levelScores[0], color: 'bg-blue-500' },
                        { label: '业务负责 (L2)', score: scoreData.levelScores[1], color: 'bg-purple-500' },
                        { label: '商业策略 (L3)', score: scoreData.levelScores[2], color: 'bg-orange-500' },
                        { label: '宏观战略 (L4)', score: scoreData.levelScores[3], color: 'bg-red-500' },
                    ].map((dim, i) => (
                        <div key={i} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm text-center">
                            <div className="text-xs text-slate-500 mb-2">{dim.label}</div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-1">
                                <div className={`h-full ${dim.color}`} style={{width: `${dim.score}%`}}></div>
                            </div>
                            <div className="font-bold">{dim.score}%</div>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                    <button 
                        onClick={resetExam}
                        className="px-6 py-3 border border-slate-200 rounded-full font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        <RotateCcw size={18} /> 重新测评
                    </button>
                    <button className="px-8 py-3 bg-[#1d1d1f] text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                        生成能力报告 <ArrowRight size={18} />
                    </button>
                </div>
            </div>
            ) : (
            // Question View
            <div className="p-8 md:p-12 flex flex-col h-full">
                <div className="mb-6 flex-none">
                    <div className="flex items-center gap-2 mb-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded
                            ${currentQ.level === 1 ? 'bg-blue-100 text-blue-700' : 
                            currentQ.level === 2 ? 'bg-purple-100 text-purple-700' : 
                            currentQ.level === 3 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}
                        `}>
                            Level {currentQ.level}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Question {currentQIndex + 1} / {QUESTIONS.length}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#1d1d1f] leading-snug">
                        {currentQ.question}
                    </h3>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                    {currentQ.options.map((opt, idx) => (
                        <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                            ${selectedAnswers[currentQIndex] === idx 
                                ? 'border-[#0071e3] bg-blue-50/50 text-[#0071e3]' 
                                : 'border-slate-100 hover:border-slate-300 text-slate-600'}
                        `}
                        >
                        <span className="font-medium text-sm md:text-base">{opt}</span>
                        {selectedAnswers[currentQIndex] === idx && (
                            <CheckCircle2 size={20} className="text-[#0071e3] shrink-0" />
                        )}
                        </button>
                    ))}
                </div>

                <div className="mt-6 flex-none flex justify-between items-center pt-6 border-t border-slate-100">
                    <button 
                        onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQIndex === 0}
                        className="text-slate-400 hover:text-slate-600 disabled:opacity-30 font-medium px-4 py-2"
                    >
                        上一题
                    </button>
                    
                    {currentQIndex === QUESTIONS.length - 1 ? (
                        <button 
                            onClick={handleSubmit}
                            disabled={selectedAnswers.includes(null)}
                            className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            提交评估
                        </button>
                    ) : (
                        <button 
                            onClick={() => setCurrentQIndex(prev => Math.min(QUESTIONS.length - 1, prev + 1))}
                            disabled={selectedAnswers[currentQIndex] === null}
                            className="bg-[#1d1d1f] hover:bg-slate-800 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            下一题 <ArrowRight size={16} />
                        </button>
                    )}
                </div>
            </div>
            )}
        </div>
    </div>
    </div>
  );
};
