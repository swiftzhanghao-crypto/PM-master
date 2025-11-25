
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { BarChart2, TrendingUp, Users, Database, Code2, Play, Terminal } from 'lucide-react';

const retentionData = [
  { day: 'Day 0', rate: 100 },
  { day: 'Day 1', rate: 45 },
  { day: 'Day 3', rate: 30 },
  { day: 'Day 7', rate: 25 },
  { day: 'Day 14', rate: 20 },
  { day: 'Day 30', rate: 18 },
];

const acquisitionData = [
  { source: '自然搜索', users: 4000 },
  { source: '广告投放', users: 2400 },
  { source: '社媒', users: 1800 },
  { source: '推荐', users: 980 },
];

const funnelData = [
  { stage: '浏览首页', count: 10000 },
  { stage: '查看商品', count: 4500 },
  { stage: '加入购物车', count: 1200 },
  { stage: '开始结算', count: 800 },
  { stage: '支付成功', count: 350 },
];

export const DataAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'business' | 'tech'>('business');

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <BarChart2 className="text-brand-500" size={32} />
            数据分析能力
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
             从业务指标监控到底层数据挖掘。
          </p>
        </div>
        
        {/* Tabs */}
        <div className="bg-slate-200/80 p-1 rounded-xl flex space-x-1 shadow-inner">
          <button
            onClick={() => setActiveTab('business')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === 'business' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <TrendingUp size={16} /> 业务分析思维
          </button>
          <button
            onClick={() => setActiveTab('tech')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === 'tech' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Terminal size={16} /> 硬技能 (SQL/Python)
          </button>
        </div>
      </div>

      {/* --- Business Tab Content --- */}
      {activeTab === 'business' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Retention Chart */}
            <div className="bg-white p-8 rounded-3xl shadow-apple border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-500" />
                    留存曲线 (Retention)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">衡量产品是否具有 PMF (Product-Market Fit)</p>
                </div>
                <span className="text-xs font-mono bg-blue-50 text-blue-600 px-3 py-1 rounded-full">群组: 10月</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={retentionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} unit="%" axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                    <Line type="monotone" dataKey="rate" stroke="#0071e3" strokeWidth={4} dot={{r: 4, fill: '#0071e3', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 bg-slate-50 p-4 rounded-xl text-sm text-slate-600 leading-relaxed">
                <strong>分析洞察：</strong> 曲线在 Day 7 后趋于平缓（Smiling Curve）。如果 Day 30 留存率能维持在 20% 以上，说明核心用户群已稳固。
              </div>
            </div>

            {/* Funnel Chart */}
            <div className="bg-white p-8 rounded-3xl shadow-apple border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <Users size={20} className="text-orange-500" />
                    转化漏斗 (Funnel)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">识别用户流失最严重的环节</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="stage" type="category" width={80} tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px'}} />
                    <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} barSize={24} background={{ fill: '#f8fafc' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
               <div className="mt-6 bg-orange-50 p-4 rounded-xl text-sm text-orange-800 leading-relaxed">
                <strong>分析洞察：</strong> “加入购物车”到“开始结算”流失率最高 (33%)。建议优化购物车页面的价格展示和促销提示。
              </div>
            </div>
          </div>

          {/* Acquisition Grid */}
          <div className="bg-white p-8 rounded-3xl shadow-apple border border-slate-100">
             <div className="flex items-center justify-between mb-6">
                 <h3 className="font-bold text-slate-800 text-lg">A/B 测试实验记录</h3>
                 <button className="text-sm text-blue-600 font-medium hover:underline">查看所有实验</button>
             </div>
             <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                     <thead>
                         <tr className="text-xs text-slate-400 border-b border-slate-100">
                             <th className="py-3 font-medium">实验名称</th>
                             <th className="py-3 font-medium">对照组 (A)</th>
                             <th className="py-3 font-medium">实验组 (B)</th>
                             <th className="py-3 font-medium">置信度</th>
                             <th className="py-3 font-medium text-right">结果</th>
                         </tr>
                     </thead>
                     <tbody className="text-sm">
                         <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                             <td className="py-4 font-medium text-slate-700">新版注册页文案</td>
                             <td className="py-4 text-slate-500">转化率 12.5%</td>
                             <td className="py-4 text-green-600 font-semibold">转化率 14.8%</td>
                             <td className="py-4 text-slate-500">95%</td>
                             <td className="py-4 text-right"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">显著提升</span></td>
                         </tr>
                         <tr className="hover:bg-slate-50/50">
                             <td className="py-4 font-medium text-slate-700">蓝色购买按钮</td>
                             <td className="py-4 text-slate-500">点击率 3.2%</td>
                             <td className="py-4 text-slate-500">点击率 3.1%</td>
                             <td className="py-4 text-slate-500">60%</td>
                             <td className="py-4 text-right"><span className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-xs font-bold">无差异</span></td>
                         </tr>
                     </tbody>
                 </table>
             </div>
          </div>
        </div>
      )}

      {/* --- Tech Tab Content (Hard Skills) --- */}
      {activeTab === 'tech' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* SQL Section */}
          <section className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
             <div className="bg-slate-800 px-6 py-4 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-2 text-white font-bold">
                    <Database size={20} className="text-purple-400" />
                    <h3>SQL 核心语法 (Structured Query Language)</h3>
                </div>
                <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2">
                 <div className="p-8 border-r border-slate-700 text-slate-300 space-y-6">
                    <div>
                        <h4 className="text-white font-semibold mb-2">1. 基础查询 (SELECT)</h4>
                        <p className="text-sm text-slate-400 mb-2">从 `users` 表中筛选出最近注册的活跃用户。</p>
                        <div className="bg-black/50 p-4 rounded-xl font-mono text-sm border border-slate-700">
                            <span className="text-purple-400">SELECT</span> user_id, email, last_login <br/>
                            <span className="text-purple-400">FROM</span> users <br/>
                            <span className="text-purple-400">WHERE</span> status = <span className="text-green-400">'active'</span> <br/>
                            <span className="text-purple-400">AND</span> created_at > <span className="text-green-400">'2023-01-01'</span><br/>
                            <span className="text-purple-400">ORDER BY</span> created_at <span className="text-purple-400">DESC</span>;
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-2">2. 多表关联 (LEFT JOIN)</h4>
                        <p className="text-sm text-slate-400 mb-2">统计每个用户的订单总数（包括没有订单的用户）。</p>
                        <div className="bg-black/50 p-4 rounded-xl font-mono text-sm border border-slate-700">
                            <span className="text-purple-400">SELECT</span> u.name, <span className="text-yellow-400">COUNT</span>(o.id) as order_count <br/>
                            <span className="text-purple-400">FROM</span> users u <br/>
                            <span className="text-purple-400">LEFT JOIN</span> orders o <span className="text-purple-400">ON</span> u.id = o.user_id <br/>
                            <span className="text-purple-400">GROUP BY</span> u.id;
                        </div>
                    </div>
                 </div>

                 <div className="p-8 bg-slate-800/50">
                    <h4 className="text-white font-semibold mb-4">PM 常用 SQL 速查表</h4>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 text-sm">
                            <code className="text-yellow-400 font-mono bg-white/5 px-1.5 rounded">DISTINCT</code>
                            <span className="text-slate-400">数据去重。计算 UV 时常用 `COUNT(DISTINCT user_id)`。</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                            <code className="text-yellow-400 font-mono bg-white/5 px-1.5 rounded">GROUP BY</code>
                            <span className="text-slate-400">分组聚合。按日期、城市、渠道分组统计数据。</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                            <code className="text-yellow-400 font-mono bg-white/5 px-1.5 rounded">HAVING</code>
                            <span className="text-slate-400">对聚合后的结果进行筛选（如筛选订单数>10的用户）。</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                            <code className="text-yellow-400 font-mono bg-white/5 px-1.5 rounded">LIKE</code>
                            <span className="text-slate-400">模糊匹配。`WHERE name LIKE '%测试%'`。</span>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-700">
                         <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                             <Play size={16} fill="currentColor" />
                             进入 SQL 模拟练习场 (Sandbox)
                         </button>
                    </div>
                 </div>
             </div>
          </section>

          {/* Python Section */}
          <section className="bg-white rounded-3xl overflow-hidden shadow-apple border border-slate-200">
             <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-200">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <Code2 size={20} className="text-blue-600" />
                    <h3>Python 数据分析 (Pandas)</h3>
                </div>
             </div>
             
             <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <h4 className="font-bold text-slate-800">为什么 PM 要学 Python?</h4>
                    <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex gap-2">
                            <span className="text-blue-500 font-bold">•</span>
                            处理 Excel 无法打开的千万级行数据。
                        </li>
                        <li className="flex gap-2">
                            <span className="text-blue-500 font-bold">•</span>
                            自动化重复报表（自动发邮件）。
                        </li>
                        <li className="flex gap-2">
                            <span className="text-blue-500 font-bold">•</span>
                            进行复杂的统计分析和机器学习预测。
                        </li>
                    </ul>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h5 className="font-bold text-slate-700 mb-2 text-sm">Pandas 常用操作</h5>
                         <div className="font-mono text-xs text-slate-600 space-y-2">
                             <p><span className="text-blue-600">import</span> pandas <span className="text-blue-600">as</span> pd</p>
                             <p><span className="text-green-600"># 读取 CSV</span></p>
                             <p>df = pd.read_csv(<span className="text-red-500">'data.csv'</span>)</p>
                             <p><span className="text-green-600"># 数据透视表</span></p>
                             <p>table = df.pivot_table(index=<span className="text-red-500">'date'</span>, values=<span className="text-red-500">'revenue'</span>, aggfunc=<span className="text-red-500">'sum'</span>)</p>
                         </div>
                    </div>
                 </div>

                 <div className="bg-[#1e1e1e] rounded-xl p-6 text-slate-300 font-mono text-sm relative group overflow-hidden shadow-inner">
                    <div className="absolute top-2 right-2 text-xs text-slate-500">main.py</div>
                    <pre className="language-python">
<span className="text-pink-400">import</span> pandas <span className="text-pink-400">as</span> pd
<span className="text-pink-400">import</span> matplotlib.pyplot <span className="text-pink-400">as</span> plt

<span className="text-green-400"># 1. 加载销售数据</span>
df = pd.read_csv(<span className="text-yellow-300">'sales_2024.csv'</span>)

<span className="text-green-400"># 2. 清洗数据：去除空值</span>
df = df.dropna()

<span className="text-green-400"># 3. 按月份分析总销售额</span>
monthly_sales = df.groupby(<span className="text-yellow-300">'month'</span>)[<span className="text-yellow-300">'amount'</span>].sum()

<span className="text-green-400"># 4. 可视化趋势</span>
monthly_sales.plot(kind=<span className="text-yellow-300">'line'</span>, title=<span className="text-yellow-300">'Monthly Revenue'</span>)
plt.show()
                    </pre>
                 </div>
             </div>
          </section>

        </div>
      )}
    </div>
  );
};
