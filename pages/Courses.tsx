
import React, { useState } from 'react';
import { PlayCircle, Clock, Award, CheckCircle2, Lock, MessageCircle, Star, X, Check, Copy, ChevronRight, Crown, ArrowUpRight, Medal, BookOpen, Video, PenTool, FileQuestion, ArrowLeft, Layout, Sparkles, Target, ArrowRight } from 'lucide-react';
import { CourseCheckoutModal } from '../components/CourseCheckoutModal';
import { SkillCategory, Certificate } from '../types';

// --- 1. Interfaces & Data Structures ---

interface CourseDetail {
  objectives: string[];
  theory: {
    summary: string;
    keyPoints: string[];
    content: string; // Markdown-like text
  };
  practice: {
    title: string;
    description: string;
    actionLabel: string;
  };
  homework: {
    title: string;
    description: string;
  };
}

interface Course {
  id: string;
  title: string;
  duration: string;
  lessons: number;
  completed?: number;
  linkTo?: SkillCategory; // Maps to a functional module
  details?: CourseDetail; // New detailed content
}

interface CourseLevel {
  id: string;
  level: string;
  title: string;
  description: string;
  color: string;
  price: number;
  courses: Course[];
}

// --- 2. Helper Components (Graphics, Badges) ---
// CRITICAL: Defined BEFORE usage to prevent "ReferenceError: Cannot access before initialization"

const AnimationStyles = () => (
    <style>{`
      @keyframes sway {
        0%, 100% { transform: rotate(-8deg); }
        50% { transform: rotate(8deg); }
      }
      @keyframes breathe {
        0%, 100% { transform: scale(0.5); }
        50% { transform: scale(0.65); }
      }
      .group:hover .animate-sway-hover {
        animation: sway 3s ease-in-out infinite;
      }
      .group:hover .animate-breathe-hover {
        animation: breathe 2s ease-in-out infinite;
      }
    `}</style>
);

const StarBadge = () => (
  <g className="origin-center animate-breathe-hover" style={{ transformOrigin: '100px 100px', transform: 'scale(0.5)' }}>
      <filter id="star-glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
          </feMerge>
      </filter>
      <path 
        d="M100 50 L115 85 H155 L125 110 L135 150 L100 130 L65 150 L75 110 L45 85 H85 Z" 
        fill="url(#gold-gradient)" 
        stroke="#fff" 
        strokeWidth="2"
        filter="url(#star-glow)"
        className="drop-shadow-lg"
      />
      <defs>
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#fef08a', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#eab308', stopOpacity: 1}} />
        </linearGradient>
      </defs>
  </g>
);

const CrownBadge = () => (
  <g className="origin-center animate-breathe-hover" style={{ transformOrigin: '100px 100px', transform: 'scale(0.5)' }}>
      <filter id="crown-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
          </feMerge>
      </filter>
      <path 
        d="M60 140 L60 80 L85 110 L100 50 L115 110 L140 80 L140 140 H60 Z" 
        fill="url(#crown-gradient)" 
        stroke="#fff" 
        strokeWidth="2"
        filter="url(#crown-glow)"
        className="drop-shadow-lg"
      />
      <circle cx="60" cy="70" r="5" fill="#fef08a" />
      <circle cx="100" cy="40" r="6" fill="#fef08a" />
      <circle cx="140" cy="70" r="5" fill="#fef08a" />
      <defs>
        <linearGradient id="crown-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: '#fbbf24', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#b45309', stopOpacity: 1}} />
        </linearGradient>
      </defs>
  </g>
);

const Level1Graphic = ({ isLocked, hasCertificate }: { isLocked: boolean; hasCertificate: boolean }) => (
  <svg viewBox="0 0 200 200" className={`w-full h-full transition-all duration-1000 ${isLocked ? 'grayscale opacity-30' : ''}`}>
    <defs>
      <linearGradient id="l1g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: hasCertificate ? '#93c5fd' : '#60a5fa', stopOpacity: 0.9 }} />
        <stop offset="100%" style={{ stopColor: hasCertificate ? '#2563eb' : '#1d4ed8', stopOpacity: 0.2 }} />
      </linearGradient>
    </defs>
    <g className="origin-center" style={{ transformBox: 'fill-box' }}>
        <path 
        d="M100 30 L170 150 H30 Z" 
        fill="url(#l1g)" 
        className={`drop-shadow-lg transition-all duration-1000 ${!isLocked && !hasCertificate ? 'animate-sway-hover' : ''}`}
        transform={hasCertificate ? "scale(0.9) translate(10 10)" : "rotate(0 100 100)"}
        style={{ transformOrigin: '100px 100px' }}
        />
        <path 
        d="M100 50 L150 140 H50 Z" 
        fill="none"
        stroke={hasCertificate ? "#60a5fa" : "#93c5fd"}
        strokeWidth="2"
        strokeOpacity="0.5"
        className={`transition-all duration-1000 ${!isLocked ? 'opacity-100' : 'opacity-0'} ${!isLocked && !hasCertificate ? 'animate-sway-hover' : ''}`}
        style={{ transformOrigin: '100px 100px', animationDelay: '0.1s' }}
        />
        {hasCertificate && <StarBadge />}
    </g>
  </svg>
);

const Level2Graphic = ({ isLocked, hasCertificate }: { isLocked: boolean; hasCertificate: boolean }) => (
  <svg viewBox="0 0 200 200" className={`w-full h-full transition-all duration-1000 ${isLocked ? 'grayscale opacity-30' : ''}`}>
    <defs>
      <linearGradient id="l2g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#e879f9', stopOpacity: 0.9 }} />
        <stop offset="100%" style={{ stopColor: '#9333ea', stopOpacity: 0.2 }} />
      </linearGradient>
    </defs>
    <g className="origin-center" style={{ transformBox: 'fill-box' }}>
        <g className={`${!isLocked && !hasCertificate ? 'animate-sway-hover' : ''}`} style={{ transformOrigin: '100px 100px' }}>
            <rect x="50" y="50" width="100" height="100" rx="20" fill="url(#l2g)" className="drop-shadow-xl" />
            <rect x="65" y="65" width="70" height="70" rx="15" fill="none" stroke="#d8b4fe" strokeWidth="2" strokeOpacity="0.6" />
        </g>
        {hasCertificate && <StarBadge />}
    </g>
  </svg>
);

const Level3Graphic = ({ isLocked, hasCertificate }: { isLocked: boolean; hasCertificate: boolean }) => (
  <svg viewBox="0 0 200 200" className={`w-full h-full transition-all duration-1000 ${isLocked ? 'grayscale opacity-30' : ''}`}>
    <defs>
      <linearGradient id="l3g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#fb923c', stopOpacity: 0.9 }} />
        <stop offset="100%" style={{ stopColor: '#c2410c', stopOpacity: 0.2 }} />
      </linearGradient>
    </defs>
    <g className="origin-center" style={{ transformBox: 'fill-box' }}>
        <g className={`${!isLocked && !hasCertificate ? 'animate-sway-hover' : ''}`} style={{ transformOrigin: '100px 100px' }}>
            <path d="M100 25 L165 62.5 V137.5 L100 175 L35 137.5 V62.5 Z" fill="url(#l3g)" className="drop-shadow-xl" />
            <path d="M100 45 L145 72 V128 L100 155 L55 128 V72 Z" fill="none" stroke="#fed7aa" strokeWidth="2" strokeOpacity="0.6" />
        </g>
        {hasCertificate && <StarBadge />}
    </g>
  </svg>
);

const Level4Graphic = ({ isLocked, hasCertificate }: { isLocked: boolean; hasCertificate: boolean }) => (
  <svg viewBox="0 0 200 200" className={`w-full h-full transition-all duration-1000 ${isLocked ? 'grayscale opacity-30' : ''}`}>
    <defs>
      <radialGradient id="l4g" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style={{ stopColor: '#facc15', stopOpacity: 0.8 }} />
        <stop offset="100%" style={{ stopColor: '#854d0e', stopOpacity: 0.1 }} />
      </radialGradient>
    </defs>
    <g className="origin-center" style={{ transformBox: 'fill-box' }}>
        <g className={`${!isLocked && !hasCertificate ? 'animate-sway-hover' : ''}`} style={{ transformOrigin: '100px 100px' }}>
            <circle cx="100" cy="100" r="75" stroke="#facc15" strokeWidth="1" strokeDasharray="6 6" fill="none" opacity="0.4" />
            <circle cx="100" cy="100" r="55" stroke="#fde047" strokeWidth="2" fill="none" opacity="0.6" />
        </g>
        <circle cx="100" cy="100" r="40" fill="url(#l4g)" className={`transition-all duration-1000 ${!isLocked && !hasCertificate ? 'animate-sway-hover' : ''}`} style={{ animationDelay: '0.2s', transformOrigin: '100px 100px' }} opacity={hasCertificate ? 0.3 : 1} />
        {hasCertificate && <CrownBadge />}
    </g>
  </svg>
);

// --- 3. Data Generators ---

const generateDefaultDetails = (course: Course): CourseDetail => ({
  objectives: [
    `掌握 ${course.title} 的核心概念`,
    '理解在实际产品工作中的应用场景',
    '能够独立完成基础案例操作'
  ],
  theory: {
    summary: '本节课我们将深入探讨该主题的理论基础，结合大厂案例进行解析。',
    keyPoints: ['核心定义与背景', '标准工作流程 (SOP)', '常见误区与避坑指南'],
    content: `在现代产品管理中，${course.title} 是不可或缺的一环。\n\n我们需要关注用户价值与商业价值的平衡。通过系统化的方法论，我们可以减少决策的不确定性。\n\n重点在于：\n1. 明确目标用户\n2. 分析核心痛点\n3. 制定可落地的解决方案`
  },
  practice: {
    title: '实战演练',
    description: '理论结合实践。请前往对应的工作台，利用我们在课程中学到的方法论，完成一次完整的操作。',
    actionLabel: course.linkTo ? '前往工作台实操' : '开始模拟练习'
  },
  homework: {
    title: '课后思考',
    description: '结合你负责过的或正在使用的产品，分析其在该维度的表现，并撰写一份 500 字的分析报告。'
  }
});

const COURSE_DATA: CourseLevel[] = [
  {
    id: 'l1',
    level: 'LEVEL 1',
    title: '产品助理 (APM)',
    description: '构建核心产品思维，掌握基础执行能力。适合0-1岁新人入门。',
    color: 'blue',
    price: 0,
    courses: [
      { 
        id: 'c101', title: '产品经理职业全景与思维模型', duration: '45min', lessons: 3, completed: 3,
        details: {
            objectives: ['理解产品经理的定义与职责边界', '掌握“同理心”与“第一性原理”思维', '了解互联网产品的全生命周期'],
            theory: {
                summary: '产品经理 (PM) 是产品的 CEO，负责产品的生老病死。但更准确地说，PM 是资源的协调者和价值的创造者。',
                keyPoints: ['PM 的能力模型：冰山模型', '产品生命周期：引入、成长、成熟、衰退', '核心思维：用户思维、数据思维、迭代思维'],
                content: '在这个模块中，我们将打破你对 PM 的刻板印象。PM 不仅仅是画图和写文档的人，更是商业目标的实现者。\n\n我们将重点讨论“双钻模型 (Double Diamond)”：\n1. 发现问题 (Discover)\n2. 定义问题 (Define)\n3. 构思方案 (Develop)\n4. 交付验证 (Deliver)'
            },
            practice: {
                title: '自我评估',
                description: '使用 SWOT 分析法，分析自己转行/从事产品经理的优势与劣势。',
                actionLabel: '查看职业地图'
            },
            homework: {
                title: '拆解一款 App',
                description: '选择你最常用的 App，用思维导图画出它的核心功能架构。'
            }
        }
      }, 
      { 
        id: 'c102', title: '竞品分析：SWOT 与五层法实战', duration: '1.5h', lessons: 5, completed: 5, linkTo: SkillCategory.REQUIREMENTS,
        details: {
            objectives: ['学会选择正确的竞品（直接/间接/潜在）', '掌握用户体验要素（五层法）分析框架', '能够输出一份高质量的竞品分析报告'],
            theory: {
                summary: '知己知彼，百战不殆。竞品分析不是简单的截图对比，而是通过表象看本质，洞察对手的战略意图。',
                keyPoints: ['竞品分级：核心竞品 vs 重要竞品', '分析维度：战略层、范围层、结构层、框架层、表现层', '信息收集渠道：财报、AppStore 评论、行业报告'],
                content: '五层法分析实战：\n\n**1. 战略层**：他们的用户是谁？帮用户解决了什么问题？\n**2. 范围层**：提供了哪些功能和内容？\n**3. 结构层**：交互逻辑和信息架构是怎样的？\n**4. 框架层**：页面布局和按钮位置。\n**5. 表现层**：视觉风格和配色。\n\n切记：不要为了分析而分析，结论必须服务于我们的产品迭代。'
            },
            practice: {
                title: '生成竞品分析报告',
                description: '前往需求模块，使用 AI 辅助功能，针对“抖音 vs 快手”生成一份竞品分析草稿。',
                actionLabel: '前往需求工作台'
            },
            homework: {
                title: '竞品功能对比表',
                description: '选取 3 个同类产品，对比其“注册登录”流程的优劣，并输出 Excel 对比表。'
            }
        }
      },
      { id: 'c103', title: '流程图绘制：泳道图与状态机', duration: '2h', lessons: 6, completed: 2, linkTo: SkillCategory.PROTOTYPING,
        details: {
            objectives: ['掌握业务流程图（Flowchart）的绘制规范', '理解泳道图（Swimlane）在多角色协作中的作用', '学会使用状态机图描述复杂状态流转'],
            theory: {
                summary: '流程图是产品逻辑的骨架。一张清晰的流程图胜过千言万语的需求描述。',
                keyPoints: ['流程图符号规范：开始/结束、操作、判断、文档', '泳道图：明确“谁”在“什么时候”做了“什么”', 'MECE 原则：流程分支不重不漏'],
                content: '业务流程图绘制三部曲：\n1. **梳理主干**：先画出 Happy Path（最顺利的路径）。\n2. **补充枝节**：在每个判断节点（菱形）增加“否”的分支（异常流程）。\n3. **明确角色**：使用泳道区分用户、前端、后端、第三方支付等角色。'
            },
            practice: {
                title: '绘制下单流程',
                description: '前往原型设计模块，查看“业务流程图”指南，并尝试手绘一个“电商下单-支付-发货”的泳道图。',
                actionLabel: '查看绘制指南'
            },
            homework: {
                title: '优化现有流程',
                description: '找出一个你觉得体验糟糕的 App 功能，画出它的现有流程图，并画出优化后的流程图。'
            }
        }
      },
      { 
        id: 'c104', title: 'PRD 撰写：从用户故事到异常逻辑', duration: '4h', lessons: 12, completed: 0, linkTo: SkillCategory.REQUIREMENTS,
        details: {
            objectives: ['理解标准 PRD 的文档结构', '掌握 User Story 的标准句式', '学会编写无歧义的功能验收标准 (AC)'],
            theory: {
                summary: 'PRD 是产品经理交付给开发和测试的“法律文书”。清晰、严谨是第一要求。',
                keyPoints: ['PRD 核心要素：变更记录、背景、流程、功能详情、埋点', '异常流程：断网、报错、空状态', '版本管理：如何避免需求变更带来的混乱'],
                content: '一份优秀的 PRD 应该像说明书一样好读。\n\n**User Story 模板**：\nAs a <Role>, I want to <Action>, so that <Value>.\n\n**异常逻辑检查清单**：\n- 数据加载失败怎么办？\n- 输入字符超长怎么办？\n- 权限不足时显示什么？\n- 并发操作如何处理？'
            },
            practice: {
                title: '撰写我的第一个 PRD',
                description: '前往需求模块，使用分步引导工具，完成“用户登录功能”的 PRD 撰写，重点补充异常逻辑。',
                actionLabel: '开始撰写 PRD'
            },
            homework: {
                title: '完善异常分支',
                description: '为你设计的功能补充至少 5 条异常处理逻辑。'
            }
        }
      },
      { id: 'c105', title: '需求池管理：优先级排序法则', duration: '1h', lessons: 4, completed: 0, linkTo: SkillCategory.PROJECT_MANAGEMENT },
      { id: 'c106', title: '敏捷开发入门：Scrum 与 Sprint', duration: '2h', lessons: 8, completed: 0, linkTo: SkillCategory.PROJECT_MANAGEMENT },
    ]
  },
  {
    id: 'l2',
    level: 'LEVEL 2',
    title: '产品经理 (PM)',
    description: '独立负责模块，数据驱动决策与协作。适合1-3岁进阶成长。',
    color: 'purple',
    price: 299,
    courses: [
      { 
        id: 'c201', title: 'SQL 数据实战：Select 到窗口函数', duration: '5h', lessons: 15, completed: 5, linkTo: SkillCategory.DATA_ANALYSIS,
        details: {
            objectives: ['脱离 Excel，直接从数据库取数', '掌握 GROUP BY 和 JOIN 核心语法', '理解数据库表结构关系'],
            theory: {
                summary: '在数据驱动的时代，SQL 是 PM 的第二语言。不依赖分析师，自己动手查数，能极大提升决策效率。',
                keyPoints: ['SELECT...FROM...WHERE 基础结构', '聚合函数：COUNT, SUM, AVG', '多表关联：LEFT JOIN 的陷阱'],
                content: 'SQL 本质上是集合运算。\n\n`SELECT user_id, COUNT(order_id) FROM orders GROUP BY user_id`\n\n这句话的含义是：把订单表按用户分组，算出每个用户下了多少单。\n\n我们还将学习窗口函数 `RANK() OVER()`，这在计算排名和留存时非常有用。'
            },
            practice: {
                title: 'SQL 模拟练习',
                description: '前往数据分析页面的“硬技能”模块，运行几段 SQL 代码，查询销售数据。',
                actionLabel: '前往 SQL 实验室'
            },
            homework: {
                title: '编写查询语句',
                description: '写一段 SQL，查询上个月消费金额前 10 名的用户的 ID 和 总金额。'
            }
        }
      },
      { id: 'c202', title: '指标体系搭建：DAU, LTV 与 留存', duration: '3h', lessons: 10, completed: 0, linkTo: SkillCategory.DATA_ANALYSIS }, 
      { id: 'c203', title: 'A/B 测试设计：统计学与置信度', duration: '2h', lessons: 6, completed: 0, linkTo: SkillCategory.DATA_ANALYSIS },
      { id: 'c204', title: '高保真原型与设计规范 (Design System)', duration: '4h', lessons: 12, completed: 0, linkTo: SkillCategory.PROTOTYPING },
      { id: 'c205', title: '用户调研：深访技巧与问卷设计', duration: '2.5h', lessons: 8, completed: 0, linkTo: SkillCategory.REQUIREMENTS },
      { id: 'c206', title: '体验设计：尼尔森十大可用性原则', duration: '2h', lessons: 8, completed: 0, linkTo: SkillCategory.PROTOTYPING },
    ]
  },
  {
    id: 'l3',
    level: 'LEVEL 3',
    title: '高级产品经理',
    description: '商业洞察、战略规划与团队管理。适合3年以上骨干深造。',
    color: 'orange',
    price: 599,
    courses: [
      { id: 'c301', title: '商业模式画布 (BMC) 与 BRD 撰写', duration: '3h', lessons: 9, completed: 0, linkTo: SkillCategory.REQUIREMENTS },
      { id: 'c302', title: '增长黑客：AARRR 模型与增长循环', duration: '3h', lessons: 10, completed: 0, linkTo: SkillCategory.DATA_ANALYSIS },
      { id: 'c303', title: 'SaaS 产品架构与 API 接口设计', duration: '5h', lessons: 18, completed: 0, linkTo: SkillCategory.PROTOTYPING },
      { id: 'c304', title: '复杂项目管理：风险控制与甘特图', duration: '3h', lessons: 8, completed: 0, linkTo: SkillCategory.PROJECT_MANAGEMENT },
      { id: 'c305', title: 'B 端产品设计：权限模型 (RBAC)', duration: '4h', lessons: 10, completed: 0, linkTo: SkillCategory.PROTOTYPING },
      { id: 'c306', title: '向上管理与跨部门协作艺术', duration: '1.5h', lessons: 4, completed: 0, linkTo: SkillCategory.INTERVIEW },
    ]
  },
  {
    id: 'l4',
    level: 'LEVEL 4',
    title: '产品总监 (Director)',
    description: '运筹帷幄，定战略，带将才，懂资本。适合向高管跃迁的精英。',
    color: 'slate',
    price: 1299,
    courses: [
      { id: 'c401', title: '产品战略规划：DOT 战略地图', duration: '5h', lessons: 12, completed: 0, linkTo: SkillCategory.INTERVIEW },
      { id: 'c402', title: '组织架构设计与中台战略', duration: '4h', lessons: 8, completed: 0, linkTo: SkillCategory.PROTOTYPING },
      { id: 'c403', title: '财务报表分析：P&L, EBITDA 与 现金流', duration: '3h', lessons: 8, completed: 0, linkTo: SkillCategory.DATA_ANALYSIS },
      { id: 'c404', title: '商业并购 (M&A) 与投后管理', duration: '3h', lessons: 6, completed: 0, linkTo: SkillCategory.REQUIREMENTS },
      { id: 'c405', title: '人才梯队建设：选育用留', duration: '3h', lessons: 8, completed: 0, linkTo: SkillCategory.INTERVIEW },
      { id: 'c406', title: 'CPO 级实战答辩与能力评估', duration: '1h', lessons: 1, completed: 0, linkTo: SkillCategory.EXAM },
    ]
  }
];

// --- 4. Main Components ---

interface CourseDetailViewProps {
  course: Course;
  onBack: () => void;
  onNavigate: (skill: SkillCategory) => void;
}

const CourseDetailView: React.FC<CourseDetailViewProps> = ({ course, onBack, onNavigate }) => {
  const details = course.details || generateDefaultDetails(course);

  return (
    <div className="flex flex-col h-full animate-fade-in bg-white rounded-[2rem] shadow-apple border border-slate-100 overflow-hidden relative">
      {/* Header */}
      <div className="p-8 pb-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50 backdrop-blur-md sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <div>
           <h2 className="text-2xl font-bold text-[#1d1d1f]">{course.title}</h2>
           <p className="text-sm text-slate-500">{course.duration} • {course.lessons} 节课</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
         <div className="max-w-4xl mx-auto space-y-10">
            
            {/* 1. Learning Objectives */}
            <section>
               <h3 className="text-lg font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
                 <Target className="text-blue-500" size={20} /> 学习目标
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {details.objectives.map((obj, i) => (
                    <div key={i} className="bg-blue-50 p-4 rounded-xl text-blue-900 text-sm font-medium flex items-start gap-2 border border-blue-100">
                       <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                       {obj}
                    </div>
                  ))}
               </div>
            </section>

            {/* 2. Theory Content */}
            <section>
               <h3 className="text-lg font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
                 <BookOpen className="text-purple-500" size={20} /> 理论精讲
               </h3>
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-slate-600 mb-6 italic border-l-4 border-purple-200 pl-4">
                    “{details.theory.summary}”
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-[#1d1d1f] mb-2 text-sm uppercase tracking-wider text-slate-400">Key Takeaways</h4>
                    <ul className="space-y-2">
                      {details.theory.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="prose prose-slate max-w-none text-sm leading-relaxed whitespace-pre-wrap font-serif">
                    {details.theory.content}
                  </div>
               </div>
            </section>

            {/* 3. Practice */}
            <section>
               <h3 className="text-lg font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
                 <PenTool className="text-orange-500" size={20} /> 实战演练
               </h3>
               <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  <div>
                     <h4 className="font-bold text-orange-900 text-lg mb-2">{details.practice.title}</h4>
                     <p className="text-orange-800/80 text-sm mb-0 max-w-xl">{details.practice.description}</p>
                  </div>
                  {course.linkTo && (
                    <button 
                      onClick={() => onNavigate(course.linkTo!)}
                      className="whitespace-nowrap bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
                    >
                       {details.practice.actionLabel} <ArrowRight size={18} />
                    </button>
                  )}
               </div>
            </section>

            {/* 4. Homework */}
            <section>
               <h3 className="text-lg font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
                 <FileQuestion className="text-green-500" size={20} /> 课后作业
               </h3>
               <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                  <h4 className="font-bold text-green-900 mb-2">{details.homework.title}</h4>
                  <p className="text-green-800 text-sm">{details.homework.description}</p>
               </div>
            </section>

            <div className="h-20"></div>
         </div>
      </div>
    </div>
  );
};

interface CoursesProps {
  purchasedLevels: string[];
  onPurchase: (levelId: string, levelTitle: string, price: number) => void;
  onNavigate: (skill: SkillCategory) => void;
  onClaimCertificate: (levelId: string, levelTitle: string) => void;
  userCertificates: Certificate[];
}

export const Courses: React.FC<CoursesProps> = ({ purchasedLevels, onPurchase, onNavigate, onClaimCertificate, userCertificates }) => {
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  const handleLevelClick = (level: CourseLevel) => {
    if (purchasedLevels.includes(level.id)) return;
    setSelectedLevel(level);
    setCheckoutModalOpen(true);
  };

  const handleCourseClick = (course: Course, isLocked: boolean) => {
    if (isLocked) return;
    setActiveCourse(course);
  };

  const handlePurchaseSuccess = () => {
    if (selectedLevel) {
      onPurchase(selectedLevel.id, selectedLevel.title, selectedLevel.price);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("PM_Master_Coach");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelProgress = (level: CourseLevel) => {
    let completed = 0;
    let total = 0;
    level.courses.forEach(c => {
      completed += c.completed || 0;
      total += c.lessons;
    });
    return total === 0 ? 0 : completed / total;
  };

  if (activeCourse) {
    return (
      <CourseDetailView 
        course={activeCourse} 
        onBack={() => setActiveCourse(null)} 
        onNavigate={onNavigate} 
      />
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in relative w-full">
      <AnimationStyles />
      <CourseCheckoutModal 
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        level={selectedLevel}
        onSuccess={handlePurchaseSuccess}
      />

      <div className="flex-none mb-8 mt-4 px-2 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1d1d1f]">
          进阶之路
        </h1>
        <p className="text-base text-slate-500 mt-2 max-w-2xl mx-auto font-light">
          点亮每一座里程碑。从基础的三角形稳固构建，到无限可能的生态闭环。
        </p>
      </div>

      <div className="
        flex-1 min-h-0 
        flex 
        gap-6
        overflow-x-auto 
        snap-x snap-mandatory 
        pb-6 
        items-stretch 
        px-4 md:px-8
        custom-scrollbar
      ">
        {COURSE_DATA.map((level) => {
          const isLocked = !purchasedLevels.includes(level.id);
          const progress = getLevelProgress(level);
          const isDarkTheme = level.color === 'slate';
          const hasCertificate = userCertificates.some(c => c.levelId === level.id);
          
          return (
            <div 
              key={level.id} 
              className={`
                flex-shrink-0
                w-[85vw] md:w-[380px] lg:w-[380px]
                snap-center
                flex flex-col 
                rounded-[2rem] shadow-apple border 
                overflow-hidden relative group transition-all duration-300 
                ${isDarkTheme ? 'bg-[#0d0d0d] border-slate-800 text-white' : 'bg-white border-slate-100'}
                ${isLocked ? 'hover:shadow-lg' : ''}
                ${hasCertificate && !isDarkTheme ? 'ring-2 ring-blue-100' : ''}
              `}
            >
              <div className={`
                 p-6 pb-2 relative min-h-[140px] flex flex-col justify-start z-10
                 ${isDarkTheme 
                    ? 'bg-gradient-to-br from-slate-900 via-[#0d0d0d] to-black' 
                    : 'bg-gradient-to-br from-slate-50 via-white to-white'}
              `}>
                  <div className="relative z-10 max-w-[70%]">
                     <span className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-1 block ${
                        isDarkTheme ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                       {level.level}
                    </span>
                    <h2 className={`text-xl font-bold leading-tight mb-2 ${isDarkTheme ? 'text-white' : 'text-[#1d1d1f]'}`}>
                       {level.title}
                    </h2>
                     {isLocked && (
                         <div className="bg-black/80 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg inline-flex items-center gap-1 shadow-sm mt-1">
                            <Lock size={10} /> ¥{level.price}
                         </div>
                     )}
                     {!isLocked && hasCertificate && (
                         <div className="bg-[#d4af37]/10 backdrop-blur-md text-[#d4af37] text-[10px] px-2 py-1 rounded-lg inline-flex items-center gap-1 shadow-sm border border-[#d4af37]/30 mt-1">
                            <Medal size={10} /> 已获证书
                         </div>
                     )}
                  </div>

                  <div className={`absolute -top-6 -right-6 w-32 h-32 md:w-40 md:h-40 pointer-events-none z-0 
                     ${hasCertificate ? 'opacity-100 scale-110' : 'opacity-90'}
                     transition-all duration-1000 ease-out`}
                  >
                    {level.id === 'l1' && <Level1Graphic isLocked={isLocked} hasCertificate={hasCertificate} />}
                    {level.id === 'l2' && <Level2Graphic isLocked={isLocked} hasCertificate={hasCertificate} />}
                    {level.id === 'l3' && <Level3Graphic isLocked={isLocked} hasCertificate={hasCertificate} />}
                    {level.id === 'l4' && <Level4Graphic isLocked={isLocked} hasCertificate={hasCertificate} />}
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar relative z-10">
                {isLocked && (
                  <div 
                    onClick={() => handleLevelClick(level)}
                    className={`absolute inset-0 z-20 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-b-[2rem] ${
                        isDarkTheme ? 'bg-black/60 text-white' : 'bg-white/60 text-slate-800'
                    }`}
                  >
                    <div className="p-3 bg-white text-black rounded-full shadow-lg mb-2 transform scale-90 group-hover:scale-110 transition-transform">
                       <Lock size={24} />
                    </div>
                    <span className="font-bold text-sm">点击解锁课程</span>
                  </div>
                )}

                <div className="space-y-3 py-2">
                  {level.courses.map((course) => (
                    <div 
                      key={course.id}
                      onClick={() => isLocked ? handleLevelClick(level) : handleCourseClick(course, isLocked)}
                      className={`
                        flex items-center gap-3 p-3 rounded-xl border transition-all duration-200
                        ${isDarkTheme 
                            ? (isLocked ? 'border-white/5 opacity-50' : 'border-white/10 hover:bg-white/10 cursor-pointer')
                            : (isLocked ? 'border-slate-100 opacity-60' : 'border-slate-100 hover:border-blue-200 hover:shadow-sm cursor-pointer')
                        }
                      `}
                    >
                      <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors
                          ${isLocked 
                             ? 'bg-slate-100 text-slate-300' 
                             : (course.completed === course.lessons 
                                ? 'bg-green-100 text-green-600' 
                                : (isDarkTheme ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'))
                          }
                      `}>
                         {isLocked ? <Lock size={14} /> : (course.completed === course.lessons ? <Check size={14} /> : <PlayCircle size={14} />)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                         <div className={`text-sm font-bold truncate ${isDarkTheme ? 'text-slate-200' : 'text-slate-700'}`}>
                             {course.title}
                         </div>
                         <div className={`flex items-center gap-2 text-[10px] mt-0.5 ${isDarkTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                             <span>{course.duration}</span>
                             <span>•</span>
                             <span>{course.lessons} 讲</span>
                         </div>
                      </div>

                      {!isLocked && (
                          <div className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ChevronRight size={14} />
                          </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {!isLocked && !hasCertificate && (
                 <div className={`p-4 pt-0 ${isDarkTheme ? 'border-white/10' : 'border-slate-50'}`}>
                    <button 
                        onClick={() => onClaimCertificate(level.id, level.title)}
                        className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mt-2 transition-colors
                            ${isDarkTheme 
                                ? 'bg-white/10 hover:bg-white/20 text-white' 
                                : 'bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 border border-orange-100 hover:shadow-sm'
                            }
                        `}
                    >
                        <Medal size={16} /> 领取结业证书
                    </button>
                 </div>
              )}
              
              {!isLocked && hasCertificate && (
                 <div className={`p-4 pt-0 text-center`}>
                    <p className="text-xs text-slate-400 mt-2 font-medium flex items-center justify-center gap-1">
                        <CheckCircle2 size={12} className="text-green-500" /> 证书已颁发
                    </p>
                 </div>
              )}

              {isLocked && (
                <div className={`h-1.5 w-full ${isDarkTheme ? 'bg-white/10' : 'bg-slate-100'}`}>
                    <div 
                      className={`h-full transition-all duration-1000 ease-out ${
                          level.id === 'l1' ? 'bg-blue-500' : 
                          level.id === 'l2' ? 'bg-purple-500' : 
                          level.id === 'l3' ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${progress * 100}%` }}
                    />
                </div>
              )}
            </div>
          );
        })}

        <div 
            className="
                flex-shrink-0
                w-[85vw] md:w-[380px] lg:w-[380px]
                snap-center
                flex flex-col 
                rounded-[2rem] shadow-2xl border border-[#d4af37]/30
                overflow-hidden relative group transition-all duration-300 
                bg-[#050505] text-white
                hover:scale-[1.01]
            "
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-black z-0"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="relative z-10 p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1 block text-[#d4af37]">
                            PREMIUM
                        </span>
                        <h2 className="text-2xl font-bold leading-tight text-white">
                            1对1 导师私教
                        </h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b45309] flex items-center justify-center shadow-lg text-black animate-pulse">
                        <Crown size={24} fill="currentColor" />
                    </div>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    不再孤军奋战。资深总监级导师为您提供量身定制的职业辅导，从简历优化到模拟面试，全方位护航您的晋升之路。
                </p>

                <div className="space-y-4 mb-8 flex-1">
                    {[
                        '深度简历优化与挖掘',
                        '大厂模拟面试 (Mock Interview)',
                        '职级答辩与述职辅导',
                        '个性化职业规划咨询'
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                            <Star size={14} className="text-[#d4af37]" fill="currentColor" />
                            {item}
                        </div>
                    ))}
                </div>

                <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-xs text-slate-500">服务定价</p>
                            <p className="text-lg font-bold text-[#d4af37]">按需定制</p>
                        </div>
                        <div className="flex -space-x-2">
                            {[1,2,3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">
                                    <MessageCircle size={14} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowContactModal(true)}
                        className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-white text-black hover:bg-[#d4af37] hover:text-black shadow-lg"
                    >
                        <Sparkles size={18} /> 立即预约咨询
                    </button>
                </div>
            </div>
        </div>

      </div>

      {showContactModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowContactModal(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in p-8 text-center">
            <button 
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
               <MessageCircle size={32} />
            </div>
            
            <h3 className="text-xl font-bold text-[#1d1d1f] mb-2">添加导师微信</h3>
            <p className="text-slate-500 mb-6 text-xs">请备注“预约咨询”，我们将尽快通过</p>
            
            <div className="w-48 h-48 bg-slate-900 mx-auto rounded-xl flex items-center justify-center mb-6 relative group overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-800 to-slate-700"></div>
                <div className="relative z-10 grid grid-cols-5 gap-1 p-4">
                    {[...Array(25)].map((_, i) => (
                        <div key={i} className={`w-full pt-[100%] ${Math.random() > 0.4 ? 'bg-white' : 'bg-transparent'} rounded-[1px]`}></div>
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-10 h-10 bg-white rounded p-1 shadow-sm">
                            <div className="w-full h-full bg-green-500 rounded-sm flex items-center justify-center text-white text-[10px] font-bold">We</div>
                         </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between border border-slate-100">
               <div className="text-left">
                  <p className="text-[10px] text-slate-400">微信号</p>
                  <p className="font-mono font-semibold text-sm text-[#1d1d1f]">PM_Master_Coach</p>
               </div>
               <button 
                 onClick={copyToClipboard}
                 className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-[#0071e3] transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm"
               >
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
               </button>
            </div>
             {copied && <p className="text-green-600 text-xs mt-2 font-medium">已复制到剪贴板</p>}
          </div>
        </div>
      )}
    </div>
  );
};
