
import React, { useState } from 'react';
import { PenTool, GitMerge, Server, Smartphone, ChevronLeft, ArrowRight, Layers, FileJson, CheckCircle2, Image, MousePointer2, Maximize2 } from 'lucide-react';

type ModuleType = 'flow' | 'arch' | 'hifi' | null;

interface DetailContent {
  id: ModuleType;
  title: string;
  icon: React.ElementType;
  desc: string;
  definition: string;
  tools: string[];
  keyElements: string[];
  steps: { title: string; desc: string }[];
  exampleCode?: string; // For mermaid or JSON representation
}

const MODULES: DetailContent[] = [
  {
    id: 'flow',
    title: '业务流程图 (Business Process)',
    icon: GitMerge,
    desc: '梳理业务逻辑流转，明确角色与任务，识别异常路径。',
    definition: '业务流程图（Flowchart / Swimlane Diagram）用于描述业务如何在不同角色（用户、系统、运营）之间流转。它是 PRD 的骨架，决定了产品的逻辑是否通顺。',
    tools: ['ProcessOn', 'Visio', 'FigJam', 'Whimsical'],
    keyElements: [
      '泳道 (Swimlanes)：区分不同角色（如：用户、前端、后端、支付网关）',
      '开始/结束节点：明确流程的边界',
      '判定节点 (菱形)：核心逻辑分支（如：库存充足？余额足够？）',
      '异常流程：不仅要画正向流程 (Happy Path)，更要标注异常处理'
    ],
    steps: [
      { title: '1. 明确目标', desc: '这个流程是为了解决什么问题？（例如：用户下单流程）' },
      { title: '2. 梳理角色', desc: '涉及哪些参与方？（用户、商家、平台后台、第三方支付）' },
      { title: '3. 绘制主干', desc: '先画出 Happy Path（一切顺利的情况），保证主路通畅。' },
      { title: '4. 补充异常', desc: '在每个判断节点增加“否”的分支（如：支付失败、超时、库存不足）。' },
      { title: '5. 评审闭环', desc: '检查是否有死胡同（流程断掉）或逻辑死循环。' }
    ]
  },
  {
    id: 'arch',
    title: '系统架构图 (System Architecture)',
    icon: Server,
    desc: '理解数据流向与模块关系，与开发同频对话。',
    definition: '产品架构图并非纯技术架构，而是从业务逻辑层面对系统模块进行拆解。它帮助 PM 理解数据从哪里来、到哪里去，以及各模块（如订单中心、用户中心）的耦合关系。',
    tools: ['Draw.io', 'XMind', 'Figma'],
    keyElements: [
      '表现层 (Client)：App, Web, 小程序',
      '业务层 (Business)：订单服务, 商品服务, 营销服务',
      '数据层 (Data)：MySQL, Redis, 埋点数据',
      '第三方服务：短信网关, 支付渠道, 地图API'
    ],
    steps: [
      { title: '1. 分层设计', desc: '通常采用三层或四层架构（展示层、业务逻辑层、数据层）。' },
      { title: '2. 模块拆解', desc: '将大功能拆解为子系统。例如“电商系统”拆为：商品中心、订单中心、会员中心。' },
      { title: '3. 标注数据流', desc: '用箭头标示核心数据的流向（例如：下单 -> 扣减库存 -> 生成订单）。' },
      { title: '4. 明确依赖', desc: '哪些功能依赖外部系统？（如：实名认证依赖公安接口）。' }
    ]
  },
  {
    id: 'hifi',
    title: '高保真原型 (High-Fi Prototype)',
    icon: Smartphone,
    desc: '像素级还原最终效果，包含完整交互说明与视觉规范。',
    definition: '高保真原型不仅是“长得像”，更包含交互动效、状态变化（点击态、禁用态）和异常提示。它是 UI 设计师和前端开发的直接参照标准。',
    tools: ['Figma', 'Sketch', 'MasterGo', 'ProtoPie'],
    keyElements: [
      '视觉规范：颜色、字体、间距需符合 Design System',
      '交互说明 (Interaction)：点击跳转哪里？是否有 Loading？是否有 Toast 提示？',
      '极限状态：文字超长怎么办？图片加载失败显示什么？',
      '全局组件：复用导航栏、弹窗、底部 Tab，保证一致性'
    ],
    steps: [
      { title: '1. 建立栅格', desc: '设定页面宽度（如 375px）和栅格系统，保证对齐。' },
      { title: '2. 组件搭建', desc: '先制作通用组件（Button, Input, Card），避免重复造轮子。' },
      { title: '3. 页面填充', desc: '根据线框图填充真实内容。注意：尽量使用真实数据，不要用 Lorem Ipsum。' },
      { title: '4. 标注交互', desc: '在画板旁用连线或文字详细描述交互逻辑，这是给开发看的重点。' }
    ]
  }
];

export const Prototyping: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>(null);

  const selectedData = MODULES.find(m => m.id === activeModule);

  const renderExample = (type: ModuleType) => {
    if (type === 'hifi') {
      return (
        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-[#1e1e1e]">
           {/* Figma Toolbar Simulation */}
           <div className="h-10 bg-[#2c2c2c] border-b border-[#444] flex items-center px-4 justify-between select-none">
              <div className="flex space-x-4">
                 <div className="flex space-x-1.5 items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                 </div>
                 <div className="h-4 w-[1px] bg-[#555]"></div>
                 <span className="text-white text-xs font-medium">Payment_Checkout_V2.0</span>
              </div>
              <div className="text-[#a0a0a0] text-xs">Figma</div>
           </div>
           
           {/* Canvas Area */}
           <div className="relative bg-[#e5e5e5] p-8 flex justify-center items-center min-h-[500px] overflow-hidden">
              {/* Figma Frame Simulation */}
              <div className="w-[320px] h-[640px] bg-white shadow-2xl rounded-[30px] overflow-hidden border-[8px] border-[#1d1d1f] relative group transition-transform hover:scale-[1.02] duration-500 flex flex-col">
                 {/* Status Bar */}
                 <div className="h-8 bg-white flex justify-between items-center px-4 flex-shrink-0 z-20">
                    <span className="text-[10px] font-bold text-black">9:41</span>
                    <div className="flex space-x-1">
                       <div className="w-3 h-3 bg-black rounded-full opacity-20"></div>
                       <div className="w-3 h-3 bg-black rounded-full opacity-20"></div>
                    </div>
                 </div>
                 
                 {/* App Content Image - 使用更稳定的图片源 */}
                 <div className="flex-1 relative overflow-hidden bg-slate-50">
                    <img 
                      src="https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=600&q=80" 
                      alt="App Interface" 
                      className="w-full h-full object-cover"
                    />
                    {/* UI Overlay Mockup */}
                    <div className="absolute bottom-8 left-6 right-6">
                        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20">
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-800">Total</span>
                                <span className="text-lg font-bold text-[#0071e3]">$128.00</span>
                             </div>
                             <div className="w-full bg-[#1d1d1f] text-white text-center py-3 rounded-xl text-sm font-bold">
                                Pay Now
                             </div>
                        </div>
                    </div>
                 </div>
                 
                 {/* Interactive Elements Overlay - Hover to show interactions */}
                 <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <div className="absolute bottom-[30px] left-[24px] right-[24px] h-[60px] border-2 border-[#0071e3] bg-[#0071e3]/10 rounded-xl flex items-center justify-center">
                        <span className="bg-[#0071e3] text-white text-[10px] px-2 py-0.5 rounded absolute -top-3 left-0 shadow-sm">Interaction: Tap to Pay</span>
                     </div>
                 </div>
              </div>

              {/* Cursors */}
              <div className="absolute top-[30%] right-[30%] animate-pulse z-30">
                 <MousePointer2 className="text-[#F24E1E] fill-[#F24E1E]" size={24} />
                 <div className="bg-[#F24E1E] text-white text-[10px] px-2 py-0.5 rounded ml-4 mt-1 shadow-sm whitespace-nowrap">
                    UI Designer
                 </div>
              </div>
              
              <div className="absolute bottom-[20%] left-[20%] z-30">
                 <MousePointer2 className="text-[#0ACF83] fill-[#0ACF83]" size={24} />
                 <div className="bg-[#0ACF83] text-white text-[10px] px-2 py-0.5 rounded ml-4 mt-1 shadow-sm whitespace-nowrap">
                    Product Manager
                 </div>
              </div>
           </div>
        </div>
      );
    } 
    
    if (type === 'flow') {
        return (
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 justify-between">
                     <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">Business Process Flow</span>
                     <Maximize2 size={14} className="text-slate-400" />
                </div>
                <div className="p-0 relative group">
                    <img 
                        src="https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1000&q=80" 
                        alt="Flowchart" 
                        className="w-full h-[400px] object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                     <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg border border-slate-200">
                        <p className="text-xs font-bold text-slate-800">ProcessOn / Visio</p>
                        <p className="text-[10px] text-slate-500">标准泳道图示例</p>
                    </div>
                </div>
            </div>
        )
    }

    if (type === 'arch') {
        return (
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
                <div className="h-10 bg-black/20 border-b border-white/10 flex items-center px-4 justify-between">
                     <span className="text-slate-300 text-xs font-bold uppercase tracking-wider">System Architecture v1.0</span>
                </div>
                 <div className="p-0 relative group">
                    <img 
                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80" 
                        alt="Architecture" 
                        className="w-full h-[400px] object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                    />
                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                            <Server size={32} className="text-blue-400 mx-auto mb-2" />
                            <p className="text-white font-bold">微服务架构视图</p>
                            <p className="text-slate-400 text-xs mt-1">Client • Gateway • Service • DB</p>
                        </div>
                     </div>
                </div>
            </div>
        )
    }

    return null;
  }

  if (activeModule && selectedData) {
    return (
      <div className="max-w-5xl mx-auto min-h-screen animate-fade-in">
        {/* Detail Header */}
        <div className="mb-8">
          <button 
            onClick={() => setActiveModule(null)}
            className="flex items-center text-slate-500 hover:text-[#0071e3] transition-colors mb-4 group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            返回概览
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-apple text-[#0071e3]">
              <selectedData.icon size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1d1d1f]">{selectedData.title}</h1>
              <p className="text-slate-500 mt-1">{selectedData.definition}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left: Core Elements & Tools */}
           <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-apple border border-slate-100">
                 <h3 className="font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
                    <Layers size={18} /> 核心要素
                 </h3>
                 <ul className="space-y-3">
                    {selectedData.keyElements.map((el, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                         <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                         <span>{el}</span>
                      </li>
                    ))}
                 </ul>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-lg">
                 <h3 className="font-bold mb-4 flex items-center gap-2">
                    <PenTool size={18} /> 常用工具
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    {selectedData.tools.map((tool, idx) => (
                      <span key={idx} className="bg-white/10 px-3 py-1.5 rounded-lg text-sm font-mono border border-white/10">
                        {tool}
                      </span>
                    ))}
                 </div>
              </div>
           </div>

           {/* Right: How to Write/Draw */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-apple border border-slate-100">
                 <h3 className="text-xl font-bold text-[#1d1d1f] mb-6">撰写/绘制方法论</h3>
                 <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    {selectedData.steps.map((step, idx) => (
                      <div key={idx} className="relative pl-10">
                        <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-2 border-[#0071e3] text-[#0071e3] font-bold text-sm flex items-center justify-center z-10">
                          {idx + 1}
                        </div>
                        <h4 className="font-bold text-[#1d1d1f] text-lg mb-2">{step.title}</h4>
                        <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Example Visualization Area */}
              <div className="animate-fade-in-up">
                 <div className="flex items-center gap-2 mb-4 px-2">
                    <Image size={20} className="text-[#0071e3]" />
                    <h3 className="font-bold text-[#1d1d1f] text-lg">标准示例展示</h3>
                 </div>
                 {renderExample(activeModule)}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-10 max-w-6xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold text-[#1d1d1f] tracking-tight">
          从逻辑到像素。
        </h2>
        <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto">
           产品经理不仅要画图，更要设计逻辑。掌握这三种图形，足以应对 99% 的工作场景。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {MODULES.map((module) => (
          <div 
            key={module.id}
            onClick={() => setActiveModule(module.id)}
            className="group bg-white rounded-[2rem] shadow-apple hover:shadow-apple-hover transition-all duration-300 cursor-pointer overflow-hidden border border-slate-100 flex flex-col h-full transform hover:-translate-y-1"
          >
            <div className={`h-40 bg-gradient-to-br flex items-center justify-center relative overflow-hidden
                ${module.id === 'flow' ? 'from-blue-50 to-blue-100 text-blue-600' : 
                  module.id === 'arch' ? 'from-purple-50 to-purple-100 text-purple-600' : 
                  'from-orange-50 to-orange-100 text-orange-600'}
            `}>
               <module.icon size={64} className="opacity-80 group-hover:scale-110 transition-transform duration-500" />
               <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors"></div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
               <h3 className="text-xl font-bold text-[#1d1d1f] mb-3 group-hover:text-[#0071e3] transition-colors">
                 {module.title}
               </h3>
               <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                 {module.desc}
               </p>
               
               <div className="flex items-center text-[#0071e3] font-medium text-sm mt-auto group/btn">
                 查看绘制指南 <ArrowRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
