'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

const categories = ['Technology', 'Design', 'Writing', 'Business', 'Education', 'Health', 'Legal', 'Finance', 'Other'];
const urgencies = [
  { value: 'Low', label: '🟢 Low', color: 'text-emerald-400' },
  { value: 'Medium', label: '🟡 Medium', color: 'text-yellow-400' },
  { value: 'High', label: '🟠 High', color: 'text-orange-400' },
  { value: 'Critical', label: '🔴 Critical', color: 'text-red-400' },
];

const steps = ['Details', 'Urgency', 'Review'];

export default function CreateRequestPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Technology',
    urgencyLevel: 'Medium',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { loading: authLoading } = useAuth();

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('items', form);
      router.push('/dashboard');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const canNext = () => {
    if (step === 0) return form.title.trim().length > 5 && form.description.trim().length > 10 && form.category;
    if (step === 1) return !!form.urgencyLevel;
    return true;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl">
        {/* Back */}
        <a href="/dashboard" className="text-white/40 hover:text-white text-sm transition-colors mb-6 inline-block">← Dashboard</a>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${i < step ? 'bg-violet-600 border-violet-600 text-white' : i === step ? 'border-violet-500 text-violet-400' : 'border-white/10 text-white/30'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-sm ${i === step ? 'text-white' : 'text-white/30'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`h-px w-8 ${i < step ? 'bg-violet-600' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-8">
          {/* Step 0: Details */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-xl font-bold text-white mb-1">Describe your request</h1>
                <p className="text-white/40 text-sm">The more detail you provide, the better AI can match you.</p>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Title *</label>
                <input
                  id="request-title"
                  type="text"
                  placeholder="e.g. Need help debugging my auth flow"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet-500/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Description *</label>
                <textarea
                  id="request-description"
                  placeholder="Explain your situation in detail…"
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  rows={4}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet-500/60 transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Category *</label>
                <select
                  id="request-category"
                  value={form.category}
                  onChange={e => set('category', e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500/60 transition-colors"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 1: Urgency */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">How urgent is this?</h2>
                <p className="text-white/40 text-sm">This affects how prominently your request is shown in the feed.</p>
              </div>
              <div className="space-y-3">
                {urgencies.map(u => (
                  <button
                    key={u.value}
                    id={`urgency-${u.value.toLowerCase()}`}
                    onClick={() => set('urgencyLevel', u.value)}
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl border text-left transition-all ${form.urgencyLevel === u.value ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20'}`}
                  >
                    <span className={`font-semibold ${u.color}`}>{u.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Review your request</h2>
                <p className="text-white/40 text-sm">AI will auto-generate tags and match you after posting.</p>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="space-y-3">
                {[
                  { label: 'Title', value: form.title },
                  { label: 'Category', value: form.category },
                  { label: 'Urgency', value: form.urgencyLevel },
                ].map(item => (
                  <div key={item.label} className="rounded-xl bg-white/[0.04] border border-white/8 px-4 py-3">
                    <p className="text-xs text-white/40 mb-0.5">{item.label}</p>
                    <p className="text-sm text-white font-medium">{item.value}</p>
                  </div>
                ))}
                <div className="rounded-xl bg-white/[0.04] border border-white/8 px-4 py-3">
                  <p className="text-xs text-white/40 mb-0.5">Description</p>
                  <p className="text-sm text-white/80 leading-relaxed">{form.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/30 bg-violet-500/5 border border-violet-500/20 rounded-xl px-4 py-3">
                <span className="text-violet-400">✦</span>
                AI will automatically generate tags and match you with the best helpers.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <button onClick={() => setStep(s => s - 1)} className="text-sm text-white/40 hover:text-white transition-colors">
                ← Back
              </button>
            ) : <div />}
            {step < steps.length - 1 ? (
              <button
                id="next-step-btn"
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                Next →
              </button>
            ) : (
              <button
                id="submit-request-btn"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold disabled:opacity-40 flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                {loading ? <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : null}
                Post Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
