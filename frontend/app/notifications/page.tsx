'use client';

import Link from 'next/link';

const notifications = [
  { title: '"Need help" was marked as solved', category: 'Status', time: 'Just now', read: false },
  { title: 'Ayesha Khan offered help on "Need help"', category: 'Match', time: 'Just now', read: false },
  { title: 'Your request "Need help" is now live in the community feed', category: 'Request', time: 'Just now', read: false },
  { title: '"Need help making my portfolio responsive before demo day" was marked as solved', category: 'Status', time: 'Just now', read: false },
  { title: '"Need help making my portfolio responsive before demo day" was marked as solved', category: 'Status', time: 'Just now', read: false },
  { title: '"Need help making my portfolio responsive before demo day" was marked as solved', category: 'Status', time: 'Just now', read: false },
  { title: 'New helper matched to your responsive portfolio request', category: 'Match', time: '12 min ago', read: false },
  { title: 'Your trust score increased after a solved request', category: 'Reputation', time: '1 hr ago', read: false },
  { title: 'AI Center detected rising demand for interview prep', category: 'Insight', time: 'Today', read: true },
];

export default function NotificationsPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #e8f5f0 0%, #f5f0e8 40%, #f0e8f5 70%, #e8f0f5 100%)' }}>
      {/* Navbar */}
      <nav style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }} className="sticky top-0 z-50">
        <div className="max-w-[1300px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-base">H</div>
            <span className="font-bold text-[#18181b] text-base">HelpHub AI</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-neutral-500 text-sm font-medium hover:text-neutral-800 transition-colors">Dashboard</Link>
            <Link href="/explore" className="text-neutral-500 text-sm font-medium hover:text-neutral-800 transition-colors">Explore</Link>
            <Link href="/notifications" className="text-sm font-semibold px-4 py-1.5 rounded-full border border-neutral-300 bg-white text-[#18181b] hover:bg-neutral-50 transition-colors">Notifications</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-[1300px] mx-auto px-6 py-10 pb-24">
        {/* Hero Dark Banner */}
        <div className="rounded-[1.5rem] p-10 mb-10" style={{ background: '#1c2b27' }}>
          <p className="text-teal-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">NOTIFICATIONS</p>
          <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight max-w-3xl">
            Stay updated on requests, helpers, and trust signals.
          </h1>
        </div>

        {/* Notification feed */}
        <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5">
          <p className="text-teal-600 text-[10px] font-bold tracking-[0.18em] uppercase mb-2">LIVE UPDATES</p>
          <h2 className="text-[#18181b] text-2xl font-bold mb-6">Notification feed</h2>

          <div className="divide-y divide-neutral-100">
            {notifications.map((n, i) => (
              <div key={i} className="py-5 flex items-start justify-between gap-6 hover:bg-neutral-50 -mx-2 px-2 transition-colors cursor-pointer">
                <div className="flex-1 min-w-0">
                  <p className="text-[#18181b] text-sm mb-1 leading-relaxed">{n.title}</p>
                  <p className="text-neutral-400 text-xs">{n.category} • {n.time}</p>
                </div>
                <span
                  className="shrink-0 text-xs font-semibold mt-0.5"
                  style={{ color: n.read ? '#a1a1aa' : '#18181b' }}
                >
                  {n.read ? 'Read' : 'Unread'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
