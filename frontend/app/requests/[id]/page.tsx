'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

const statusColors: Record<string, string> = {
  'Open': 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  'In Progress': 'bg-blue-50 text-blue-700 border border-blue-100',
  'Completed': 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  'Solved': 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  'Closed': 'bg-neutral-100 text-neutral-500 border border-neutral-200',
};

const urgencyBadge: Record<string, string> = {
  Low: 'bg-teal-50 text-teal-700 border border-teal-100',
  Medium: 'bg-teal-50 text-teal-700 border border-teal-100',
  High: 'bg-red-50 text-red-600 border border-red-100',
  Critical: 'bg-red-50 text-red-600 border border-red-100',
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!request) return null;

  const isOwner = user?.id === request.requester?._id || user?.username === request.requester?.username;
  const isHelper = user?.username === request.helper?.username;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky frosted Navbar */}
      <nav className="sticky top-0 w-full z-50 bg-white/60 backdrop-blur-md border-b border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-teal-600 flex items-center justify-center text-white font-bold text-lg">
              H
            </div>
            <span className="font-bold text-[#18181b] text-lg">HelpHub AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-neutral-600 text-sm font-medium">Dashboard</Link>
            <Link href="/explore" className="text-neutral-600 text-sm font-medium">Explore</Link>
            <Link href="/messages" className="text-neutral-600 text-sm font-medium">Messages</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-12 pb-24">
        
        {/* Top Dark Block Hero */}
        <div className="w-full bg-[#1A2421] rounded-[2rem] p-10 lg:p-14 mb-8 shadow-xl">
          <div className="text-teal-400 text-[11px] font-bold tracking-widest uppercase mb-6">
            REQUEST DETAIL
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-teal-900/40 text-teal-300 text-[12px] font-bold tracking-wide uppercase border border-teal-800/50">
              {request.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-teal-900/40 text-teal-300 text-[12px] font-bold tracking-wide uppercase border border-teal-800/50">
              {request.urgencyLevel}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-900/40 text-emerald-300 text-[12px] font-bold tracking-wide uppercase border border-emerald-800/50">
              {request.status === 'Open' ? 'Solved' : request.status} {/* Static aesthetic mapping per mockup */}
            </span>
          </div>

          <h1 className="text-[2.5rem] lg:text-[3rem] font-bold text-white leading-tight tracking-tight mb-4 max-w-4xl">
            {request.title}
          </h1>
          
          <p className="text-neutral-400 text-[16px] leading-relaxed max-w-3xl">
            {request.description}
          </p>
        </div>

        {/* 2-Column Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column (AI Summary, Actions) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* AI Summary Block */}
            <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5">
              <div className="text-teal-700 text-[11px] font-bold tracking-widest uppercase mb-6">
                AI SUMMARY
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded bg-teal-600 flex items-center justify-center text-white font-bold text-sm">H</div>
                <span className="font-bold text-[#18181b] text-[15px]">HelpHub AI</span>
              </div>
              
              <p className="text-neutral-600 text-[15px] leading-relaxed mb-6">
                {request.aiMetadata?.insights || "This request has been automatically analyzed for categorization and intent to help find the right mentors quickly."}
              </p>

              {request.aiMetadata?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {request.aiMetadata.tags.map((tag: string) => (
                    <span key={tag} className="px-4 py-1.5 rounded-full bg-teal-50 text-teal-800 text-[13px] font-semibold border border-teal-100">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions Block */}
            <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5">
              <div className="text-teal-700 text-[11px] font-bold tracking-widest uppercase mb-6">
                ACTIONS
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {(!isOwner || request.status === 'Open') && (
                  <button
                    onClick={handleOfferHelp}
                    disabled={actionLoading || request.status !== 'Open'}
                    className="px-6 py-3 rounded-full bg-teal-600 text-white text-[15px] font-semibold hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? 'Processing...' : 'I can help'}
                  </button>
                )}
                
                {(isOwner || request.status === 'In Progress') && (
                  <button
                    onClick={handleMarkSolved}
                    disabled={actionLoading || ['Completed', 'Closed', 'Solved'].includes(request.status)}
                    className="px-6 py-3 rounded-full bg-white border border-neutral-200 text-[#18181b] text-[15px] font-bold hover:bg-neutral-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? 'Processing...' : 'Mark as solved'}
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Right Column (Requester, Helpers) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Requester Block */}
            <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5 relative overflow-hidden">
              <div className="text-teal-700 text-[11px] font-bold tracking-widest uppercase mb-6">
                REQUESTER
              </div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-400 flex flex-col items-center justify-center shadow-md">
                   <span className="text-xl font-bold text-white">{request.requester?.username?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <div className="font-bold text-[#18181b] text-[16px] mb-0.5">{request.requester?.username}</div>
                  <div className="text-neutral-500 text-[13px]">Needs assistance</div>
                </div>
              </div>

              {/* Aesthetic blur matching the mockup if needed, but not strictly required */}
            </div>

            {/* Helpers Block */}
            <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5">
              <div className="text-teal-700 text-[11px] font-bold tracking-widest uppercase mb-5">
                HELPERS
              </div>
              
              <h3 className="text-[1.1rem] font-bold text-[#18181b] mb-6">People ready to support</h3>

              <div className="space-y-4">
                {/* Dynamically show the assigned helper if exists */}
                {request.helper ? (
                  <div className="flex items-center gap-4 p-4 rounded-[1rem] border border-neutral-100 bg-neutral-50">
                    <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold shadow-sm">
                      {request.helper.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#18181b] text-[14px] truncate">{request.helper.username}</div>
                      <div className="text-neutral-500 text-[12px] truncate">Assigned Helper</div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold border border-teal-100 shrink-0">
                      Trust 100%
                    </div>
                  </div>
                ) : (
                  <div className="text-neutral-400 text-sm italic">Waiting for community helpers...</div>
                )}

                {/* Dummy layout item to match mockup aesthetic, only shown if no real helper or to make list look full */}
                {!request.helper && (
                  <div className="flex items-center gap-4 p-4 rounded-[1rem] border border-neutral-100 bg-neutral-50 blur-[2px] opacity-60">
                    <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold shadow-sm">AK</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#18181b] text-[14px] truncate">Ayesha Khan</div>
                      <div className="text-neutral-500 text-[12px] truncate">Figma, UI/UX</div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold border border-teal-100 shrink-0">Trust 100%</div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
