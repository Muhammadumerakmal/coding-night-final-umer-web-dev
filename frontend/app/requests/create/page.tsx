'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

const categories = ['Technology', 'Design', 'Writing', 'Business', 'Education', 'Web Development', 'Health', 'Legal', 'Finance', 'Community', 'Other'];
const urgencies = ['Low', 'Medium', 'High', 'Critical'];

export default function CreateRequestPage() {
  const router = useRouter();
  const { loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    urgencyLevel: 'High',
    tags: 'JavaScript, Debugging, Review',
    aiSuggestedTags: [] as string[],
  });

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [aiApplied, setAiApplied] = useState(false);

  // AI panel state
  const [aiData, setAiData] = useState({
    category: 'Community',
    urgency: 'Low',
    tags: 'Add more detail for smarter tags',
    rewrite: 'Start describing the challenge to generate a stronger version.',
  });

  if (authLoading) return null;

  const handleAiSuggest = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      const text = (formData.title + ' ' + formData.description).toLowerCase();
      let tags = 'Add more detail for smarter tags';
      let cat = 'Community';
      let urgency = 'Low';
      let rewrite = 'Start describing the challenge to generate a stronger version.';

      if (text.includes('react') || text.includes('next.js') || text.includes('javascript')) {
        tags = 'JavaScript, React, Frontend';
        cat = 'Web Development';
        urgency = 'High';
        rewrite = 'Need expert help with a JavaScript/React implementation challenge — looking for guidance on best practices and debugging.';
      } else if (text.includes('design') || text.includes('logo') || text.includes('ui')) {
        tags = 'UI/UX, Design, Figma';
        cat = 'Design';
        urgency = 'Medium';
        rewrite = 'Seeking design feedback and guidance from an experienced UI/UX professional.';
      } else if (text.includes('quiz') || text.includes('submission') || text.includes('review')) {
        tags = 'JavaScript, Debugging, Review';
        cat = 'Web Development';
        urgency = 'High';
        rewrite = 'Looking for a thorough code review before final submission — JavaScript app with quiz logic.';
      } else if (text.length > 10) {
        tags = 'General Help, Review';
        cat = 'Community';
        urgency = 'Low';
        rewrite = 'Seeking community support on an ongoing challenge — open to any helpful guidance.';
      }

      setAiData({ category: cat, urgency, tags, rewrite });
      setAiApplied(false);
      setIsAiLoading(false);
    }, 1000);
  };

  const handleApplyAiSuggestions = () => {
    setFormData(prev => ({
      ...prev,
      category: aiData.category,
      urgencyLevel: aiData.urgency,
      tags: aiData.tags !== 'Add more detail for smarter tags' ? aiData.tags : prev.tags,
    }));
    setAiApplied(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        urgencyLevel: formData.urgencyLevel,
        aiSuggestedTags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      const { data } = await api.post('/requests', payload);
      router.push(`/requests/${data._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create request');
      setSubmitting(false);
    }
  };

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
            <Link href="/requests/create" className="text-sm font-semibold px-4 py-1.5 rounded-full border border-neutral-300 bg-white text-[#18181b] hover:bg-neutral-50 transition-colors">Create Request</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-[1300px] mx-auto px-6 py-10 pb-24">
        {/* Hero Dark Banner */}
        <div className="rounded-[1.5rem] p-10 mb-10" style={{ background: '#1c2b27' }}>
          <p className="text-teal-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">CREATE REQUEST</p>
          <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight mb-4 max-w-3xl">
            Turn a rough problem into a clear help request.
          </h1>
          <p className="text-neutral-400 text-sm max-w-xl">
            Use built-in AI suggestions for category, urgency, tags, and a stronger description rewrite.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
          {/* Form */}
          <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-neutral-700 text-sm mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Need review on my JavaScript quiz app before submission"
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[#18181b] placeholder-neutral-400 text-sm outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-700 text-sm mb-2">Description</label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain the challenge, your current progress, deadline, and what kind of help would be useful."
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[#18181b] placeholder-neutral-400 text-sm outline-none focus:border-teal-500 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 text-sm mb-2">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="JavaScript, Debugging, Review"
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[#18181b] placeholder-neutral-400 text-sm outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 text-sm mb-2">Category</label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[#18181b] text-sm appearance-none outline-none focus:border-teal-500 transition-colors bg-white"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">▼</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 text-sm mb-2">Urgency</label>
                <div className="relative">
                  <select
                    value={formData.urgencyLevel}
                    onChange={e => setFormData({ ...formData, urgencyLevel: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[#18181b] text-sm appearance-none outline-none focus:border-teal-500 transition-colors bg-white"
                  >
                    {urgencies.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">▼</div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleApplyAiSuggestions}
                  className="px-6 py-3 rounded-full border border-neutral-300 bg-white text-[#18181b] text-sm font-semibold hover:bg-neutral-50 transition-colors"
                >
                  {aiApplied ? 'Applied ✓' : 'Apply AI suggestions'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish request'}
                </button>
              </div>
            </form>
          </div>

          {/* AI Assistant Panel */}
          <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5">
            <p className="text-teal-600 text-[10px] font-bold tracking-[0.18em] uppercase mb-2">AI ASSISTANT</p>
            <h2 className="text-[#18181b] text-2xl font-bold mb-6">Smart request<br />guidance</h2>

            <button
              type="button"
              onClick={handleAiSuggest}
              disabled={(!formData.title && !formData.description) || isAiLoading}
              className="w-full mb-6 py-2.5 rounded-full border border-teal-200 text-teal-700 text-sm font-semibold hover:bg-teal-50 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {isAiLoading ? (
                <span className="animate-spin inline-block w-4 h-4 border-2 border-teal-300 border-t-teal-600 rounded-full" />
              ) : '✦'}
              Analyze with AI
            </button>

            <div className="space-y-4 divide-y divide-neutral-100">
              <div className="flex items-start justify-between pb-4">
                <span className="text-neutral-500 text-sm">Suggested category</span>
                <span className="text-[#18181b] text-sm font-bold">{aiData.category}</span>
              </div>
              <div className="flex items-start justify-between py-4">
                <span className="text-neutral-500 text-sm">Detected urgency</span>
                <span className="text-[#18181b] text-sm font-bold">{aiData.urgency}</span>
              </div>
              <div className="flex items-start justify-between py-4">
                <span className="text-neutral-500 text-sm">Suggested tags</span>
                <span className="text-[#18181b] text-sm font-bold text-right max-w-[55%]">{aiData.tags}</span>
              </div>
              <div className="flex items-start gap-4 pt-4">
                <span className="text-neutral-500 text-sm shrink-0">Rewrite suggestion</span>
                <span className="text-[#18181b] text-sm font-bold">{aiData.rewrite}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
