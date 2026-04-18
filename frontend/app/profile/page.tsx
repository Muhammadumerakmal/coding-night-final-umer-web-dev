'use client';

import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-10 flex justify-center">
      <div className="w-full max-w-3xl">
        <Link href="/dashboard" className="text-white/40 hover:text-white text-sm transition-colors block mb-6">← Back to Dashboard</Link>

        {/* Profile Card */}
        <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 rounded-full border-4 border-white/10 bg-gradient-to-tr from-violet-600 to-cyan-600 flex flex-col items-center justify-center shadow-2xl shadow-violet-500/20">
               <span className="text-4xl font-bold text-white">{user?.username?.charAt(0).toUpperCase()}</span>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-1">{user?.username}</h1>
              <p className="text-white/40 mb-4">{user?.email}</p>
              
              <div className="inline-flex px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/70 mb-6">
                Role: <span className="font-medium text-white ml-1">{user?.supportRole || 'Both'}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 relative z-10 border-t border-white/5 pt-8">
            <div className="text-center p-4 bg-white/[0.02] rounded-2xl border border-white/5">
              <div className="text-sm text-white/40 mb-1">Contributions</div>
              <div className="text-2xl font-bold text-white">{user?.engagementMetrics?.contributions || 0}</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-b from-yellow-500/10 to-transparent rounded-2xl border border-yellow-500/20">
              <div className="text-sm text-yellow-500/70 mb-1">Trust Score</div>
              <div className="text-2xl font-bold text-yellow-400">{user?.engagementMetrics?.trustScore || 0}</div>
            </div>
            <div className="text-center p-4 bg-white/[0.02] rounded-2xl border border-white/5">
              <div className="text-sm text-white/40 mb-1">Join Date</div>
              <div className="text-base font-medium text-white mt-2">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Just now'}
              </div>
            </div>
            <div className="text-center p-4 bg-white/[0.02] rounded-2xl border border-white/5">
              <div className="text-sm text-white/40 mb-1">Badges</div>
              <div className="text-xl mt-2">{user?.engagementMetrics?.badges?.length > 0 ? user.engagementMetrics.badges.join(' ') : '🌱'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
