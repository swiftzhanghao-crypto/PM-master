
import React, { useState, useRef, useEffect } from 'react';
import { Mic2, BookOpen, Target, BrainCircuit, User, Send, Loader2, Sparkles, ChevronDown, ChevronUp, ArrowRight, Layout, Lightbulb, TrendingUp, Globe, Cpu, Compass, Briefcase, Calculator, FileSearch } from 'lucide-react';
import { chatWithMentor } from '../services/geminiService';
import { ChatMessage } from '../types';

type TabType = 'tips' | 'mock';

interface Question {
  q: string;
  intent: string; // 考察意图
  hint: string;   // 回答思路
}

interface CategoryData {
  id: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  questions: Question[];
}

// --- 扩展后的面试题库数据 ---
const INTERVIEW_DATA: Record<string, CategoryData> = {
  'resume': {
    id: 'resume',
    title: '简历与经历梳理 (Resume)',
    desc: '打造高转化率简历，深挖个人项目亮点，构建核心故事线。',
    icon: FileSearch,
    questions: [
      {
        q: '什么样的 PM 简历能通过大厂筛选？',
        intent: '考察简历撰写的基本功和结果导向思维。',
        hint: '1. **格式清晰**：最好一页纸，倒叙排列。\n2. **STAR 原则**：不要写“负责什么”，要写“做了什么，拿到了什么结果”。\n3. **数据量化**：避免“提升了用户体验”，改为“转化率提升 15%，客诉率降低 20%”。\n4. **关键词匹配**：仔细阅读 JD，简历中必须包含 JD 里的高频词（如：SQL, B端, 增长）。'
      },
      {
        q: '如何做一个精彩的自我介绍 (Self-Introduction)？',
        intent: '考察逻辑表达、个人定位及开场控场能力。',
        hint: '采用“**过去-现在-未来**”公式，控制在 2-3 分钟。\n1. **标签化开场**：我是谁，几年经验，核心优势（如数据型/交互型 PM）。\n2. **高光经历**：挑选 1-2 个最匹配当前岗位的项目，简述成就。\n3. **求职动机**：为什么选这家公司？为什么是现在？'
      },
      {
        q: '我觉得我的项目经历很平淡，没有亮眼数据，怎么写？',
        intent: '考察挖掘隐性价值和复盘总结的能力。',
        hint: '没有惊天动地的数据，就强调**过程价值**和**难点攻克**：\n1. **效率提升**：虽然 DAU 没涨，但我重构了后台，让运营配置效率提升 50%。\n2. **流程标准化**：我制定了新的 SOP，减少了跨部门沟通成本。\n3. **从 0 到 1**：强调在资源匮乏下如何推动项目落地的执行力。'
      },
      {
        q: '我是转行/跨专业的（如运营/技术/设计转 PM），简历如何突围？',
        intent: '考察可迁移能力 (Transferable Skills) 的提炼。',
        hint: '不要写流水账，将过往经验**翻译成产品语言**：\n- **运营背景**：强调懂用户、懂场景、对数据敏感。\n- **技术背景**：强调逻辑严密、懂可行性评估、与开发沟通无障碍。\n- **设计背景**：强调同理心、交互体验把控、审美在线。'
      },
      {
        q: '如何梳理一个复杂的项目经历，防止面试被问倒？',
        intent: '考察项目复盘深度。',
        hint: '对自己做的项目进行**全链路拷问**：\n1. **背景**：为什么做？不做行不行？\n2. **方案**：为什么选方案 A 不选方案 B？\n3. **指标**：怎么衡量成功？指标定义是否合理？\n4. **反思**：如果重来一次，哪里可以做得更好？\n准备好这四个问题的答案，足以应对 80% 的深挖。'
      }
    ]
  },
  'behavior': {
    id: 'behavior',
    title: '行为面试 (Behavioral)',
    desc: '基于“过去的行为预测未来的表现”。重点考察软技能、沟通力与复盘能力。',
    icon: User,
    questions: [
      { 
        q: '请介绍一个你最骄傲的产品项目，在这个过程中你遇到了什么困难？怎么解决的？', 
        intent: '考察目标导向与解决问题的能力。',
        hint: '使用 STAR 原则：情境(S)、任务(T)、行动(A)、结果(R)。重点描述 Action（你做了什么），而不是“我们做了什么”。难点可以是资源不足、技术瓶颈或跨部门摩擦。' 
      },
      { 
        q: '当你和开发/设计发生冲突时，你通常如何处理？', 
        intent: '考察沟通能力、同理心及推动力。',
        hint: '1. 倾听并确认对方顾虑（技术难？体验差？）；2. 回归目标（以用户价值/数据为裁判）；3. 寻找共赢方案（分期实现/替代方案）。' 
      },
      { 
        q: '描述一次你失败的经历，你学到了什么？', 
        intent: '考察复盘能力、抗压能力及成长心态。',
        hint: '不要说“我太追求完美导致加班”这种假失败。要说真实的挫折（如项目延期、数据未达标），重点在于事后的复盘总结和改进措施。' 
      },
      { 
        q: '如果有多个需求方同时向你提需求，资源有限，你如何安排优先级？', 
        intent: '考察优先级管理 (Prioritization) 和 Stakeholder 管理。',
        hint: '提及 RICE 模型（Reach, Impact, Confidence, Effort）或 MoSCoW 法则。强调会与相关方同步排期理由，保持透明。' 
      },
      { 
        q: '你为什么要离开上一家公司？为什么选择我们？', 
        intent: '考察职业规划稳定性与对公司的了解程度。',
        hint: '离职原因：追求更大的挑战/平台（推力+拉力），避免单纯抱怨前司。选择理由：结合该公司产品的优势或市场地位谈。' 
      }
    ]
  },
  'product_sense': {
    id: 'product_sense',
    title: '产品设计 (Product Sense)',
    desc: '考察产品感、同理心以及从 0 到 1 设计方案的逻辑闭环。',
    icon: Lightbulb,
    questions: [
      { 
        q: '如果让你改进微信的一个功能，你会改进什么？为什么？', 
        intent: '考察对主流产品的深度思考及权衡利弊的能力。',
        hint: '不要只提“我觉得”，要基于场景和用户群。例如：“改进文件传输助手”，痛点是文件过期/多端同步。方案：增加云存储时长。负面影响：服务器成本增加。' 
      },
      { 
        q: '请为视障人士设计一款打车 App，你会怎么做？', 
        intent: '考察同理心 (Empathy) 和包容性设计。',
        hint: '1. 用户画像（全盲/弱视）；2. 交互方式（语音输入、屏幕朗读支持、大震动反馈）；3. 核心痛点（找不到车在哪）。方案：精准定位 + 司机主动寻找 + 震动导航。' 
      },
      { 
        q: '设计一款针对 6-12 岁儿童的“智能存钱罐”。', 
        intent: '考察针对特定用户群的需求挖掘。',
        hint: '用户是孩子（趣味性、成就感）和家长（监管、财商教育）。功能：任务奖励机制（做家务得钱）、可视化储蓄目标（买乐高）、家长端控制。' 
      },
      { 
        q: '你最喜欢的一款 App 是什么？好在哪里？有什么缺点？', 
        intent: '考察日常的产品积累和拆解能力。',
        hint: '选择一款非大众但有亮点的产品最好。从“用户价值”、“交互细节”、“商业模式”三个维度拆解。' 
      },
      { 
        q: '如果在电梯里要给马化腾推销你的产品方案，只有 30 秒，你会怎么说？', 
        intent: '考察提炼核心价值（Elevator Pitch）的能力。',
        hint: '公式：我们为 [目标用户] 解决了 [核心痛点]，通过 [独特方案]，预计带来 [巨大价值]。' 
      }
    ]
  },
  'analytical': {
    id: 'analytical',
    title: '数据分析 (Analytical)',
    desc: '考察数据敏感度、异动分析逻辑及指标体系搭建。',
    icon: TrendingUp,
    questions: [
      { 
        q: '某短视频 App 昨天日活 (DAU) 突然下降了 10%，你如何分析原因？', 
        intent: '考察结构化排查问题的能力。',
        hint: '内外部归因法。\n1. 数据准确性（是否统计挂了？）；\n2. 内部因素（发版Bug、运营活动结束、服务器故障）；\n3. 外部因素（节假日、竞品大动作、政策影响、网络波动）。需结合维度拆解（分地区/版本/渠道）。' 
      },
      { 
        q: '如何衡量“微信朋友圈”这个功能的成功与否？', 
        intent: '考察北极星指标 (North Star Metric) 的选取。',
        hint: '不要只看 DAU。核心价值是“社交互动”。\n核心指标：互动率（点赞/评论数 ÷ 浏览量）。\n护栏指标：人均浏览时长（防止内容过水）、广告点击率（商业化）。' 
      },
      { 
        q: '上线了一个新功能，点击率很高，但留存率下降了，为什么？怎么做？', 
        intent: '考察对虚荣指标 (Vanity Metrics) 的警惕及取舍。',
        hint: '原因可能是“标题党”或功能与预期不符，伤害了体验。对策：分析用户行为路径，优化功能实质内容，或者回滚功能。' 
      }
    ]
  },
  'estimation': {
    id: 'estimation',
    title: '费米估算 (Estimation)',
    desc: '考察逻辑拆解能力。不在乎结果是否精准，在乎公式是否合理。',
    icon: Calculator,
    questions: [
      { 
        q: '估算一下北京市一天能卖出多少杯咖啡？', 
        intent: '考察市场规模估算逻辑。',
        hint: '公式 = 人口 × 喝咖啡比例 × 平均频次。\n或者：咖啡店数量 × 单店日均销量。\n例如：北京 2000万 人，目标人群（20-40岁白领）约 500万，其中 20% 每天一杯 -> 100万杯。' 
      },
      { 
        q: '估算一辆校车能装下多少个高尔夫球？', 
        intent: '考察空间估算能力。',
        hint: '校车体积 ÷ 球的体积 × 填充系数 (0.7)。\n关键在于假设校车长宽高（如 10m*2.5m*3m）和球的半径。' 
      },
      { 
        q: '上海地铁一天的客流量是多少？', 
        intent: '考察常识与逻辑。',
        hint: '线路数 × 单线车次 × 车厢数 × 满载率。或者直接从常识推断（上海2500万人，通勤比例...），大约在 1000万量级。' 
      }
    ]
  },
  'strategy': {
    id: 'strategy',
    title: '产品战略 (Strategy)',
    desc: '考察商业洞察、市场分析及宏观视野。',
    icon: Compass,
    questions: [
      { 
        q: '如果字节跳动要进军“即时零售”领域，你觉得优势和劣势是什么？', 
        intent: '考察 SWOT 分析能力。',
        hint: '优势：巨大流量、算法精准、内容种草能力。劣势：缺乏线下履约设施（骑手/仓库）、供应链积累弱。' 
      },
      { 
        q: '如何为一款新上线的 SaaS 协作软件定价？', 
        intent: '考察商业模式设计。',
        hint: '参考竞品定价、成本导向（Cost-plus）、价值导向（Value-based）。通常采用 Freemium 模式（基础免费+高级付费）以降低获客门槛。' 
      },
      { 
        q: '面对竞争对手推出的“全场半价”补贴活动，作为 PM 你怎么应对？', 
        intent: '考察竞争策略。',
        hint: '1. 分析数据：对手活动对我方留存影响大吗？\n2. 跟进策略：如果影响大，是否跟进？还是打差异化（如强调服务质量、推出会员权益）？避免单纯的价格战。' 
      }
    ]
  },
  'tech': {
    id: 'tech',
    title: '技术原理 (Technical)',
    desc: '考察对基础技术概念的理解，确保能与开发顺畅沟通。',
    icon: Cpu,
    questions: [
      { 
        q: '请向你的奶奶解释什么是 API？', 
        intent: '考察将复杂技术概念通俗化的能力。',
        hint: 'API 就像餐厅的服务员。你（用户）看菜单点菜，服务员（API）把需求传给厨房（服务器），厨房做好后，服务员再端给你。你不需要知道厨房怎么做菜，只需要通过服务员交互。' 
      },
      { 
        q: '从输入 URL 到页面展示，浏览器发生了什么？', 
        intent: '考察 Web 基础原理。',
        hint: 'DNS 解析 -> 建立 TCP 连接 (三次握手) -> 发送 HTTP 请求 -> 服务器处理返回 HTML -> 浏览器解析渲染 (DOM树) -> 加载 CSS/JS。' 
      }
    ]
  }
};

export const Interview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('tips');
  const [activeCategory, setActiveCategory] = useState<string>('resume'); // 默认为简历模块
  const [openQuestionIndex, setOpenQuestionIndex] = useState<string | null>(null);

  // Mock Interview State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleQuestion = (idx: string) => {
    setOpenQuestionIndex(openQuestionIndex === idx ? null : idx);
  };

  const startMockInterview = async () => {
    setSessionStarted(true);
    setIsTyping(true);
    
    const initialSystemPrompt = "你现在是腾讯/字节跳动的资深产品面试官。你需要对我进行一场模拟面试。请先做一个简短的自我介绍，然后请我做自我介绍。在随后的对话中，请每次只问一个问题，并根据我的回答进行追问（压力面试）。请保持专业、犀利但有建设性的风格。";
    
    const response = await chatWithMentor([], "我们可以开始模拟面试了吗？请作为面试官开场。", initialSystemPrompt);
    
    setMessages([{
        id: 'init',
        role: 'model',
        text: response,
        timestamp: Date.now()
    }]);
    setIsTyping(false);
  };

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

    const interviewInstruction = "你现在是腾讯/字节跳动的资深产品面试官。请根据候选人（用户）的上一个回答进行点评（简短），并提出下一个具有挑战性的面试问题。如果是费米估算或逻辑题，请深究其逻辑漏洞。请保持专业。";

    const responseText = await chatWithMentor(history, userMsg.text, interviewInstruction);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-[1400px] mx-auto min-h-[calc(100vh-140px)] animate-fade-in flex flex-col">
      
      {/* Header */}
      <div className="text-center mb-8 md:mb-10 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1d1d1f] mb-4">面试备战中心</h1>
        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
          机会总是留给有准备的人。掌握 STAR 法则，熟悉常见题库，并与 AI 面试官进行实战演练。
        </p>
      </div>

      {/* Top Segmented Control */}
      <div className="flex justify-center mb-8 px-4">
        <div className="bg-slate-200/80 p-1.5 rounded-xl flex space-x-1 shadow-inner">
          <button
            onClick={() => setActiveTab('tips')}
            className={`px-4 md:px-8 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'tips' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen size={18} /> <span className="hidden md:inline">面试技巧与题库</span><span className="md:hidden">题库</span>
          </button>
          <button
            onClick={() => setActiveTab('mock')}
            className={`px-4 md:px-8 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'mock' ? 'bg-white text-[#0071e3] shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Mic2 size={18} /> <span className="hidden md:inline">AI 模拟面试</span><span className="md:hidden">模拟</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'tips' ? (
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-300px)] min-h-[600px] px-4 md:px-0">
          {/* Left Sidebar Menu */}
          <div className="w-full md:w-80 flex-shrink-0 bg-white rounded-3xl shadow-apple border border-slate-100 overflow-hidden flex flex-col">
             <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-[#1d1d1f]">题库分类目录</h3>
             </div>
             <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                <button
                  onClick={() => setActiveCategory('guide_star')}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all mb-2 ${
                    activeCategory === 'guide_star' ? 'bg-[#1d1d1f] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                   <Target size={18} className={activeCategory === 'guide_star' ? 'text-yellow-400' : 'text-slate-400'} />
                   <span className="font-bold text-sm">STAR 法则与核心思维</span>
                </button>
                
                <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">真题演练</div>
                
                {Object.values(INTERVIEW_DATA).map((cat) => (
                   <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                      activeCategory === cat.id ? 'bg-[#0071e3] text-white shadow-md' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                     <cat.icon size={18} className={activeCategory === cat.id ? 'text-white' : 'text-slate-400'} />
                     <span className="font-medium text-sm">{cat.title}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 bg-white rounded-3xl shadow-apple border border-slate-100 flex flex-col overflow-hidden">
             {activeCategory === 'guide_star' ? (
               // STAR Guide View
               <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  <div className="max-w-3xl mx-auto space-y-8">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-[2rem] shadow-lg">
                      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Target className="text-yellow-400" /> STAR 法则
                      </h3>
                      <p className="text-slate-300 mb-6">回答行为类问题（"请举例说明..."）的黄金标准。它能让你的回答结构清晰，逻辑严密。</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white/10 p-4 rounded-xl">
                          <span className="text-yellow-400 font-bold text-lg block mb-1">S - Situation (情境)</span>
                          <p className="text-slate-300 text-sm">简短描述背景。任务是在什么情况下产生的？(约10%)</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl">
                          <span className="text-yellow-400 font-bold text-lg block mb-1">T - Task (任务)</span>
                          <p className="text-slate-300 text-sm">你面临的核心挑战或目标是什么？(约10%)</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl sm:col-span-2 border border-yellow-500/30 relative overflow-hidden">
                          <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1">核心重点</div>
                          <span className="text-yellow-400 font-bold text-lg block mb-1">A - Action (行动)</span>
                          <p className="text-slate-300 text-sm">你具体做了什么？为什么这么做？体现了什么能力？这是面试官最关心的部分。(约60%)</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl sm:col-span-2">
                          <span className="text-yellow-400 font-bold text-lg block mb-1">R - Result (结果)</span>
                          <p className="text-slate-300 text-sm">最终的数据表现如何？带来了什么商业价值？如果你学到了教训，也要提出来。(约20%)</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <h3 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2">
                         <BrainCircuit className="text-purple-600" /> PM 必备思维模型
                       </h3>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-5 border border-slate-200 rounded-2xl hover:border-purple-200 transition-colors">
                             <h4 className="font-bold text-[#1d1d1f] mb-1">5W1H 分析法</h4>
                             <p className="text-sm text-slate-500">Why, What, Who, When, Where, How。拆解问题的万能钥匙。</p>
                          </div>
                          <div className="p-5 border border-slate-200 rounded-2xl hover:border-purple-200 transition-colors">
                             <h4 className="font-bold text-[#1d1d1f] mb-1">AARRR 海盗模型</h4>
                             <p className="text-sm text-slate-500">Acquisition, Activation, Retention, Revenue, Referral。增长黑客的核心框架。</p>
                          </div>
                          <div className="p-5 border border-slate-200 rounded-2xl hover:border-purple-200 transition-colors">
                             <h4 className="font-bold text-[#1d1d1f] mb-1">MVP 思维</h4>
                             <p className="text-sm text-slate-500">Minimum Viable Product。小步快跑，验证假设，避免过度设计。</p>
                          </div>
                          <div className="p-5 border border-slate-200 rounded-2xl hover:border-purple-200 transition-colors">
                             <h4 className="font-bold text-[#1d1d1f] mb-1">SWOT 分析</h4>
                             <p className="text-sm text-slate-500">Strengths, Weaknesses, Opportunities, Threats。用于竞品分析和战略规划。</p>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
             ) : (
               // Question List View
               <>
                 {/* Category Header */}
                 <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                   <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#0071e3]">
                        {React.createElement(INTERVIEW_DATA[activeCategory].icon, { size: 24 })}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-[#1d1d1f]">{INTERVIEW_DATA[activeCategory].title}</h2>
                      </div>
                   </div>
                   <p className="text-slate-500 ml-16">{INTERVIEW_DATA[activeCategory].desc}</p>
                 </div>

                 {/* Questions Accordion */}
                 <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
                    <div className="divide-y divide-slate-100">
                      {INTERVIEW_DATA[activeCategory].questions.map((item, index) => {
                        const isOpen = openQuestionIndex === index.toString();
                        return (
                          <div key={index} className="bg-white group">
                            <button 
                              onClick={() => toggleQuestion(index.toString())}
                              className="w-full text-left px-8 py-6 flex items-start justify-between hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center mt-0.5 group-hover:bg-[#0071e3] group-hover:text-white transition-colors">
                                  {index + 1}
                                </span>
                                <span className="text-lg font-medium text-slate-800 leading-snug">
                                  {item.q}
                                </span>
                              </div>
                              {isOpen ? <ChevronUp size={20} className="text-slate-400 shrink-0 mt-1" /> : <ChevronDown size={20} className="text-slate-400 shrink-0 mt-1" />}
                            </button>
                            
                            {isOpen && (
                               <div className="px-8 pb-8 pt-0 pl-[4.5rem] animate-fade-in space-y-4">
                                 <div className="flex items-start gap-2 text-sm text-slate-600">
                                    <Briefcase size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                    <p><strong className="text-[#1d1d1f]">考察意图：</strong>{item.intent}</p>
                                 </div>
                                 
                                 <div className="bg-blue-50 p-5 rounded-2xl text-sm text-blue-900 leading-relaxed border border-blue-100/50 flex gap-3">
                                   <Sparkles size={18} className="text-blue-500 shrink-0 mt-0.5" />
                                   <div>
                                     <strong className="block mb-1 text-blue-700">回答思路参考：</strong> 
                                     {item.hint}
                                   </div>
                                 </div>
                               </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="p-8 text-center">
                      <p className="text-slate-400 text-sm">更多真题持续更新中...</p>
                    </div>
                 </div>
               </>
             )}
          </div>
        </div>
      ) : (
        // Mock Interview Chat Interface
        <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 h-[600px] flex flex-col overflow-hidden relative mx-4 md:mx-0">
          {!sessionStarted ? (
            <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8">
               <div className="w-20 h-20 bg-gradient-to-tr from-[#0071e3] to-cyan-400 rounded-full flex items-center justify-center text-white mb-6 shadow-lg animate-bounce-slow">
                 <Mic2 size={32} />
               </div>
               <h3 className="text-3xl font-bold text-[#1d1d1f] mb-3">准备好接受挑战了吗？</h3>
               <p className="text-slate-500 mb-8 max-w-md">
                 AI 将扮演大厂面试官，对你进行全方位的模拟面试。它会根据你的回答进行追问，请认真对待。
               </p>
               <button 
                 onClick={startMockInterview}
                 className="bg-[#1d1d1f] text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center gap-2"
               >
                 开始模拟面试 <ArrowRight size={20} />
               </button>
            </div>
          ) : null}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50 custom-scrollbar">
             {messages.map((msg) => (
               <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-[#1d1d1f] text-white' : 'bg-white border border-slate-200 text-[#0071e3]'}`}>
                       {msg.role === 'user' ? <User size={14} /> : <BrainCircuit size={16} />}
                    </div>
                    <div className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                        msg.role === 'user' ? 'bg-[#0071e3] text-white rounded-br-sm' : 'bg-white text-[#1d1d1f] rounded-bl-sm border border-slate-100'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
               </div>
             ))}
             {isTyping && (
                <div className="flex justify-start pl-11">
                    <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                        <Loader2 className="animate-spin text-slate-400" size={18} />
                    </div>
                </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
             <div className="flex gap-3 relative max-w-3xl mx-auto">
               <input
                 type="text"
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder="输入你的回答..."
                 className="flex-1 pl-6 pr-14 py-4 rounded-full bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all outline-none shadow-inner"
               />
               <button
                 onClick={handleSend}
                 disabled={!inputText.trim() || isTyping}
                 className="absolute right-2 top-2 p-2.5 bg-[#0071e3] text-white rounded-full hover:bg-[#0077ed] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
               >
                 <Send size={18} />
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
