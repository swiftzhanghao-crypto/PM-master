
import React, { useState } from 'react';
import { generatePMAdvice } from '../services/geminiService';
import { 
  FileText, Sparkles, Copy, Check, ChevronRight, 
  LayoutList, Users, GitMerge, Fingerprint, Database, 
  ShieldAlert, History, PenTool, Lightbulb, BookOpen,
  Briefcase, TrendingUp, DollarSign, Target, Flag,
  Search, BookMarked, Swords, PieChart, Microscope, 
  Scale, Crosshair
} from 'lucide-react';

// --- 类型定义 ---
type TabType = 'prd' | 'brd' | 'comp' | 'cases';

interface GuideStep {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  guide: string;
  template: string;
  aiPromptTemplate: string;
}

interface CaseStudy {
  id: string;
  title: string;
  company: string;
  tag: string;
  summary: string;
  content: string;
}

// --- 数据：PRD 步骤 ---
const PRD_STEPS: GuideStep[] = [
  {
    id: 'p_version', icon: History, title: '1. 文档版本记录', subtitle: 'Version History',
    guide: '记录文档的变更历史，确保团队成员阅读的是最新版本。每次修改都应注明修改人、日期和具体变更内容（新增/修改/删除）。',
    template: `## 1. 版本记录\n| 版本 | 日期 | 修改人 | 修改类型 | 修改内容描述 | 审核人 |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| v1.0 | 2023-10-24 | 张三 | 新增 | 初始版本创建 | 李四 |\n| v1.1 | 2023-10-26 | 张三 | 修改 | 补充支付失败的异常流程 | 李四 |`,
    aiPromptTemplate: '帮我生成一个标准的 PRD 版本记录表格模版。'
  },
  {
    id: 'p_background', icon: Lightbulb, title: '2. 项目背景与目标', subtitle: 'Background & Goals',
    guide: '阐述为什么要做这个功能？解决了什么用户痛点？预期的商业目标（SMART原则）。需要清晰定义“成功”的标准。',
    template: `## 2. 项目背景\n### 2.1 现状与问题\n目前 App 结算页流失率高达 45%，用户反馈主要因为“运费不透明”和“找不到凑单商品”。\n\n### 2.2 业务目标\n- **核心指标**：结算页转化率提升 5%（从 20% -> 25%）。\n- **辅助指标**：客单价提升 10 元。\n\n### 2.3 项目范围\n本次迭代仅涉及 App 端结算页，暂不包含小程序。`,
    aiPromptTemplate: '我正在做[功能名称]，请帮我撰写项目背景、业务目标和预期收益。'
  },
  {
    id: 'p_users', icon: Users, title: '3. 用户角色与画像', subtitle: 'User Personas',
    guide: '定义谁会使用这个功能。描述典型的用户画像 (Persona) 和用户故事 (User Story)。',
    template: `## 3. 用户角色\n| 角色 | 描述 | 核心诉求 |\n| :--- | :--- | :--- |\n| 价格敏感型买家 | 25-30岁白领，追求性价比 | 希望清晰看到运费减免门槛 |\n| 目的性买家 | 明确知道买什么，追求效率 | 希望快速结算，不被打扰 |\n\n### 用户故事\n作为一名**价格敏感型买家**，我希望**在结算时看到还差多少钱免运费**，以便于**我凑单省钱**。`,
    aiPromptTemplate: '为[功能名称]分析核心用户角色，并撰写 3 个标准的用户故事 (User Stories)。'
  },
  {
    id: 'p_process', icon: GitMerge, title: '4. 业务流程图', subtitle: 'Business Process',
    guide: '使用泳道图或流程图描述业务逻辑流转。区分正常流程和异常流程。',
    template: `## 4. 业务流程\n### 4.1 核心业务泳道图\n(此处插入 Visio/ProcessOn 流程图链接)\n\n### 4.2 逻辑描述\n1. **校验库存**：点击“去支付”时，系统请求库存中心。\n2. **库存充足**：锁定库存，跳转收银台。\n3. **库存不足**：\n   - 单件缺货：弹窗提示，引导移除或换货。\n   - 全部缺货：置灰按钮。`,
    aiPromptTemplate: '为[功能名称]梳理核心业务流程步骤，包含正常路径和异常路径的逻辑判断。'
  },
  {
    id: 'p_features', icon: LayoutList, title: '5. 功能需求详情', subtitle: 'Functional Reqs',
    guide: '详细描述每个页面、每个按钮的交互逻辑、前置条件和后置逻辑。这是开发和测试最关注的部分。',
    template: `## 5. 功能需求\n### 5.1 凑单提示模块\n**页面位置**：结算页底部悬浮栏\n**前置条件**：购物车总额 < 免邮门槛 (99元)\n\n**交互逻辑**：\n1. 显示文案：“还差 ¥{diff} 免运费”。\n2. 点击文案，弹起“凑单推荐商品”半屏浮层。\n\n**异常逻辑 (Exception Logic)**：\n- **网络失败**：点击重试，若重试 3 次失败显示 Toast “网络开小差了”。\n- **数据为空**：若推荐商品列表为空，则不显示浮层，直接跳转凑单页。\n- **超时**：接口响应超过 3s，停止加载。`,
    aiPromptTemplate: '为[功能名称]撰写详细的功能需求。请务必包含：1. 关键页面元素及字段定义；2. 正常的交互流程 (Happy Path)；3. **详细的异常逻辑处理** (Exception Handling)：请列出至少 3-5 种可能的异常场景（如网络断开、数据加载失败/为空、输入校验不通过、权限不足、并发冲突等）及其前端反馈方式。'
  },
  {
    id: 'p_data', icon: Database, title: '6. 数据埋点', subtitle: 'Data Metrics',
    guide: '定义需要收集的数据指标。包含埋点事件 (Event) 和参数 (Params)。',
    template: `## 6. 数据埋点\n| 事件名 (Event Key) | 触发时机 | 参数 (Params) | 说明 |\n| :--- | :--- | :--- | :--- |\n| click_checkout | 点击“去支付”按钮 | total_amount (总金额), item_count (件数) | 衡量支付意愿 |\n| view_addon_popup | 凑单弹窗曝光 | source_page | 衡量凑单功能使用率 |`,
    aiPromptTemplate: '为[功能名称]设计一套数据埋点方案，表格形式，包含事件名、触发时机和参数。'
  }
];

// --- 数据：BRD 步骤 ---
const BRD_STEPS: GuideStep[] = [
  {
    id: 'b_exec', icon: Flag, title: '1. 执行摘要', subtitle: 'Executive Summary',
    guide: '一页纸的商业计划概览。用最短的篇幅说服管理层为什么要投资这个项目。',
    template: `## 1. 执行摘要\n本项目旨在开发“企业级 AI 知识库”，解决内部文档检索效率低下的问题。预计投入 200万，6个月回本，首年节省人力成本 500万。`,
    aiPromptTemplate: '为[项目名称]写一段吸引人的执行摘要，包含投入产出比亮点。'
  },
  {
    id: 'b_market', icon: Target, title: '2. 市场分析', subtitle: 'Market Analysis',
    guide: '宏观环境分析 (PEST)、市场规模 (TAM/SAM/SOM) 及竞争对手分析。',
    template: `## 2. 市场分析\n**市场规模**：国内 SaaS 协同办公市场规模达 500亿。\n**竞品**：飞书知识库（优势：生态闭环；劣势：AI 总结能力弱）。`,
    aiPromptTemplate: '分析[行业/领域]的市场规模和主要竞争对手的优劣势。'
  },
  {
    id: 'b_solution', icon: Lightbulb, title: '3. 产品解决方案', subtitle: 'Solution Strategy',
    guide: '高层次的产品形态描述。我们提供什么产品？核心差异化价值（USP）是什么？',
    template: `## 3. 解决方案\n**产品形态**：基于 RAG 技术的问答机器人。\n**核心价值**：私有化部署确保数据安全；准确率 95%+。`,
    aiPromptTemplate: '为[项目名称]描述核心解决方案和差异化竞争优势。'
  },
  {
    id: 'b_business', icon: DollarSign, title: '4. 商业模式', subtitle: 'Business Model',
    guide: '怎么赚钱？定价策略、收入来源、成本结构。',
    template: `## 4. 商业模式\n**收费模式**：SaaS 订阅制，基础版 99/人/年，专业版 199/人/年。\n**成本**：服务器带宽 30%，研发人力 50%，营销 20%。`,
    aiPromptTemplate: '为[项目名称]设计一套商业模式，包含定价策略和收入来源。'
  },
  {
    id: 'b_plan', icon: TrendingUp, title: '5. 实施路线图', subtitle: 'Roadmap',
    guide: '项目分阶段实施计划 (Milestones) 及资源需求。',
    template: `## 5. 路线图\n- **Q1**：完成 MVP 开发，内测上线。\n- **Q2**：拓展 50 家种子客户。\n- **Q3**：全面公测，启动商业化。`,
    aiPromptTemplate: '为[项目名称]规划未来 1 年的实施路线图，分为 4 个季度。'
  },
  {
    id: 'b_risk', icon: ShieldAlert, title: '6. 风险评估', subtitle: 'Risk Assessment',
    guide: '可能面临的政策、技术、市场风险及应对措施。',
    template: `## 6. 风险评估\n- **合规风险**：生成式 AI 内容监管。-> 应对：接入敏感词过滤系统。\n- **技术风险**：大模型幻觉。-> 应对：增加引用来源标注。`,
    aiPromptTemplate: '分析[项目名称]可能面临的 3 个主要风险及应对策略。'
  }
];

// --- 数据：竞品分析步骤 ---
const COMP_STEPS: GuideStep[] = [
  {
    id: 'c_target', icon: Crosshair, title: '1. 明确目标与选择竞品', subtitle: 'Competitor Selection',
    guide: '竞品分析的第一步是明确“为什么做分析”。是为新产品找定位，还是为老功能找优化点？根据目标选择直接竞品、间接竞品和潜在竞品。',
    template: `## 1. 分析目标与竞品选择\n**分析目标**：优化我方 App 的“会员体系”，提升付费转化率。\n\n**竞品选择矩阵**：\n| 竞品名称 | 类型 | 选择理由 |\n| :--- | :--- | :--- |\n| 竞品 A | 直接竞品 | 市场份额第一，会员体系成熟 |\n| 竞品 B | 间接竞品 | 用户群体重合度高，但主打社区 |\n| 竞品 C | 跨界参考 | 游戏行业，其等级激励机制值得借鉴 |`,
    aiPromptTemplate: '我要做[产品类型]的竞品分析，请帮我列出 3 个主要竞品（直接/间接），并说明选择理由。'
  },
  {
    id: 'c_data', icon: Search, title: '2. 数据收集与市场定位', subtitle: 'Data Collection',
    guide: '收集竞品的市场表现数据（下载量、排名、预估营收）以及其目标用户定位。',
    template: `## 2. 市场定位分析\n| 维度 | 我方产品 | 竞品 A | 竞品 B |\n| :--- | :--- | :--- | :--- |\n| **Slogan** | 让记录更简单 | 记录美好生活 | 专业的笔记工具 |\n| **目标用户** | 职场新人 | 大学生、年轻女性 | 极客、程序员 |\n| **市场排位** | 行业第三 | 行业第一 | 细分领域龙头 |\n| **核心优势** | 价格低，易上手 | 社区氛围好 | 功能极其强大 |`,
    aiPromptTemplate: '对比[产品A]和[产品B]的市场定位、目标用户群和核心Slogan。'
  },
  {
    id: 'c_feature', icon: LayoutList, title: '3. 核心功能拆解', subtitle: 'Feature Comparison',
    guide: '不仅是“有没有”这个功能，更要分析“做得怎么样”。使用打钩表格或详情描述。',
    template: `## 3. 功能对比分析\n### 3.1 核心功能矩阵\n| 功能模块 | 我方 | 竞品 A | 竞品 B | 备注 |\n| :--- | :--- | :--- | :--- | :--- |\n| 语音转文字 | ✅ (收费) | ✅ (免费) | ❌ | 竞品A以此为引流点 |\n| 多端同步 | ✅ | ✅ | ✅ | 标配 |\n| AI 摘要 | ❌ | ✅ | ✅ | 我方缺失的竞争点 |\n\n### 3.2 差异点深度分析\n竞品 A 的“语音转文字”虽然免费，但限制时长 1 分钟，引导用户开通会员解锁无限时长。这种“体验式免费”策略值得参考。`,
    aiPromptTemplate: '对比[产品A]和[产品B]在[核心功能模块]上的功能差异和优缺点。'
  },
  {
    id: 'c_ux', icon: Microscope, title: '4. 交互与体验分析', subtitle: 'UX Analysis',
    guide: '从视觉设计、交互路径、操作效率维度进行分析。尼尔森可用性原则是很好的分析框架。',
    template: `## 4. 交互体验分析\n### 4.1 视觉风格\n- **竞品 A**：采用高饱和度配色，年轻化，动效丰富。\n- **我方**：商务极简风，冷静克制。\n\n### 4.2 核心流程体验 (注册转化)\n- **竞品 A**：支持一键本机号码登录 -> 3秒完成注册。\n- **我方**：需发送验证码 -> 填写昵称 -> 上传头像 -> 流程过长，流失率高。\n\n**结论**：建议简化注册流程，将资料填写后置。`,
    aiPromptTemplate: '从交互设计和用户体验角度，分析[产品A]的[具体流程]有哪些值得学习的亮点。'
  },
  {
    id: 'c_business', icon: DollarSign, title: '5. 商业模式与运营', subtitle: 'Business & Ops',
    guide: '分析竞品靠什么赚钱？如何获客？如何做用户留存？',
    template: `## 5. 商业与运营分析\n### 5.1 盈利模式\n- **竞品 A**：广告 + 会员订阅 + 电商佣金。\n- **竞品 B**：纯软件买断制。\n\n### 5.2 运营策略\n- **获客**：竞品 A 在抖音大量投放“干货类”短视频，精准获客。\n- **留存**：建立了“打卡瓜分奖金”的社群活动，日活粘性极高。`,
    aiPromptTemplate: '分析[产品名称]的主要盈利模式和用户增长运营策略。'
  },
  {
    id: 'c_swot', icon: Scale, title: '6. SWOT 总结与建议', subtitle: 'Conclusion',
    guide: '基于以上分析，总结我方的优劣势，并给出具体的行动建议。',
    template: `## 6. 总结与建议 (SWOT)\n- **优势 (S)**：我们的价格更有竞争力，客服响应更快。\n- **劣势 (W)**：移动端体验落后，缺少 AI 功能。\n- **机会 (O)**：AI 技术普及降低了开发门槛，可快速跟进。\n- **威胁 (T)**：竞品 A 正在通过免费策略蚕食底层用户。\n\n### 行动建议\n1. **短期 (P0)**：优化注册流程，接入本机一键登录。\n2. **中期 (P1)**：立项研发 AI 摘要功能，补齐核心短板。`,
    aiPromptTemplate: '基于以上分析，为我方产品生成一份 SWOT 分析总结和改进建议。'
  }
];

// --- 数据：实战案例 (深度版) ---
const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'c1', title: '滴滴打车：从“抢单”到“智能派单”的算法进化史', company: 'DiDi', tag: '策略产品',
    summary: '深度解析滴滴如何通过算法重构供需关系，解决早期打车难、拒载率高的问题，实现全局效率最优。',
    content: `## 1. 案例背景与核心挑战
### 行业初期乱象
在滴滴发展的早期（2012-2014年），网约车主要沿用出租车的“电召模式”，即**抢单模式**。乘客发出订单，周围司机听到语音播报后比手速抢单。
这种模式看似公平，实则带来了巨大的**效率黑洞**：
*   **挑肥拣瘦**：司机只抢长途大单，短途单、堵车路段单无人理会。
*   **盲目空驶**：多个司机同时开往高热度区域，导致局部运力过剩，而冷门区域运力真空。
*   **安全隐患**：司机在驾驶过程中频繁盯着手机抢单，极易引发交通事故。

### 核心挑战
如何从“人治”（司机主观选择）转向“法治”（系统全局调度），在保障司机收入的同时，最大化平台的整体成交率（GMV）和用户体验（应答率）？

## 2. 破局策略：智能派单系统 (Dispatch System)
滴滴决定进行革命性的改版，取消抢单，全面推行**指派模式**。这一转型经历了三个阶段的算法迭代。

### 阶段一：基于距离的贪心算法 (Nearest Neighbor)
*   **逻辑**：系统直接将订单指派给距离乘客直线距离最近的空闲司机。
*   **问题**：直线距离近不代表到达时间短（可能隔着一条河或单行道）。且“局部最优”往往导致“全局最差”。例如，A司机距离乘客甲1公里，距离乘客乙1.1公里；B司机距离乘客甲5公里，距离乘客乙5.1公里。若按最近原则，A接甲，B接乙（共跑6公里）。但如果A去接乙，B去接甲（虽然B远一点），可能整体等待时间更短。

### 阶段二：全局最优匹配 (Global Optimization)
*   **逻辑**：系统不再单独处理每一个订单，而是每隔几秒（如2秒）收集一个时间窗口内的所有订单和所有空闲司机，构建一个**二分图匹配模型**。
*   **目标函数**：Min (Σ 所有乘客的等待时间 + Σ 所有司机的接驾距离)。
*   **技术壁垒**：KM 算法在海量数据下的实时计算能力。

### 阶段三：预测与强化学习 (Reinforcement Learning)
*   **逻辑**：系统开始具备“上帝视角”。不仅考虑当前的匹配，还预判未来的收益。
*   **供需预测**：算法预测未来10分钟某区域会有大量订单（如演唱会散场），会提前引导空车驶入该区域（调度引导）。
*   **价值分 (V值)**：给每个订单打分，不仅看金额，还看目的地是否容易接下一单。

## 3. 关键功能拆解
### 3.1 动态调价 (Surge Pricing)
*   **原理**：利用经济学供需曲线。当 需求 > 供给 时，价格上涨。
*   **目的**：
    1.  **筛选需求**：剔除价格敏感型用户，保留刚需用户。
    2.  **增加供给**：高价激励更多司机上线或跨区接单。
*   **产品细节**：界面必须清晰告知倍率（如 1.5x），并需用户二次确认，避免费用纠纷。

### 3.2 司机服务分体系
*   **逻辑**：将派单权重与服务质量挂钩。服务分高的司机优先派好单（长单、机场单）。
*   **闭环**：好服务 -> 高分 -> 好单 -> 高收入 -> 维持好服务。打破了“劣币驱逐良币”。

## 4. 商业与数据表现
*   **应答率提升**：改用派单模式后，短途订单应答率从 60% 提升至 90% 以上。
*   **接驾时长降低**：全局匹配算法使平均接驾时长降低了 20%-30%。
*   **安全性**：彻底杜绝了司机开车抢单的现象。

## 5. 对 PM 的深度启示
1.  **不要考验人性，要设计机制**：依靠司机自觉是不可能的，必须通过算法分配利益来引导行为。
2.  **局部最优 ≠ 全局最优**：做平台型产品，必须以此为座右铭。有时候牺牲单个用户的体验（多等1分钟）是为了让整个系统不崩盘。
3.  **算法是产品的灵魂**：对于交易匹配类产品（打车、外卖、相亲），UI 只是皮毛，匹配效率才是护城河。`
  },
  {
    id: 'c2', title: '拼多多：利用“人性弱点”的社交裂变增长', company: 'Pinduoduo', tag: '增长黑客',
    summary: '拼多多如何在阿里和京东的夹缝中，通过“砍一刀”等病毒式玩法，利用微信生态实现指数级增长。',
    content: `## 1. 案例背景与市场环境
2015年前后，中国电商格局看似已定。阿里占据流量顶端，京东把控物流体验。获客成本（CAC）极高，单个新增用户成本超过 200 元。
然而，下沉市场（三四线城市及农村）的数亿用户刚刚通过红米手机和微信触网，但他们觉得淘宝太复杂、京东太贵。这部分**“五环外人群”**存在巨大的需求真空。

## 2. 核心策略：社交拼团 + 游戏化运营
拼多多的核心逻辑不是“搜索电商”（人找货），而是“推荐+社交电商”（货找人+人拉人）。

### 2.1 拼团模式 (Group Buying)
*   **逻辑**：单买价 100 元，拼团价 9.9 元（需 2 人成团）。
*   **心理学**：为了节省这巨大的差价，用户会主动成为推销员，将链接分享到微信群、朋友圈。
*   **增长效应**：将高昂的广告费转化为了给用户的让利，利用用户的社交关系链（Social Graph）实现零成本获客。

### 2.2 砍一刀 (Cut the Price)
这是拼多多最受争议但也最成功的增长引擎。
*   **玩法**：用户选定一个商品（如 iPhone），系统显示“已砍 90%”，仅差 1% 即可免费拿。
*   **沉没成本**：用户看到只差一点点，不舍得放弃，开始疯狂拉友助力。
*   **递减算法**：前几刀砍掉金额很大（给用户希望），越往后金额越小（0.1元，甚至 0.01元）。这是一种极致的概率控制。
*   **结果**：为了一个免费商品，用户可能拉来了 100 个新用户点击 App。

## 3. 产品细节拆解
### 3.1 去中心化的首页
*   **设计**：早期拼多多首页没有明显的搜索框，只有琳琅满目的“推荐流”。
*   **目的**：模仿逛集市的感觉，针对没有明确购物目的的用户，通过低价爆款刺激冲动消费。

### 3.2 游戏化 (Gamification) - 多多果园
*   **玩法**：在 App 里种树，定期浇水（需浏览商品、分享好友获得水滴），树成熟后，拼多多真的寄给你一箱水果。
*   **数据指标**：极大地提升了 DAU（日活）和 用户时长。让购物 App 变成了“收菜游戏”。

## 4. 商业逻辑分析
*   **C2M (Customer to Manufacturer)**：通过前端拼团聚集海量需求（例如 100万单纸巾），直接发给工厂定制生产。去除中间商，工厂薄利多销，用户买到极致低价。
*   **广告变现**：当流量足够大时，商家为了获得曝光必须购买广告（类淘宝模式）。

## 5. 对 PM 的深度启示
1.  **利用“贪嗔痴”**：最好的增长策略往往植根于人性深处。贪便宜（拼团）、赌博心理（抽奖）、厌恶损失（砍价进度条）是永恒的驱动力。
2.  **降低门槛**：拼多多的 UI/UX 被吐槽“土”，但对于下沉用户来说，大字体、高饱和度颜色、简单的按钮才是最友好的。**产品设计要服务于目标用户，而不是设计师的审美。**
3.  **社交货币**：让用户分享，必须给用户一个理由。要么是利益（省钱），要么是面子（助人），要么是趣味。`
  },
  {
    id: 'c3', title: 'Keep：从冷冰冰的工具到有温度的运动社区', company: 'Keep', tag: '社区运营',
    summary: '工具类产品如何解决“用完即走”的难题？Keep 通过内容化和社区化，建立了极高的竞争壁垒。',
    content: `## 1. 案例背景
在 Keep 出现之前，健身 App 多为简单的计步器或视频播放器。用户痛点明显：
*   **门槛高**：去健身房太贵，且不知道怎么练。
*   **难以坚持**：一个人在家练枯燥乏味，很容易放弃。
*   **工具属性强**：练完就关掉，留存率（Retention）低，且很难变现。

## 2. 核心策略：结构化课程 + UGC 社区
Keep 的战略是从“移动健身教练”（工具）进化为“自由运动场”（社区）。

### 2.1 结构化课程 (Structured Content)
*   **破局点**：将复杂的健身动作拆解为“小白也能懂”的短视频课程。
*   **产品设计**：
    *   **全程跟练**：喊口号、计时、背景音乐，模拟私教在身边的感觉。
    *   **难度分级**：从 K1（零基础）到 K5（大神），让每个人都能找到起步点。

### 2.2 社区化转型 (Community)
*   **打卡机制**：练完后，不仅是记录数据，更是一个“打卡”仪式。
*   **晒图模板**：系统自动生成带有运动数据（消耗卡路里、时长）的精美图片。这降低了用户生产内容（UGC）的门槛，也满足了用户朋友圈炫耀（虚荣心）的需求。
*   **话题运营**：发起 #我的减肥晚餐#、#马甲线养成# 等话题，让用户有话可说。

## 3. 功能细节拆解
### 3.1 徽章系统 (Badges)
*   **玩法**：累计跑步 100km、连续运动 7 天等都会获得虚拟徽章。
*   **进阶**：推出**实体奖牌**。用户报名线上马拉松（付费 39 元），完赛后寄送精美的实体奖牌（如库洛米联名款）。这直接把“荣誉感”变成了营收来源，深受年轻女性喜爱。

### 3.2 达人体系
*   **逻辑**：扶持健身 KOL（意见领袖）。
*   **作用**：KOL 生产优质内容（PGC）吸引流量，普通用户围观互动。形成了“看-练-晒”的完整闭环。

## 4. 商业模式
*   **增值服务**：Keep 会员（定制计划）。
*   **电商消费品**：卖瑜伽垫、智能手环、健康食品。
*   **奖牌收入**：通过实体奖牌售卖实现了独特的变现路径。

## 5. 对 PM 的深度启示
1.  **工具必死，社区永生**：纯工具极易被大厂复制或系统自带功能取代（如 iOS 健康）。只有沉淀了关系链和内容的社区才有护城河。
2.  **为用户创造“社交货币”**：用户为什么分享你的 App？因为你的 App 让他看起来更自律、更健康、更时尚。产品要帮用户装逼。
3.  **情绪价值**：健身是反人性的（累）。产品经理的任务是提供顺人性的“即时反馈”（徽章、点赞、鼓励），对抗运动的枯燥。`
  },
  {
    id: 'c4', title: '微信红包：春节偷袭珍珠港', company: 'Tencent', tag: '支付/营销',
    summary: '2014年春节，微信红包横空出世，一夜之间干完了支付宝 8 年积累的绑卡量，被马云称为“偷袭珍珠港”。',
    content: `## 1. 案例背景
2013年，微信虽然已坐拥数亿用户，但在移动支付领域，支付宝占据绝对垄断地位。微信支付不仅场景少，而且用户**绑卡意愿极低**（担心安全问题，且没地方花钱）。
腾讯急需一个高频、刚需、低门槛的场景来撕开支付的口子。

## 2. 核心策略：将“习俗”产品化
微信团队敏锐地捕捉到了“春节发红包”这个中国延续千年的强社交习俗。

### 2.1 极简的产品设计
*   **核心流程**：塞钱 -> 此时需要支付（绑卡） -> 发到群里 -> 大家抢 -> 存入零钱。
*   **关键差异**：传统的转账是“一对一”的、理性的。而红包是“一对多”的、娱乐的。

### 2.2 拼手气红包 (Random Packet)
这是微信红包封神的点睛之笔。
*   **逻辑**：发 100 元给 10 个人，每个人抢到的金额随机。
*   **心理效应**：
    *   **赌博心理**：未知的金额带来了巨大的刺激感。
    *   **话题性**：“我是手气最佳”、“我只抢了 0.01”，引发了群内的疯狂刷屏和讨论。
    *   **传播性**：为了回本或接龙，抢到的人往往会再发一个。

## 3. 关键闭环设计
### 3.1 资金流向的单向陷阱
*   **抢红包**：不需要绑卡。这极大地降低了参与门槛，大爷大妈都能玩。
*   **提现/使用**：当用户抢了几十块钱想提现，或想发红包给别人时，系统提示**“必须绑定银行卡”**。
*   **结果**：用户为了这一笔“意外之财”，主动跨越了最难的“绑卡”门槛。

## 4. 数据表现
*   **除夕夜**：2014年除夕，微信红包参与人数达到 482 万，峰值每分钟 2.5 万个红包被拆开。
*   **绑卡量**：短短几天内，微信支付绑卡量激增数千万（具体数字官方未完全公开，但业界公认是千万级），一举奠定了移动支付双寡头格局。

## 5. 对 PM 的深度启示
1.  **高频打低频**：社交是最高频的场景，支付是相对低频的。把支付嵌入社交，降维打击。
2.  **四两拨千斤**：不要试图改变用户的习惯（教育用户很难），而是要**顺应用户的习惯**（发红包），并用技术手段优化它。
3.  **MVP (最小可行性产品)**：微信红包第一版功能极其简陋，界面甚至有点丑，但核心玩法（抢、随机）验证成功就足以引爆。不要等功能完美了再上线。`
  },
  {
    id: 'c5', title: '抖音：全屏单列流的交互革命', company: 'ByteDance', tag: '交互/算法',
    summary: '抖音为什么能让人一刷就停不下来？解析“全屏单列”背后的心理学与算法逻辑。',
    content: `## 1. 案例背景
在短视频早期，快手采用的是**“双列瀑布流”**设计。用户看到一屏 4 个封面，需要主动点击感兴趣的图才能播放。这是一种“用户拥有选择权”的设计。
抖音上线后，大胆采用了**“全屏单列沉浸式”**设计。

## 2. 核心策略：剥夺选择权 vs 极致推荐
### 2.1 交互设计的心理学
*   **单列流 (抖音)**：
    *   **操作**：用户只需上滑。
    *   **心理**：用户不需要做决策（Decision Fatigue）。"下一个视频是什么"的未知奖励（Variable Reward）像老虎机一样吸引人。
    *   **容错率**：对算法要求极高。如果推荐连续 3 条都不好看，用户就会关掉 App。
*   **双列流 (快手)**：
    *   **操作**：浏览封面 -> 点击 -> 退出 -> 再浏览。
    *   **心理**：用户有掌控感，容错率高（不好看是因为我自己点错了，不是平台傻）。

### 2.2 算法与内容的飞轮
单列流设计逼迫字节跳动把推荐算法做到了极致。
1.  **数据采集**：在全屏模式下，用户的**完播率、停留时长**是极其纯净的反馈数据（不喜欢会立刻划走）。
2.  **快速迭代**：利用海量数据训练模型，精准描绘用户画像。
3.  **分发机制**：中心化分发。优质内容（无论创作者是否有粉丝）会被塞进巨大的流量池，实现“一夜爆红”。

## 3. 功能细节拆解
### 3.1 音乐的魔力
*   **定位**：抖音早期定位为“音乐短视频”。
*   **功能**：强节奏的 BGM 掩盖了画面的瑕疵，让视频看起来更有质感（滤镜+卡点）。音乐成为了内容的记忆点（Meme）。

### 3.2 傻瓜式创作工具
*   **痛点**：视频剪辑门槛高。
*   **解法**：提供大量“同款特效”、“一键成片”模板。降低生产门槛，保证了内容库的充沛。

## 4. 对 PM 的深度启示
1.  **Less is More**：减少用户的操作步骤和决策成本。把“选择”交给机器，让用户享受“懒惰”。
2.  **交互决定数据，数据反哺算法**：产品设计决定了你能收集到什么样的数据。单列流收集的是最直接的喜好反馈。
3.  **供给侧改革**：内容平台不仅要让用户“看得爽”，更要让创作者“做得爽”。工具的易用性决定了生态的繁荣度。`
  },
  {
    id: 'c6', title: '美团外卖：预估送达时间 (ETA) 的魔术', company: 'Meituan', tag: 'LBS/策略',
    summary: '外卖的核心体验不是好吃，而是“准时”。美团如何利用 AI 解决物理世界的复杂调度问题。',
    content: `## 1. 案例背景
外卖业务由三个环节组成：用户下单、商家出餐、骑手配送。
这是一个极度复杂的**动态规划问题**：
*   商家出餐速度不一。
*   骑手身上可能有 5 个单子，路线各不相同。
*   天气、电梯、红绿灯都是变量。
然而，用户只关心一个数字：**“预计几点送到？”** (ETA - Estimated Time of Arrival)。

## 2. 核心策略：超脑调度系统
美团搭建了号称“外卖超级大脑”的智能调度系统。

### 2.1 路径规划 (Routing)
*   **传统导航**：只看路面距离。
*   **外卖导航**：包含“骑手步行”、“等电梯”、“找单元门”的时间。美团通过历史数据，甚至知道某栋楼电梯平均等待时长是 3 分钟。
*   **顺路单合并**：算法实时计算，将方向一致的订单“塞”给同一个骑手，保证运力效率最大化，同时不超时。

### 2.2 商家出餐预测
*   **痛点**：骑手到了，商家还没做好，导致骑手空等（运力浪费）。
*   **解法**：系统根据该商家历史出餐数据、当前订单量，预测出餐时间。告诉骑手：“别急着去，10分钟后再到店”。实现了“到店即取”的理想状态。

## 3. 体验管理策略
### 3.1 预期管理
*   **逻辑**：如果算法算出只需 30 分钟，App 可能会显示“预计 35 分钟送达”。
*   **心理学**：**给用户惊喜**。提前送达是惊喜，准时是本分，迟到是灾难。留出的 5 分钟是系统的 Buffer（缓冲期）。

### 3.2 恶劣天气策略
*   **场景**：暴雨天，运力锐减，订单暴增。
*   **策略**：
    1.  **缩小配送范围**：只送近距离。
    2.  **延长 ETA**：直接提示“预计 60 分钟以上”，劝退非刚需用户。
    3.  **动态加价**：增加配送费补贴骑手。

## 4. 对 PM 的深度启示
1.  **O2O 产品的核心在线下**：线上的界面做得再漂亮，如果线下履约（Delivery）拉胯，产品就是失败的。PM 必须深入一线了解业务细节（如电梯慢、商家慢）。
2.  **预期管理 > 实际性能**：有时候提升技术很难（让骑手飞起来），但管理用户预期相对容易（多报几分钟）。
3.  **数据颗粒度**：数据越细（细到每个小区的门禁位置），算法越准。`
  },
  {
    id: 'c7', title: 'Airbnb：设计驱动的信任体系构建', company: 'Airbnb', tag: '信任设计',
    summary: '如何让房东敢让陌生人住进家里，让房客敢住进陌生人家？Airbnb 用设计解决了共享经济最大的难题——信任。',
    content: `## 1. 案例背景
2008年，Airbnb 刚成立时，没人相信这个模式能成。投资人觉得“让陌生人睡在你家气垫床上”简直是疯了，会有盗窃、破坏甚至人身安全风险。
这是一个典型的**“柠檬市场”**（信息不对称导致劣币驱逐良币）。

## 2. 核心策略：设计建立信任 (Design for Trust)
创始人 Brian Chesky 是设计师出身，他认为信任可以通过产品细节被“设计”出来。

### 2.1 专业摄影服务
*   **问题**：早期房东用手机拍的照片昏暗脏乱，没人敢订。
*   **行动**：创始人亲自租了相机，去纽约挨家挨户帮房东拍精美的广角照片。
*   **结果**：营收瞬间翻倍。**高质量的图片 = 真实 = 信任**。后来 Airbnb 建立了庞大的摄影师网络。

### 2.2 双向评价体系 (Reviews)
*   **机制**：不仅房客评价房东，房东也评价房客。
*   **盲评**：双方都评价完（或过了评价期）才能看到对方的评价。避免了“互刷好评”或“报复性差评”。
*   **作用**：差评是核武器，约束了双方的行为。

### 2.3 身份验证与保险
*   **验证**：强制关联社交账号（Facebook），上传护照。让用户感觉屏幕对面是“真人”。
*   **百万房东保障金**：Airbnb 宣布为财物损失提供最高 100 万美元的赔付。这不仅是保险，更是一次极佳的公关营销，彻底打消了房东的顾虑。

## 3. 对 PM 的深度启示
1.  **颜值即正义**：在 C 端消费决策中，图片的质量直接决定转化率。不要在视觉素材上省钱。
2.  **解决最底层的恐惧**：做平台产品，首先要分析双方最怕什么（怕被骗、怕危险），然后用机制（保险、验证、评价）去覆盖这些恐惧。
3.  **做不一样的事**：创始人亲自去拍照这种“不具备可扩展性”的脏活累活，往往是早期破局的关键。`
  },
  {
    id: 'c8', title: '网易云音乐：在版权红海中靠“情怀”突围', company: 'NetEase', tag: 'UGC/社区',
    summary: '当腾讯音乐垄断版权时，网易云音乐如何通过歌单、评论和算法推荐，开辟出一条“音乐社交”的新路？',
    content: `## 1. 案例背景
2013年入局时，酷狗、QQ音乐已瓜分天下。网易云音乐不仅来晚了，而且版权库（曲库量）远不如对手。
如果拼“搜歌”，网易必死无疑。

## 2. 核心策略：发现与社交
网易云音乐重新定义了听歌的方式：从“搜索模式”（听我想听的）转变为“发现模式”（听我没听过但喜欢的）。

### 2.1 歌单 (Playlist) 为核心
*   **创新**：在此之前，音乐 App 的核心维度是“专辑/歌手”。网易云将“歌单”作为核心架构。
*   **逻辑**：歌单是**以人为中心**的组织方式（如“适合写代码听的电音”）。它打破了歌手的界限，赋予了音乐情感和场景标签。
*   **UGC**：鼓励用户创建歌单，让普通用户变成了“DJ”。

### 2.2 评论区文化
*   **现象**：网易云的评论区被称为“网抑云”，充满了故事、段子和情感宣泄。
*   **产品设计**：
    *   **UI**：播放页将“评论”按钮放得极大，且黑胶唱片的设计营造了沉浸感。
    *   **点赞排序**：神评论被顶到最前，形成了社区氛围。
    *   **结果**：用户听歌时**必看评论**，甚至为了看评论去听歌。评论成为了内容本身的一部分。

### 2.3 个性化推荐
*   **每日推荐**：基于协同过滤算法。用户惊喜地发现“它比我更懂我”。
*   **口碑传播**：用户自发在朋友圈晒“每日推荐”的精准度，形成了病毒传播。

## 3. 对 PM 的深度启示
1.  **红海突围靠差异化**：当核心资源（版权）拼不过巨头时，必须换赛道。从“听歌工具”变成“音乐社区”。
2.  **UGC 的力量**：用户产生的内容（歌单、评论）是独家资产，竞争对手买不走。
3.  **情感连接**：好的产品能引发共鸣。网易云不仅提供音乐，还提供了孤独时的陪伴感。`
  },
  {
    id: 'c9', title: '淘宝双11：高并发下的系统削峰填谷', company: 'Alibaba', tag: '后台/技术',
    summary: '不仅是营销活动，更是技术与产品的巅峰配合。如何处理零点每秒数十万笔的交易请求？',
    content: `## 1. 案例背景
双 11 零点，数亿用户同时点击“立即购买”。流量如海啸般涌入，数据库瞬间压力超过日常 100 倍。
如果系统崩溃，不仅损失几百亿交易额，更会重创用户信任。

## 2. 核心策略：削峰填谷 (Peak Shaving)
既然无法瞬间处理所有请求，那就想办法把洪峰“摊平”。

### 2.1 预售机制 (Pre-sale)
*   **玩法**：10月20日开始付定金，11月11日付尾款。
*   **技术价值**：
    *   **库存锁定**：提前半个月完成了最耗数据库性能的“锁库存”操作。
    *   **分流**：将支付压力分摊到了定金支付期和尾款支付期。

### 2.2 服务降级 (Degradation)
*   **逻辑**：在资源有限的情况下，丢车保帅。
*   **产品表现**：
    *   零点高峰期，**关闭“修改地址”、“确认收货”、“评价”功能**。只保留“浏览-下单-支付”核心链路。
    *   前端显示“排队中，请稍后”，而不是直接报错“502 Bad Gateway”。

### 2.3 购物车逻辑优化
*   **合并支付**：允许跨店合并支付，减少请求次数。
*   **缓存策略**：商品详情页在 CDN 层面做静态缓存，甚至价格都是静态的（下单时再校验最新价格），减少回源查询。

## 3. 对 PM 的深度启示
1.  **产品与技术不分家**：PM 设计活动规则时（如预售），必须考虑对技术架构的压力。预售不仅是为了营销，更是为了救系统的命。
2.  **有损服务**：在极端情况下，牺牲非核心体验（不能改地址）来保核心体验（能买到）是必要的取舍。
3.  **用户反馈设计**：系统慢时，用优雅的 Loading 动画或排队文案安抚用户，比冷冰冰的错误代码强一万倍。`
  },
  {
    id: 'c10', title: 'Zoom：在红海中靠极致性能突围', company: 'Zoom', tag: 'SaaS/体验',
    summary: '视频会议市场早有 Skype、Cisco、Google 等巨头。Zoom 凭什么能后来居上？答案是：不卡。',
    content: `## 1. 案例背景
在 Zoom 之前，视频会议体验很差：安装麻烦、需要专线网络、画质卡顿、音画不同步。
企业用户虽然痛恨旧软件，但习惯了忍受。

## 2. 核心策略：视频优先的底层架构
创始人袁征（Eric Yuan）从 WebEx 出来，深知旧架构的弊端。Zoom 从底层重写了代码。

### 2.1 弱网优化
*   **策略**：**音频优先**。当网络带宽不足时，Zoom 会优先保证声音清晰流畅，哪怕画面变成马赛克，甚至暂停画面。
*   **场景**：开会时，只要能听到对方说话，会议就能继续；如果听不清，会议就瘫痪了。
*   **丢包补偿**：即使丢包率达到 40%，Zoom 依然能保持可用。

### 2.2 PLG (Product-Led Growth) 模式
*   **病毒传播**：参会者**无需注册账号**，点击链接即可入会。这极大地降低了使用门槛，让 Zoom 迅速在外部合作伙伴中裂变。
*   **Freemium**：免费版可以使用 40 分钟。这足够体验到产品的爽快，但开长会（刚需）必须付费。40 分钟是一个经过精密计算的“付费墙”。

### 2.3 易用性细节
*   **美颜功能**：让在家办公（不洗头）的用户敢于开摄像头。
*   **虚拟背景**：保护隐私，隐藏乱糟糟的房间。

## 3. 对 PM 的深度启示
1.  **性能也是功能**：在基础设施类产品中，快、稳、不卡就是最大的 Feature。
2.  **抓住核心矛盾**：视频会议的核心矛盾是“沟通不中断”，而不是“画质4K”。为了核心目标，可以牺牲次要指标。
3.  **降低摩擦**：让用户“无需注册”就能使用核心功能，是 SaaS 产品实现病毒增长的关键。`
  },
  {
    id: 'c11', title: '小红书：种草经济与去中心化分发', company: 'Xiaohongshu', tag: '内容电商',
    summary: '如何从一个海淘攻略 PDF 演变成中国年轻人的生活方式百科全书？',
    content: `## 1. 案例背景
小红书最早是一份 PDF 格式的《美国购物指南》。后来转型社区，早期用户多为高净值女性。
挑战在于：如何破圈？如何避免成为广告垃圾场？

## 2. 核心策略：有用性 (Utility) 与重视觉
### 2.1 种草 (Seeding)
*   **定义**：不仅仅是展示，而是提供决策依据。笔记通常包含“怎么买、多少钱、好在哪、避坑指南”。
*   **搜索价值**：小红书逐渐取代百度，成为年轻人搜索“怎么穿搭、怎么做饭、哪里好玩”的第一入口。

### 2.2 双列瀑布流 + 强视觉
*   **设计**：首页采用双列流。图片占比极大。
*   **逻辑**：逼迫创作者把**封面图**和**标题**做到极致。高颜值的图片构成了小红书独特的社区调性（Ins风）。

### 2.3 去中心化分发 (CES 评分)**
*   **算法**：笔记发布后，先推给几百人的小流量池。如果互动率（点赞+收藏+评论）高，再推给更多人。
*   **素人机会**：即使你粉丝为 0，只要内容好，一样能出爆款。这激励了普通用户分享真实体验，而不是只有网红霸屏。

## 3. 商业闭环
*   **B2K2C**：品牌方 (Brand) -> 关键意见领袖 (KOC) -> 消费者 (Consumer)。
*   **真实性挑战**：随着商业化加深，虚假种草泛滥。小红书不得不重拳治理“代写”，强调“真诚分享”，因为**信任是种草社区的基石**。

## 4. 对 PM 的深度启示
1.  **社区调性是管出来的**：小红书严格的审核和流量导向，维持了其“精致”的调性。
2.  **搜索即需求**：关注用户的搜索词，那是用户最直接的需求表达。把社区做成百科全书，价值巨大。`
  },
  {
    id: 'c12', title: 'Bilibili：高门槛准入维护社区纯洁性', company: 'Bilibili', tag: '二次元/社区',
    summary: '在追求用户增长的互联网大潮中，B站反其道而行之，设置超高难度的注册考试。这是为什么？',
    content: `## 1. 案例背景
B站早期是二次元亚文化社区。这类社区最怕“小学生”（低龄、不守规矩的用户）和“现充”（主流人群）涌入，破坏原有的讨论氛围（如乱发弹幕、不懂梗）。
社区氛围一旦稀释，核心用户就会流失，社区也就死了。

## 2. 核心策略：会员考试制
### 2.1 100 道题的准入考试
*   **机制**：注册 B 站正式会员，必须在 60 分钟内答对 100 道题（包含弹幕礼仪和极难的动漫知识）。且不能百度（时间紧）。
*   **目的**：
    1.  **筛选**：证明你是“自己人”（懂二次元）。
    2.  **教育**：强制学习弹幕礼仪（如“不刷屏”、“不剧透”）。
    3.  **仪式感**：付出成本通过的考试，会让用户更珍惜账号，更有归属感。

### 2.2 弹幕 (Danmaku) 体验
*   **共时性**：弹幕创造了一种“跨越时空与人一起看片”的错觉。高能预警、空耳、科普弹幕，极大地丰富了视频内容。
*   **管理**：通过举报和屏蔽机制，让社区自治。

## 3. 破圈与增长
随着上市压力，B 站降低了考试难度，引入生活、知识区内容。
*   **冲突**：老用户觉得“B站变味了”。
*   **平衡**：通过分区运营，让不同圈层的人互不打扰（二次元看番，现充看生活区）。

## 4. 对 PM 的深度启示
1.  **增长不一定是好事**：对于垂直社区，过快的增长往往意味着死亡。设立门槛（注册限制、邀请码）是保护社区氛围的必要手段。
2.  **共鸣感**：弹幕的本质是情感共鸣。产品要提供让用户表达共鸣的通道。`
  },
  {
    id: 'c13', title: 'Uber：动态溢价 (Surge Pricing) 的经济学', company: 'Uber', tag: '经济模型',
    summary: 'Uber 不仅是打车软件，更是一个实时调配的劳动力市场。动态溢价如何平衡供需？',
    content: `## 1. 案例背景
每逢周五晚高峰或暴雨天，打车需求暴增。传统出租车价格固定，导致供给（司机）没有动力增加，结果就是**谁也打不到车**。
这是一种市场的失灵。

## 2. 核心策略：动态定价
Uber 引入了即时的价格波动机制。
*   **当 需求 >> 供给**：区域变成红色，价格 x1.5, x2.0 甚至 x5.0。
*   **供给侧反应**：在家里休息的司机看到价格翻倍，纷纷出门接单；在其他区域的司机开车赶往高价区。**供给增加了**。
*   **需求侧反应**：觉得太贵不急着走的人选择坐地铁或晚点走。**需求减少了**。
*   **结果**：供需在新的价格点上达到了平衡（Market Equilibrium）。真正急需用车且愿付费的人一定能打到车。

## 3. 产品设计挑战
*   **用户愤怒**：用户讨厌涨价。
*   **透明度**：Uber 必须在界面上用巨大的字体提示“当前价格是平时的 2.1 倍”，并要求用户输入倍数确认。
*   **雷电符号**：用 UI 符号告知用户当前是特殊状态，而非平台乱收费。

## 4. 对 PM 的深度启示
1.  **用市场手段解决产品问题**：很多时候资源不足不是技术问题，是经济问题。价格是调节供需最有效的杠杆。
2.  **透明即信任**：涨价可以，但必须以此换取更好的服务（肯定能打到车），且必须由用户知情选择。`
  },
  {
    id: 'c14', title: 'Spotify：Freemium 模式的教科书', company: 'Spotify', tag: '商业模式',
    summary: '在盗版横行的年代，Spotify 如何让用户心甘情愿地为音乐付费？',
    content: `## 1. 案例背景
21世纪初，Napster 等盗版下载猖獗。用户习惯了免费。iTunes 虽然好，但按首付费太贵。

## 2. 核心策略：Freemium (免费+增值)
Spotify 创造了一种全新的体验分层。

### 2.1 免费版 (Free) - 作为钩子
*   **权益**：可以听所有歌（曲库不阉割）。
*   **限制**：
    *   **强制广告**：每几首歌插播音频广告。
    *   **随机播放**：手机端不能点播特定歌曲，只能 Shuffle。
    *   **切歌限制**：每小时只能跳过 6 次。
*   **体验**：足够好用（能听到歌），但不够爽（受限制）。

### 2.2 付费版 (Premium) - 解放体验
*   **卖点**：无广告、无限切歌、离线下载、高音质。
*   **转化逻辑**：用户在免费版建立了播放列表，养成了使用习惯。当“不能切歌”的痛苦积累到一定程度，或者为了坐飞机听歌（离线），就会付费。

## 3. 对 PM 的深度启示
1.  **阉割体验，不阉割内容**：Spotify 免费版能听周杰伦，只是体验差一点。这保证了免费用户也能留下来成为潜在客户。如果免费版听不到热门歌，用户直接就走了。
2.  **习惯养成**：SaaS 产品的转化往往发生在用户产生依赖之后。先让用户“上车”，再考虑“买票”。`
  },
  {
    id: 'c15', title: 'Slack：将工作流整合进聊天框', company: 'Slack', tag: 'SaaS/工具',
    summary: 'Slack 并不是因为“聊天”做得好而成功的，而是因为它成为了“工作操作系统的中枢”。',
    content: `## 1. 案例背景
企业内部充斥着各种工具：邮件、Jira（项目管理）、GitHub（代码）、Zendesk（客服）。信息分散在各个孤岛，员工需要在十几个网页间切换。

## 2. 核心策略：集成 (Integration) 与 机器人 (Bot)
Slack 提出“ChatOps”概念。
*   **消息聚合**：代码提交了、服务器报警了、新工单来了，全部推送到 Slack 的特定频道 (Channel)。
*   **交互**：用户甚至可以直接在 Slack 里点击按钮“批准部署”或“关闭工单”，无需跳转。

### 2.1 极致的体验
*   **搜索**：Slack 的搜索极快，支持模糊匹配。
*   **表情回应 (Reaction)**：用 Emoji 回复消息（如 👍、✅），减少了“收到”、“好的”这种无效刷屏，保持了信道的纯净。

## 3. 对 PM 的深度启示
1.  **做连接器**：在 B 端产品中，能连接上下游工具的产品价值倍增。
2.  **减少噪音**：办公软件要克制通知。Slack 的表情回应功能极大地降低了信息噪音，是体验设计的典范。`
  }
];

export const Requirements: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('prd');
  const [activeStepId, setActiveStepId] = useState<string>('');
  const [activeCaseId, setActiveCaseId] = useState<string>(CASE_STUDIES[0].id);
  const [aiInput, setAiInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // 初始化 activeStepId
  React.useEffect(() => {
    if (activeTab === 'prd') setActiveStepId(PRD_STEPS[0].id);
    if (activeTab === 'brd') setActiveStepId(BRD_STEPS[0].id);
    if (activeTab === 'comp') setActiveStepId(COMP_STEPS[0].id);
  }, [activeTab]);

  const currentSteps = activeTab === 'prd' ? PRD_STEPS : (activeTab === 'brd' ? BRD_STEPS : COMP_STEPS);
  const activeStep = currentSteps.find(s => s.id === activeStepId) || currentSteps[0];
  const activeCase = CASE_STUDIES.find(c => c.id === activeCaseId) || CASE_STUDIES[0];

  const handleAiGenerate = async () => {
    if (!aiInput.trim()) return;
    setIsLoading(true);
    setAiOutput(''); 
    
    const fullPrompt = `${activeStep.aiPromptTemplate.replace(/\[.*?\]/, aiInput)} 
    请使用清晰的 Markdown 格式输出。请用中文回答。`;

    try {
      const result = await generatePMAdvice(fullPrompt, 'requirements');
      setAiOutput(result);
    } catch (e) {
      setAiOutput("AI 生成失败，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-[1400px] mx-auto animate-fade-in">
      
      {/* --- Top Segmented Control --- */}
      <div className="flex justify-center mb-6 px-4">
        <div className="bg-slate-200/80 p-1.5 rounded-xl flex space-x-1 shadow-inner overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('prd')}
            className={`px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${activeTab === 'prd' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <FileText size={16} /> <span className="hidden md:inline">PRD 撰写</span><span className="md:hidden">PRD</span>
          </button>
          <button
            onClick={() => setActiveTab('brd')}
            className={`px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${activeTab === 'brd' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Briefcase size={16} /> <span className="hidden md:inline">BRD 撰写</span><span className="md:hidden">BRD</span>
          </button>
          <button
            onClick={() => setActiveTab('comp')}
            className={`px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${activeTab === 'comp' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Swords size={16} /> <span className="hidden md:inline">竞品分析</span><span className="md:hidden">竞品</span>
          </button>
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${activeTab === 'cases' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <BookMarked size={16} /> <span className="hidden md:inline">大厂实战案例</span><span className="md:hidden">案例</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 items-start overflow-hidden px-4 md:px-0">
        
        {/* --- Left Column: Navigation --- */}
        <div className="w-80 flex-shrink-0 bg-white rounded-3xl shadow-apple border border-slate-100 overflow-hidden flex flex-col h-full hidden md:flex">
          {activeTab === 'cases' ? (
             // Case List
             <>
               <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-[#1d1d1f] flex items-center gap-2">
                  <BookOpen size={20} className="text-orange-500" />
                  案例库
                </h2>
                <p className="text-xs text-slate-500 mt-1">15+ 互联网经典深度解析</p>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {CASE_STUDIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCaseId(c.id)}
                    className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-200 group ${
                      activeCaseId === c.id ? 'bg-orange-500 text-white shadow-md' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-sm font-bold truncate">{c.title}</div>
                    <div className={`text-xs mt-1.5 flex justify-between items-center ${activeCaseId === c.id ? 'text-orange-100' : 'text-slate-400'}`}>
                      <span className="font-medium">{c.company}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeCaseId === c.id ? 'bg-white/20' : 'bg-slate-100'}`}>{c.tag}</span>
                    </div>
                  </button>
                ))}
              </div>
             </>
          ) : (
            // Steps List (PRD/BRD/COMP)
            <>
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-[#1d1d1f] flex items-center gap-2">
                  {activeTab === 'prd' && <FileText size={20} className="text-[#0071e3]" />}
                  {activeTab === 'brd' && <Briefcase size={20} className="text-purple-600" />}
                  {activeTab === 'comp' && <Swords size={20} className="text-rose-500" />}
                  
                  {activeTab === 'prd' ? 'PRD 标准流程' : (activeTab === 'brd' ? 'BRD 商业立项' : '竞品分析 SOP')}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {activeTab === 'prd' ? '产品需求文档撰写指南' : (activeTab === 'brd' ? '商业需求分析与立项书' : '知己知彼，百战不殆')}
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                {currentSteps.map((step) => {
                  const Icon = step.icon;
                  const isActive = activeStepId === step.id;
                  
                  let activeBg = 'bg-[#0071e3]';
                  let activeText = 'text-blue-100';
                  if (activeTab === 'brd') { activeBg = 'bg-purple-600'; activeText = 'text-purple-100'; }
                  if (activeTab === 'comp') { activeBg = 'bg-rose-500'; activeText = 'text-rose-100'; }
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                          setActiveStepId(step.id);
                          setAiOutput('');
                          setAiInput('');
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-200 group ${
                        isActive 
                          ? `${activeBg} text-white shadow-md` 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
                        <div>
                          <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-[#1d1d1f]'}`}>
                            {step.title}
                          </div>
                          <div className={`text-[10px] ${isActive ? activeText : 'text-slate-400'}`}>
                            {step.subtitle}
                          </div>
                        </div>
                      </div>
                      {isActive && <ChevronRight size={14} className="text-white/80" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* --- Right Column: Content --- */}
        <div className="flex-1 h-full bg-white rounded-3xl shadow-apple border border-slate-100 flex flex-col overflow-hidden">
          
          {activeTab === 'cases' ? (
            // Case Detail View
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="max-w-3xl mx-auto p-8 md:p-12">
                <div className="mb-8 pb-8 border-b border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                       {activeCase.company.slice(0, 2).toUpperCase()}
                     </div>
                     <div>
                       <h1 className="text-3xl md:text-4xl font-bold text-[#1d1d1f] leading-tight">
                         {activeCase.title}
                       </h1>
                       <div className="flex items-center gap-3 mt-2">
                          <span className="text-slate-500 text-sm font-medium">@ {activeCase.company}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                            {activeCase.tag}
                          </span>
                       </div>
                     </div>
                  </div>
                  
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-lg text-slate-600 font-medium leading-relaxed italic">
                      “ {activeCase.summary} ”
                    </p>
                  </div>
                </div>
                
                <article className="prose prose-lg prose-slate max-w-none">
                  {/* 使用 Markdown 渲染样式，针对 h2, h3 做特殊处理 */}
                  <div className="whitespace-pre-wrap font-serif text-slate-700 leading-8">
                    {activeCase.content.split('\n').map((line, idx) => {
                      if (line.startsWith('## ')) {
                        return <h2 key={idx} className="text-2xl font-bold text-[#1d1d1f] mt-10 mb-4 pb-2 border-b border-slate-100">{line.replace('## ', '')}</h2>
                      }
                      if (line.startsWith('### ')) {
                        return <h3 key={idx} className="text-xl font-bold text-[#1d1d1f] mt-8 mb-3">{line.replace('### ', '')}</h3>
                      }
                      if (line.startsWith('* ')) {
                         return <li key={idx} className="ml-4 list-disc marker:text-slate-400 pl-1 mb-1">{line.replace('* ', '')}</li>
                      }
                       if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
                         return <div key={idx} className="mb-2 font-medium text-slate-800">{line}</div>
                      }
                      return <p key={idx} className="mb-4 text-[17px]">{line}</p>
                    })}
                  </div>
                </article>

                 <div className="mt-16 pt-8 border-t border-slate-100 text-center">
                    <button className="bg-[#1d1d1f] text-white px-8 py-3 rounded-full font-medium hover:scale-105 transition-transform shadow-lg">
                      收藏该案例
                    </button>
                 </div>
              </div>
            </div>
          ) : (
            // PRD/BRD/COMP View
            <>
              {/* Content Header */}
              <div className="px-8 py-6 border-b border-slate-100 bg-white sticky top-0 z-10 flex justify-between items-center bg-opacity-90 backdrop-blur-sm">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-[#1d1d1f] flex items-center gap-3">
                    {activeTab === 'prd' && <FileText className="text-[#0071e3]" />}
                    {activeTab === 'brd' && <Briefcase className="text-purple-600" />}
                    {activeTab === 'comp' && <Swords className="text-rose-500" />}
                    {activeStep.title}
                  </h1>
                  <p className="text-slate-500 mt-1 text-sm">{activeStep.subtitle}</p>
                </div>
              </div>

              {/* Content Scroll Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-10">
                  
                  {/* Guide */}
                  <section className="space-y-4 animate-fade-in">
                    <div className="flex items-center gap-2 text-[#1d1d1f] font-semibold text-lg">
                      <Lightbulb size={20} className="text-yellow-500" />
                      <h3>写作指南</h3>
                    </div>
                    <div className="p-5 bg-yellow-50/50 rounded-2xl border border-yellow-100 text-slate-700 leading-relaxed text-sm">
                      {activeStep.guide}
                    </div>
                  </section>

                  {/* Template */}
                  <section className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between text-[#1d1d1f] font-semibold text-lg">
                      <div className="flex items-center gap-2">
                          <LayoutList size={20} className="text-slate-500" />
                          <h3>参考模板</h3>
                      </div>
                      <button 
                          onClick={() => handleCopy(activeStep.template)}
                          className="text-xs font-normal bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full text-slate-600 flex items-center gap-1 transition-colors"
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? '已复制' : '复制模板'}
                      </button>
                    </div>
                    <div className="p-6 bg-slate-900 rounded-2xl text-slate-300 font-mono text-sm leading-relaxed overflow-x-auto shadow-inner relative group">
                      <pre className="whitespace-pre-wrap">{activeStep.template}</pre>
                    </div>
                  </section>

                  {/* AI Tool */}
                  <section className="space-y-4 pt-6 border-t border-slate-100 animate-fade-in">
                    <div className={`flex items-center gap-2 font-semibold text-lg ${
                        activeTab === 'prd' ? 'text-[#0071e3]' : (activeTab === 'brd' ? 'text-purple-600' : 'text-rose-500')
                    }`}>
                      <Sparkles size={20} />
                      <h3>AI 智能辅助</h3>
                    </div>
                    
                    <div className={`p-6 rounded-3xl border ${
                        activeTab === 'prd' ? 'bg-blue-50/50 border-blue-100' : (activeTab === 'brd' ? 'bg-purple-50/50 border-purple-100' : 'bg-rose-50/50 border-rose-100')
                    }`}>
                      <p className="text-sm text-slate-600 mb-4 font-medium">
                          输入你的关键词，AI 将自动为你生成本章节的草稿内容。
                      </p>
                      <div className="flex gap-3 mb-4 flex-col sm:flex-row">
                        <input
                          type="text"
                          value={aiInput}
                          onChange={(e) => setAiInput(e.target.value)}
                          placeholder={activeTab === 'comp' ? "输入竞品名称 (如: 抖音 vs 快手)" : "输入功能/项目名称"}
                          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-opacity-50 outline-none bg-white shadow-sm"
                          onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                        />
                        <button
                          onClick={handleAiGenerate}
                          disabled={isLoading || !aiInput}
                          className={`text-white px-6 py-3 rounded-xl font-medium shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap
                            ${activeTab === 'prd' ? 'bg-[#0071e3] hover:bg-[#0077ed]' : (activeTab === 'brd' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-rose-500 hover:bg-rose-600')}
                          `}
                        >
                          {isLoading ? <span className="animate-spin">⌛</span> : <Sparkles size={18} />}
                          生成内容
                        </button>
                      </div>

                      {aiOutput && (
                        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm animate-scale-in relative group">
                          <button 
                              onClick={() => handleCopy(aiOutput)}
                              className="absolute top-4 right-4 p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                              {copied ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                          <div className="prose prose-sm prose-slate max-w-none">
                            <div className="whitespace-pre-wrap">{aiOutput}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                  
                  <div className="h-20"></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
