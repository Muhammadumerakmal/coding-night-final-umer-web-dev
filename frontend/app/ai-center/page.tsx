'use client';

import Link from 'next/link';

export default function AiCenterPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-white/40 hover:text-white text-sm transition-colors block mb-6">← Dashboard</Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
             <span className="text-violet-500">✦</span> AI Insights Hub
          </h1>
          <p className="text-white/40 text-sm mt-2">Platform trends and smart matching analytics.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Trending Topics */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
             <h2 className="text-lg font-bold text-white mb-4">📈 Trending Topics</h2>
             <div className="space-y-4">
                {[
                  { tag: "React", count: 420 },
                  { tag: "Authentication", count: 315 },
                  { tag: "UI/UX", count: 280 },
                  { tag: "Database Design", count: 195 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                     <span className="text-sm font-medium text-white/70">#{item.tag}</span>
                     <div className="flex items-center gap-3">
                        <div className="w-32 h-2 rounded-full bg-white/5 overflow-hidden">
                           <div className="h-full bg-violet-500" style={{ width: `${(item.count/500)*100}%` }}></div>
                        </div>
                        <span className="text-xs text-white/40">{item.count} reqs</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* AI Match Rate */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-600/10 to-cyan-600/10 border border-violet-500/20">
             <h2 className="text-lg font-bold text-white mb-4">🎯 AI Matching Efficiency</h2>
             <div className="flex items-center justify-center py-6">
                <div className="relative w-40 h-40 flex items-center justify-center">
                   <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                     <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                     <circle cx="80" cy="80" r="70" fill="none" stroke="url(#gradient)" strokeWidth="12" strokeDasharray="440" strokeDashoffset="60" strokeLinecap="round" />
                     <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                           <stop offset="0%" stopColor="#8b5cf6" />
                           <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                     </defs>
                   </svg>
                   <div className="text-center">
                     <div className="text-3xl font-bold text-white">86%</div>
                     <div className="text-xs text-white/50">Match Rate</div>
                   </div>
                </div>
             </div>
             <p className="text-center text-sm text-white/60">86% of requests are answered within 10 minutes by AI suggested helpers.</p>
          </div>

          {/* AI Skill Gap Analysis */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 md:col-span-2">
             <h2 className="text-lg font-bold text-white mb-4">🔍 Community Skill Gaps</h2>
             <p className="text-sm text-white/50 mb-4">We are seeing a high volume of requests but a low number of available helpers in these areas.</p>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: "Web3 / Solidity", severity: "High Demand" },
                  { title: "Rust Programming", severity: "Medium Demand" },
                  { title: "Advanced DevOps", severity: "Medium Demand" },
                ].map((gap, i) => (
                   <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 border-l-4 border-l-orange-500/50">
                      <div className="text-sm font-bold text-white mb-1">{gap.title}</div>
                      <div className="text-xs text-orange-400">{gap.severity}</div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
