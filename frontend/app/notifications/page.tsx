'use client';

import Link from 'next/link';

export default function NotificationsPage() {
  const notifications = [
    { type: 'help_offered', title: '@sarah_dev offered to help you!', time: '10m ago', unread: true },
    { type: 'ai_insight', title: 'AI matched your skills with a new "Critical" request.', time: '2h ago', unread: true },
    { type: 'resolved', title: 'Your request "Figma Prototype" was marked as solved.', time: '1d ago', unread: false },
    { type: 'badge', title: 'You earned the "Helpful Hand" badge!', time: '2d ago', unread: false },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-white/40 hover:text-white text-sm transition-colors block mb-6">← Dashboard</Link>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <button className="text-xs text-violet-400 hover:text-white transition-colors">Mark all as read</button>
        </div>

        <div className="space-y-3">
          {notifications.map((n, i) => (
             <div key={i} className={`p-4 rounded-xl border flex items-center gap-4 transition-colors hover:bg-white/[0.03] ${n.unread ? 'bg-white/[0.02] border-white/10' : 'border-transparent'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  n.type === 'help_offered' ? 'bg-cyan-500/20 text-cyan-400' :
                  n.type === 'ai_insight' ? 'bg-violet-500/20 text-violet-400' :
                  n.type === 'badge' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {n.type === 'help_offered' ? '🤝' : n.type === 'ai_insight' ? '✦' : n.type === 'badge' ? '🏆' : '✓'}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${n.unread ? 'text-white font-medium' : 'text-white/60'}`}>{n.title}</p>
                </div>
                <div className="text-xs text-white/30 shrink-0">{n.time}</div>
                {n.unread && <div className="w-2 h-2 rounded-full bg-violet-500 shrink-0"></div>}
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
