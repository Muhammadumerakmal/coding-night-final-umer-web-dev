'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';

const statusColors: Record<string, string> = {
  'Open': 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
  'In Progress': 'bg-violet-500/20 text-violet-400 border border-violet-500/30',
  'Completed': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  'Closed': 'bg-white/10 text-white/40 border border-white/20',
};

const urgencyBadge: Record<string, string> = {
  Low: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  High: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  Critical: 'bg-red-500/15 text-red-400 border border-red-500/30',
};

export default function RequestDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequest = useCallback(async () => {
    try {
      const { data } = await api.get(`/requests/${id}`);
      setRequest(data);
    } catch (err) {
      console.error(err);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (!authLoading) {
      fetchRequest();
    }
  }, [authLoading, fetchRequest]);

  const handleOfferHelp = async () => {
    setActionLoading(true);
    try {
      const { data } = await api.post(`/requests/${id}/offer-help`);
      setRequest((prev: any) => ({ ...prev, status: data.status, helper: { username: user?.username } }));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkSolved = async () => {
    setActionLoading(true);
    try {
      const { data } = await api.post(`/requests/${id}/solve`);
      setRequest((prev: any) => ({ ...prev, status: data.status }));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (!request) return null;

  const isOwner = user?.id === request.requester?._id;
  const isHelper = user?.username === request.helper?.username;

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-10 flex justify-center">
      <div className="w-full max-w-3xl">
        <a href="/explore" className="text-white/40 hover:text-white text-sm transition-colors block mb-6">← Back to Explore</a>

        <div className="rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-white/5">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                {request.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${urgencyBadge[request.urgencyLevel]}`}>
                {request.urgencyLevel}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/50 border border-white/10">
                {request.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{request.title}</h1>
            
            <div className="flex items-center gap-3 text-sm text-white/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {request.requester?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white/80 font-medium">@{request.requester?.username}</p>
                  <p className="text-xs">Requester</p>
                </div>
              </div>
              <span className="mx-2">•</span>
              <span>{new Date(request.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">Description</h3>
              <p className="text-white whitespace-pre-wrap leading-relaxed">{request.description}</p>
            </div>

            {/* AI Summary / Insights */}
            {request.aiMetadata?.insights && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-500/10 to-transparent border-l-2 border-violet-500">
                <h3 className="text-sm font-bold text-violet-300 flex items-center gap-2 mb-2">
                  <span>✦</span> AI Insight
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">{request.aiMetadata.insights}</p>
              </div>
            )}

            {/* Tags */}
            {request.aiMetadata?.tags?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {request.aiMetadata.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Helper Status */}
            {request.helper && (
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl">
                  🤝
                </div>
                <div>
                  <p className="text-white/40 text-sm mb-0.5">Help is being provided by</p>
                  <p className="text-white font-medium">@{request.helper.username}</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions Footer */}
          <div className="p-6 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
            <div>
              {request.status === 'Completed' && (
                <p className="text-emerald-400 text-sm font-medium flex items-center gap-2">
                  <span>✓</span> Request has been marked as solved
                </p>
              )}
            </div>

            <div className="flex gap-3">
              {request.status === 'Open' && !isOwner && (
                <button
                  onClick={handleOfferHelp}
                  disabled={actionLoading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold disabled:opacity-50"
                >
                  {actionLoading ? 'Processing...' : 'I Can Help'}
                </button>
              )}

              {['In Progress', 'Open'].includes(request.status) && isOwner && (
                <button
                  onClick={handleMarkSolved}
                  disabled={actionLoading}
                  className="px-6 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold hover:bg-emerald-500/30 disabled:opacity-50 transition-colors"
                >
                  {actionLoading ? 'Processing...' : 'Mark as Solved'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
