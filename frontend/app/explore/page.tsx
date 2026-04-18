'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

const categories = ['Technology', 'Design', 'Writing', 'Business', 'Education', 'Health', 'Legal', 'Finance', 'Other'];
const urgencies = ['Low', 'Medium', 'High', 'Critical'];

const urgencyColors: Record<string, string> = {
  Low: 'border-emerald-500/40 text-emerald-400',
  Medium: 'border-yellow-500/40 text-yellow-400',
  High: 'border-orange-500/40 text-orange-400',
  Critical: 'border-red-500/40 text-red-400',
};

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
  'Open': 'bg-cyan-500/20 text-cyan-400',
  'In Progress': 'bg-violet-500/20 text-violet-400',
  'Completed': 'bg-emerald-500/20 text-emerald-400',
  'Closed': 'bg-white/10 text-white/40',
};

const urgencyBadge: Record<string, string> = {
  Low: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  High: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  Critical: 'bg-red-500/15 text-red-400 border border-red-500/30',
};

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      // Fetch open requests dynamically
      const params = new URLSearchParams();
      params.append('status', 'Open'); // Usually Explore is for Open requests
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedUrgency !== 'All') params.append('urgency', selectedUrgency);
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
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <a href="/dashboard" className="text-white/40 hover:text-white text-sm transition-colors">← Dashboard</a>
        </div>
        <h1 className="text-3xl font-bold text-white mt-2 mb-1">Explore Requests</h1>
        <p className="text-white/40 text-sm mb-8">Browse live community requests — powered by AI matching.</p>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            id="explore-search"
            type="text"
            placeholder="Search by keyword…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/50 transition-colors"
          />
          <select
            id="filter-category"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/70 outline-none focus:border-violet-500/50 transition-colors"
          >
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            id="filter-urgency"
            value={selectedUrgency}
            onChange={e => setSelectedUrgency(e.target.value)}
            className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/70 outline-none focus:border-violet-500/50 transition-colors"
          >
            <option value="All">All Urgency</option>
            {urgencies.map(u => <option key={u} value={u} className={urgencyColors[u]}>{u}</option>)}
          </select>
        </div>

        {/* Results */}
        {loading ? (
           <div className="space-y-3">
             {[1, 2, 3].map((i) => (
               <div key={i} className="h-24 rounded-2xl bg-white/[0.03] animate-pulse" />
             ))}
           </div>
        ) : (
          <>
            <p className="text-white/30 text-xs mb-4">{requests.length} request{requests.length !== 1 ? 's' : ''} found</p>

            {requests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
                <p className="text-3xl mb-3">🔍</p>
                <p className="text-white/40 text-sm">No results match your filters.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map(req => (
                  <a
                    key={req._id}
                    href={`/requests/${req._id}`}
                    id={`request-${req._id}`}
                    className="block rounded-2xl bg-white/[0.03] border border-white/5 p-5 hover:border-violet-500/30 hover:bg-white/[0.055] transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{req.category}</span>
                        </div>
                        <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors">{req.title}</h3>
                        <p className="text-white/40 text-sm mt-1 line-clamp-2">{req.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {req.aiMetadata?.tags?.map(tag => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-white/25 text-xs mt-3">by @{req.requester?.username || 'Unknown'}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${urgencyBadge[req.urgencyLevel] || urgencyBadge.Medium}`}>{req.urgencyLevel}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full ${statusColors[req.status] || statusColors.Open}`}>{req.status}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
