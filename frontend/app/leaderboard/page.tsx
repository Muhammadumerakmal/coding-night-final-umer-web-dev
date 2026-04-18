'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

const badgeColors = ['#e6a817', '#5d9e3a', '#e6a817', '#5d9e3a'];

const staticBadges = [
  { name: 'Ayesha Khan', subtitle: 'Design Ally • Code Rescuer', bars: [72, 90] },
  { name: 'Hassan Ali', subtitle: 'Code Rescuer • Bug Hunter', bars: [55, 80] },
  { name: 'Sara Noor', subtitle: 'Community Voice', bars: [60, 40] },
];

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/leaderboard').then(res => {
      setLeaders(res.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const displayLeaders = leaders.length > 0 ? leaders : [
    { username: 'Ayesha Khan', engagementMetrics: { trustScore: 100, contributions: 35 }, supportRole: 'Both', skills: 'Figma, UI/UX' },
    { username: 'Hassan Ali', engagementMetrics: { trustScore: 88, contributions: 24 }, supportRole: 'Helper', skills: 'JavaScript, React, Git/GitHub' },
    { username: 'Sara Noor', engagementMetrics: { trustScore: 74, contributions: 11 }, supportRole: 'Helper', skills: 'Python, Data Analysis' },
  ];

  const top3 = displayLeaders.slice(0, 3);
  const rest = displayLeaders.slice(3);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const avatarColors = ['#4b8b7e', '#5d7a9c', '#c47a3a'];

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
            <Link href="/leaderboard" className="text-sm font-semibold px-4 py-1.5 rounded-full border border-neutral-300 bg-white text-[#18181b] hover:bg-neutral-50 transition-colors">Leaderboard</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-[1300px] mx-auto px-6 py-10 pb-24">
        {/* Hero Dark Banner */}
        <div className="rounded-[1.5rem] p-10 mb-10" style={{ background: '#1c2b27' }}>
          <p className="text-teal-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">LEADERBOARD</p>
          <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight mb-4 max-w-3xl">
            Recognize the people who keep the community moving.
          </h1>
          <p className="text-neutral-400 text-sm max-w-xl">
            Trust score, contribution count, and badges create visible momentum for reliable helpers.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Rankings */}
          <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5">
            <p className="text-teal-600 text-[10px] font-bold tracking-[0.18em] uppercase mb-2">TOP HELPERS</p>
            <h2 className="text-[#18181b] text-2xl font-bold mb-6">Rankings</h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-600"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {top3.map((leader, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-[1rem] border border-neutral-100 bg-neutral-50 hover:bg-neutral-100 transition-colors">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ background: avatarColors[i] }}
                    >
                      {getInitials(leader.username)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#18181b] text-sm">#{i + 2} {leader.username}</p>
                      <p className="text-neutral-500 text-xs truncate">{leader.skills || leader.engagementMetrics?.skills || 'Community Helper'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[#18181b] text-sm font-bold">{leader.engagementMetrics?.trustScore || 0}%</p>
                      <p className="text-neutral-400 text-xs">{leader.engagementMetrics?.contributions || 0} contributions</p>
                    </div>
                  </div>
                ))}
                {rest.map((leader, i) => (
                  <div key={i + 3} className="flex items-center gap-4 p-4 rounded-[1rem] border border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-bold text-sm shrink-0">
                      {getInitials(leader.username)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#18181b] text-sm">#{i + 4} {leader.username}</p>
                      <p className="text-neutral-400 text-xs">{leader.supportRole || 'Helper'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-[#18181b]">{leader.engagementMetrics?.trustScore || 0}%</p>
                      <p className="text-neutral-400 text-xs">{leader.engagementMetrics?.contributions || 0} contributions</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Badge System */}
          <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5">
            <p className="text-teal-600 text-[10px] font-bold tracking-[0.18em] uppercase mb-2">BADGE SYSTEM</p>
            <h2 className="text-[#18181b] text-2xl font-bold mb-6">Trust and achievement</h2>

            <div className="space-y-6">
              {staticBadges.map((person, i) => (
                <div key={i}>
                  <p className="font-bold text-[#18181b] text-sm mb-0.5">{person.name}</p>
                  <p className="text-neutral-500 text-xs mb-3">{person.subtitle}</p>
                  <div className="space-y-2">
                    {person.bars.map((pct, j) => (
                      <div key={j} className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: j === 0 ? '#e6a817' : '#4a8a3e',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
