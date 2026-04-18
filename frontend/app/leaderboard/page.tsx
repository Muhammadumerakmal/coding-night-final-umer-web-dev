'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const leaderboard = [
  { rank: 1, username: 'devguru_sam', role: 'Can Help', contributions: 142, trustScore: 980, badges: ['🏆 Top Helper', '⚡ Speed Responder', '🎯 Accuracy Pro'], avatar: '🧑‍💻' },
  { rank: 2, username: 'ai_ally_priya', role: 'Both', contributions: 118, trustScore: 870, badges: ['🌟 Rising Star', '🤝 Community Builder'], avatar: '👩‍🔬' },
  { rank: 3, username: 'coach_dan', role: 'Can Help', contributions: 97, trustScore: 810, badges: ['🎓 Mentor', '💬 Great Communicator'], avatar: '🧑‍🏫' },
  { rank: 4, username: 'techwhiz_zara', role: 'Can Help', contributions: 84, trustScore: 745, badges: ['🔥 On Fire', '⭐ Highly Rated'], avatar: '👩‍💻' },
  { rank: 5, username: 'helper_holt', role: 'Both', contributions: 71, trustScore: 690, badges: ['🤝 Community Builder'], avatar: '👨‍🎨' },
  { rank: 6, username: 'marcus_builds', role: 'Can Help', contributions: 63, trustScore: 620, badges: ['⚡ Speed Responder'], avatar: '🧑‍🔧' },
  { rank: 7, username: 'nia_code', role: 'Can Help', contributions: 57, trustScore: 555, badges: ['🌟 Rising Star'], avatar: '👩‍💼' },
];

const rankColors: Record<number, string> = {
  1: 'text-yellow-400',
  2: 'text-slate-300',
  3: 'text-amber-600',
};

const rankBg: Record<number, string> = {
  1: 'from-yellow-500/10 to-amber-500/5 border-yellow-500/20',
  2: 'from-slate-400/10 to-slate-500/5 border-slate-400/20',
  3: 'from-amber-600/10 to-orange-600/5 border-amber-600/20',
};

export default function LeaderboardPage() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/auth');
  }, [router]);

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <a href="/dashboard" className="text-white/40 hover:text-white text-sm transition-colors mb-6 inline-block">← Dashboard</a>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">🏆 Leaderboard</h1>
          <p className="text-white/40 text-sm">Community contributors ranked by trust score and impact.</p>
        </div>

        {/* Podium */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[topThree[1], topThree[0], topThree[2]].map((user, i) => {
            const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const height = actualRank === 1 ? 'pt-6' : actualRank === 2 ? 'pt-10' : 'pt-12';
            return (
              <div key={user.rank} className={`rounded-2xl bg-gradient-to-b ${rankBg[actualRank]} border p-4 text-center flex flex-col items-center ${height}`}>
                <div className="text-3xl mb-2">{user.avatar}</div>
                <div className={`text-lg font-bold ${rankColors[actualRank] || 'text-white'}`}>#{actualRank}</div>
                <p className="text-xs font-semibold text-white mt-1 truncate">@{user.username}</p>
                <p className="text-xs text-white/40 mt-0.5">{user.trustScore} pts</p>
              </div>
            );
          })}
        </div>

        {/* Full Rankings */}
        <div className="space-y-2">
          {leaderboard.map(user => (
            <div
              key={user.rank}
              id={`rank-${user.rank}`}
              className={`rounded-2xl border p-5 flex items-center gap-4 transition-all ${user.rank <= 3 ? `bg-gradient-to-r ${rankBg[user.rank]}` : 'bg-white/[0.03] border-white/5 hover:border-white/10'}`}
            >
              <div className={`w-8 text-center font-bold text-lg shrink-0 ${rankColors[user.rank] || 'text-white/30'}`}>
                {user.rank <= 3 ? ['🥇','🥈','🥉'][user.rank - 1] : `#${user.rank}`}
              </div>
              <span className="text-2xl">{user.avatar}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">@{user.username}</span>
                  <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{user.role}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {user.badges.slice(0, 2).map(b => (
                    <span key={b} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">{b}</span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-white font-bold text-sm">{user.trustScore}</p>
                <p className="text-white/30 text-xs">{user.contributions} helps</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
