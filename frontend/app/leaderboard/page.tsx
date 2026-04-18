'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/leaderboard').then(res => {
      setLeaders(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-white/40 hover:text-white text-sm transition-colors block mb-6">← Dashboard</Link>

        <div className="mb-8 text-center">
          <div className="inline-block p-4 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-4xl mb-4">
            🏆
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Top Helpers Leaderboard</h1>
          <p className="text-white/40 text-sm">Recognizing our most trusted community contributors.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {leaders.map((leader, index) => (
              <div 
                key={leader._id} 
                className={`flex items-center gap-4 p-5 rounded-2xl border ${index < 3 ? 'bg-gradient-to-r from-yellow-500/5 to-transparent border-yellow-500/20' : 'bg-white/[0.02] border-white/5'} transition-all hover:bg-white/[0.04]`}
              >
                <div className={`w-10 text-center font-bold text-xl ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-white/20'}`}>
                  #{index + 1}
                </div>
                
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-lg font-bold text-white border border-white/10">
                  {leader.username.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-white">{leader.username}</h3>
                  <p className="text-xs text-white/40">Role: {leader.supportRole || 'Helper'}</p>
                </div>

                <div className="text-right">
                  <div className="font-bold text-yellow-400">{leader.engagementMetrics?.trustScore || 0}</div>
                  <div className="text-xs text-white/40 uppercase tracking-widest mt-0.5">Trust</div>
                </div>

                <div className="text-right ml-4 hidden sm:block">
                  <div className="font-bold text-emerald-400">{leader.engagementMetrics?.contributions || 0}</div>
                  <div className="text-xs text-white/40 uppercase tracking-widest mt-0.5">Helped</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
