'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const urgencyBadge: Record<string, string> = {
  Low: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  High: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  Critical: 'bg-red-500/15 text-red-400 border border-red-500/30',
};

// Mock detail data — replace with real API call
const mockDetail = {
  _id: '1',
  title: 'Need help debugging my Next.js auth flow',
  description: `I have a Next.js 14 app with JWT-based authentication. After the access token expires, the refresh token logic doesn't seem to be firing correctly — the user gets a 401 and is immediately logged out instead of silently refreshing.\n\nI've verified the refresh token is stored in an httpOnly cookie and that the endpoint is configured correctly in the backend. The problem seems to be on the client-side interceptor.\n\nAny help from someone experienced with Next.js middleware and Axios interceptors would be greatly appreciated.`,
  category: 'Technology',
  urgencyLevel: 'High',
  status: 'Open',
  aiMetadata: {
    tags: ['next.js', 'authentication', 'jwt', 'axios', 'middleware'],
    insights: 'This is a common issue with silent token refresh strategies. Consider using an Axios request interceptor combined with a queue mechanism to pause inflight requests during token refresh.',
    autoCategory: 'Technology',
    autoUrgency: 'High',
  },
  requester: { username: 'sarah_dev' },
  createdAt: '2026-04-15T10:00:00Z',
};

export default function RequestDetailPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/auth');
  }, [router]);

  const req = mockDetail;

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <a href="/explore" className="text-white/40 hover:text-white text-sm transition-colors mb-6 inline-block">← Back to Explore</a>

        {/* Header */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-7 mb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/40">{req.category}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full ${urgencyBadge[req.urgencyLevel]}`}>{req.urgencyLevel}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-400">{req.status}</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">{req.title}</h1>
          <p className="text-white/30 text-xs mb-5">Posted by @{req.requester.username} · {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          <p className="text-white/70 text-sm leading-7 whitespace-pre-line">{req.description}</p>
        </div>

        {/* AI Metadata */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-500/5 to-cyan-500/5 border border-violet-500/20 p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-violet-400 text-lg">✦</span>
            <h2 className="text-sm font-semibold text-violet-300">AI Insights</h2>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-4">{req.aiMetadata.insights}</p>
          <div>
            <p className="text-xs text-white/30 mb-2">Auto-generated tags</p>
            <div className="flex flex-wrap gap-2">
              {req.aiMetadata.tags.map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            id="offer-help-btn"
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            🤝 Offer Help
          </button>
          <a
            href="/messages"
            id="message-requester-btn"
            className="flex-1 py-3.5 rounded-xl border border-white/10 text-white/70 font-semibold text-sm hover:bg-white/5 hover:text-white transition-all text-center"
          >
            💬 Message Requester
          </a>
        </div>
      </div>
    </div>
  );
}
