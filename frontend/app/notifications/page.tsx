'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const notifications = [
  { id: 1, type: 'match', icon: '✦', title: 'AI Match Found', message: 'Your request "Debug Next.js auth flow" has been matched with 2 potential helpers.', time: '2 minutes ago', read: false, href: '/requests/1', color: 'border-l-violet-500' },
  { id: 2, type: 'help', icon: '🤝', title: 'Help Offered', message: '@devguru_sam offered to help with your JavaScript debugging request.', time: '15 minutes ago', read: false, href: '/messages', color: 'border-l-cyan-500' },
  { id: 3, type: 'badge', icon: '🏅', title: 'Badge Earned!', message: 'You\'ve earned the "Rising Star" badge for completing 5 help contributions this week!', time: '1 hour ago', read: true, href: '/leaderboard', color: 'border-l-yellow-500' },
  { id: 4, type: 'message', icon: '💬', title: 'New Message', message: '@ai_ally_priya sent you a message about your business plan review request.', time: '2 hours ago', read: true, href: '/messages', color: 'border-l-emerald-500' },
  { id: 5, type: 'status', icon: '✅', title: 'Request Completed', message: 'Your help request "Python data cleaning script" has been marked as Completed.', time: '5 hours ago', read: true, href: '/dashboard', color: 'border-l-emerald-500' },
  { id: 6, type: 'system', icon: '⚡', title: 'Trust Score Update', message: 'Your trust score increased by +25 points based on positive feedback from your last 3 helps.', time: '1 day ago', read: true, href: '/ai-center', color: 'border-l-amber-500' },
];

export default function NotificationsPage() {
  const [items, setItems] = useState(notifications);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/auth');
  }, [router]);

  const markAllRead = () => setItems(i => i.map(n => ({ ...n, read: true })));
  const unreadCount = items.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <a href="/dashboard" className="text-white/40 hover:text-white text-sm transition-colors mb-6 inline-block">← Dashboard</a>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-white/40 text-sm mt-0.5">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              id="mark-all-read-btn"
              onClick={markAllRead}
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors px-3 py-1.5 rounded-lg border border-violet-500/20 hover:border-violet-500/40"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {items.map(notif => (
            <a
              key={notif.id}
              id={`notif-${notif.id}`}
              href={notif.href}
              onClick={() => setItems(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))}
              className={`block rounded-2xl border-l-4 ${notif.color} bg-white/[0.03] border border-white/5 ${!notif.read ? 'bg-white/[0.055]' : ''} px-5 py-4 hover:bg-white/[0.07] transition-all`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{notif.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-semibold ${notif.read ? 'text-white/70' : 'text-white'}`}>
                      {notif.title}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      {!notif.read && <div className="w-2 h-2 rounded-full bg-violet-500" />}
                      <span className="text-xs text-white/25">{notif.time}</span>
                    </div>
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${notif.read ? 'text-white/35' : 'text-white/55'}`}>
                    {notif.message}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {items.every(n => n.read) && (
          <div className="mt-8 text-center">
            <p className="text-3xl mb-2">🎉</p>
            <p className="text-white/40 text-sm">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
