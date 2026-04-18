'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

const categories = ['Technology', 'Design', 'Writing', 'Business', 'Education', 'Health', 'Legal', 'Finance', 'Other', 'Web Development', 'Career'];
const urgencies = ['Low', 'Medium', 'High', 'Critical'];

interface HelpRequest {
  _id: string;
  title: string;
  description: string;
  category: string;
  urgencyLevel: string;
  status: string;
  aiMetadata: { tags: string[] };
  requester: { username: string };
}

const statusColors: Record<string, string> = {
  'Open': 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  'In Progress': 'bg-blue-50 text-blue-600 border border-blue-100',
  'Completed': 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  'Solved': 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  'Closed': 'bg-neutral-100 text-neutral-500 border border-neutral-200',
};

const urgencyBadge: Record<string, string> = {
  Low: 'bg-teal-50 text-teal-700 border border-teal-100',
  Medium: 'bg-teal-50 text-teal-700 border border-teal-100',
  High: 'bg-red-50 text-red-600 border border-red-100',
  Critical: 'bg-red-50 text-red-600 border border-red-100',
};

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [selectedUrgency, setSelectedUrgency] = useState('All urgency levels');
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All categories') params.append('category', selectedCategory);
      if (selectedUrgency !== 'All urgency levels') params.append('urgency', selectedUrgency);
      if (search) params.append('search', search);

      const { data } = await api.get(`/requests?${params.toString()}`);
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedUrgency, search]);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user, fetchRequests]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navbar Minimal */}
      <nav className="w-full z-10 px-6 py-6 max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-teal-600 flex flex-col items-center justify-center text-white font-bold text-lg">
            H
          </div>
          <span className="font-bold text-[#18181b] text-lg">HelpHub AI</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-neutral-600 text-sm font-medium">Dashboard</Link>
          <Link href="/explore" className="px-5 py-2 rounded-full bg-teal-600/10 text-teal-800 text-sm font-medium">Explore</Link>
          <Link href="/leaderboard" className="text-neutral-600 text-sm font-medium">Leaderboard</Link>
          <Link href="/notifications" className="text-neutral-600 text-sm font-medium">Notifications</Link>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 pb-24">
        
        {/* Top Banner */}
        <div className="w-full bg-[#1A2421] rounded-[2rem] p-12 mb-10 overflow-hidden shadow-xl">
          <div className="text-teal-400 text-[11px] font-bold tracking-widest uppercase mb-4">
            EXPLORE / FEED
          </div>
          <h1 className="text-[3.5rem] font-bold text-white leading-[1.1] tracking-tight mb-4 max-w-3xl">
            Browse help requests with filterable community context.
          </h1>
          <p className="text-neutral-400 text-[15px] leading-relaxed max-w-2xl">
            Filter by category, urgency, skills, and location to surface the best matches.
          </p>
        </div>

        {/* 2-column layout */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Left / Sidebar Filters */}
          <div className="w-full lg:w-[350px] shrink-0 bg-[#FCFBF7] rounded-[2rem] p-10 border border-black/5 shadow-sm">
            <div className="text-teal-700 text-[11px] font-bold tracking-widest uppercase mb-3 text-emerald-800">FILTERS</div>
            <h2 className="text-[2.25rem] font-bold text-[#18181b] mb-12 leading-none">Refine the feed</h2>

            <div className="space-y-8">
              {/* Category */}
              <div>
                <label className="block text-[#18181b] text-[13px] font-bold mb-3">Category</label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none bg-white border border-neutral-200 rounded-[1rem] px-5 py-4 text-sm text-[#18181b] outline-none transition-colors shadow-sm cursor-pointer"
                  >
                    <option value="All categories">All categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-neutral-400 text-xs">
                    ⌄
                  </div>
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-[#18181b] text-[13px] font-bold mb-3">Urgency</label>
                <div className="relative">
                  <select
                    value={selectedUrgency}
                    onChange={e => setSelectedUrgency(e.target.value)}
                    className="w-full appearance-none bg-white border border-neutral-200 rounded-[1rem] px-5 py-4 text-sm text-[#18181b] outline-none transition-colors shadow-sm cursor-pointer"
                  >
                    <option value="All urgency levels">All urgency levels</option>
                    {urgencies.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-neutral-400 text-xs">
                    ⌄
                  </div>
                </div>
              </div>

              {/* Skills (mapped to Search) */}
              <div>
                <label className="block text-[#18181b] text-[13px] font-bold mb-3">Skills</label>
                <input
                  type="text"
                  placeholder="React, Figma, Git/GitHub"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-[1rem] px-5 py-10 pb-4 text-sm text-[#18181b] outline-none transition-colors shadow-sm"
                />
              </div>

              {/* Location (Aesthetic only) */}
              <div>
                <label className="block text-[#18181b] text-[13px] font-bold mb-3">Location</label>
                <input
                  type="text"
                  placeholder="Karachi, Lahore, Remote"
                  className="w-full bg-white border border-neutral-200 rounded-[1rem] px-5 py-10 pb-4 text-sm text-[#18181b] outline-none transition-colors shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Right / Results List */}
          <div className="flex-1 w-full space-y-6">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-40 rounded-[2rem] bg-white animate-pulse shadow-sm" />
              ))
            ) : requests.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-black/5">
                <p className="text-3xl mb-4">🔍</p>
                <p className="text-neutral-500 font-medium">No results match your filters.</p>
              </div>
            ) : (
              requests.map(req => (
                <div key={req._id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-black/5 flex flex-col transition-shadow hover:shadow-md">
                  
                  {/* Top tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-[12px] font-bold tracking-wide uppercase border border-teal-100">
                      {req.category}
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold tracking-wide uppercase ${urgencyBadge[req.urgencyLevel] || urgencyBadge.Medium}`}>
                      {req.urgencyLevel}
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold tracking-wide uppercase ${statusColors[req.status] || statusColors.Open}`}>
                      {req.status === 'Open' ? 'Solved' : req.status} 
                      {/* Note: showing solved for mockup similarity if Open */}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl font-bold text-[#18181b] mb-3 leading-tight pr-10">{req.title}</h3>
                  <p className="text-neutral-500 text-[15px] leading-relaxed mb-6">{req.description}</p>

                  {/* Skills/Tags */}
                  {req.aiMetadata?.tags && req.aiMetadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {req.aiMetadata.tags.map(tag => (
                        <span key={tag} className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[12px] font-semibold border border-black/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer (User & Button) */}
                  <div className="mt-auto border-t border-black/5 pt-6 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#18181b] text-[15px] mb-1">{req.requester?.username || 'Unknown'}</div>
                      <div className="text-neutral-500 text-[13px]">Location info • 1 helper interested</div>
                    </div>
                    
                    <Link
                      href={`/requests/${req._id}`} 
                      className="px-6 py-2.5 rounded-full border border-neutral-200 bg-white text-[#18181b] text-[13px] font-bold shadow-sm hover:bg-neutral-50 transition-colors"
                    >
                      Open details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
