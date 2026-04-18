'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const aiInsights = [
  {
    id: 1,
    type: 'Match',
    icon: '🎯',
    title: 'High-probability match found',
    desc: '3 open requests in "Technology" align with your past help activity. Review them now.',
    action: 'View Requests',
    href: '/explore',
    color: 'from-violet-500/10 to-purple-500/5 border-violet-500/20',
    tag: 'Smart Matching',
  },
  {
    id: 2,
    type: 'Trending',
    icon: '📈',
    title: 'Your category is trending',
    desc: '"JavaScript" requests have increased 40% this week. You\'re in high demand.',
    action: 'Explore Requests',
    href: '/explore',
    color: 'from-cyan-500/10 to-blue-500/5 border-cyan-500/20',
    tag: 'Trend Analysis',
  },
  {
    id: 3,
    type: 'Badge',
    icon: '🏅',
    title: 'You\'re close to a new badge',
    desc: '2 more contributions will earn you the "Community Builder" badge and a 15-point trust boost.',
    action: 'View Leaderboard',
    href: '/leaderboard',
    color: 'from-amber-500/10 to-yellow-500/5 border-amber-500/20',
    tag: 'Achievement',
  },
  {
    id: 4,
    type: 'Suggestion',
    icon: '💡',
    title: 'AI recommendation for your request',
    desc: 'Your open request "Debug Next.js auth" would attract more helpers with a more detailed error log sample.',
    action: 'Edit Request',
    href: '/dashboard',
    color: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20',
    tag: 'Optimization Tip',
  },
];

const userSkills = ['JavaScript', 'React', 'Node.js', 'System Design', 'MongoDB'];

export default function AICenterPage() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/auth');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <a href="/dashboard" className="text-white/40 hover:text-white text-sm transition-colors mb-6 inline-block">← Dashboard</a>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-xl">✦</div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Center</h1>
              <p className="text-white/40 text-xs">Powered by Helplytics AI · Updated 2 minutes ago</p>
            </div>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">
            Your personalized intelligence hub. AI constantly analyzes your activity, skills, and community trends to surface insights, smart matches, and growth opportunities.
          </p>
        </div>

        {/* Detected Skills */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-6 mb-6">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Auto-detected Skills</p>
          <div className="flex flex-wrap gap-2">
            {userSkills.map(s => (
              <span key={s} className="text-sm px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-white/80 border border-violet-500/20">
                {s}
              </span>
            ))}
          </div>
          <p className="text-xs text-white/25 mt-3">Derived from your contributions and request history. Edit in Settings.</p>
        </div>

        {/* Insight Cards */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Live Insights</h2>
          {aiInsights.map(insight => (
            <div key={insight.id} id={`insight-${insight.id}`} className={`rounded-2xl bg-gradient-to-br ${insight.color} border p-6`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{insight.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{insight.tag}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">{insight.title}</h3>
                    <p className="text-xs text-white/50 leading-relaxed">{insight.desc}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <a
                  href={insight.href}
                  className="inline-block text-xs font-semibold px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors"
                >
                  {insight.action} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
