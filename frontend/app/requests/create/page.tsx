'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';

const categories = ['Technology', 'Design', 'Writing', 'Business', 'Education', 'Health', 'Legal', 'Finance', 'Other'];
const urgencies = ['Low', 'Medium', 'High', 'Critical'];

export default function CreateRequestPage() {
  const router = useRouter();
  const { loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    urgencyLevel: 'Medium',
    aiSuggestedTags: [] as string[]
  });
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (authLoading) return null;

  const handleAiSuggest = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      const text = (formData.title + ' ' + formData.description).toLowerCase();
      let tags: string[] = [];
      let cat = formData.category;

      if (text.includes('react') || text.includes('next.js')) {
        tags = ['react', 'frontend', 'javascript'];
        cat = 'Technology';
      } else if (text.includes('design') || text.includes('logo') || text.includes('ui')) {
        tags = ['ui/ux', 'design', 'figma'];
        cat = 'Design';
      } else if (text.includes('contract') || text.includes('nda')) {
        tags = ['law', 'contracts'];
        cat = 'Legal';
      } else if (text.length > 10) {
        tags = ['general-help', 'review'];
      }

      setFormData(prev => ({
        ...prev,
        category: cat,
        aiSuggestedTags: tags
      }));
      setIsAiLoading(false);
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/requests', formData);
      router.push(`/requests/${data._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create request');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-10 flex justify-center">
      <div className="w-full max-w-2xl">
        <a href="/dashboard" className="text-white/40 hover:text-white text-sm transition-colors block mb-6">← Dashboard</a>
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Post a Request</h1>
            <p className="text-white/40 text-sm">Describe what you need help with.</p>
          </div>
          <button 
            type="button" 
            onClick={handleAiSuggest}
            disabled={(!formData.title && !formData.description) || isAiLoading}
            className="px-4 py-2 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-sm font-semibold border border-violet-500/20 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isAiLoading ? <span className="animate-spin inline-block w-4 h-4 border-2 border-violet-400/30 border-t-violet-400 rounded-full" /> : <span>✦</span>}
            AI Magic Fill
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Need help debugging Next.js auth"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-violet-500/60 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide details about your issue..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-violet-500/60 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white/80 outline-none focus:border-violet-500/60 transition-colors"
                >
                  {categories.map(c => <option key={c} value={c} className="bg-[#0a0a0f]">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Urgency</label>
                <select
                  value={formData.urgencyLevel}
                  onChange={e => setFormData({ ...formData, urgencyLevel: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white/80 outline-none focus:border-violet-500/60 transition-colors"
                >
                  {urgencies.map(u => <option key={u} value={u} className="bg-[#0a0a0f]">{u}</option>)}
                </select>
              </div>
            </div>

            {formData.aiSuggestedTags.length > 0 && (
              <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/10">
                <p className="text-xs text-violet-400 mb-2 font-medium">✦ AI Suggested Tags</p>
                <div className="flex flex-wrap gap-2">
                  {formData.aiSuggestedTags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-white/80">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
