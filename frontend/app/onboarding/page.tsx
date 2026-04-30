'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    role: 'Both',
    skills: '',
    interests: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Mock AI Suggestion
  const [aiSuggestions, setAiSuggestions] = useState<{ helpWith: string[], learnNext: string[] } | null>(null);

  if (loading) return null;

  const handleAISuggest = () => {
    // Determine mock suggestions based on keywords in skills/interests
    const text = (formData.skills + " " + formData.interests).toLowerCase();
    
    let help = ['General Questions'];
    let learn = ['System Design', 'Advanced React Patterns'];

    if (text.includes('react') || text.includes('javascript')) {
      help = ['Frontend Bug Fixes', 'React Hooks', 'Component Design'];
      learn = ['Next.js App Router', 'State Management (Zustand/Redux)', 'Performance Optimization'];
    }
    
    if (text.includes('node') || text.includes('python')) {
      help = ['API Architecture', 'Database Queries', 'Server Errors'];
      learn = ['Docker & Containers', 'Cloud Deployment', 'Microservices'];
    }

    setAiSuggestions({ helpWith: help, learnNext: learn });
  };

  const finishOnboarding = async () => {
    setSubmitting(true);
    try {
      await api.put('/users/me', { supportRole: formData.role });
      // In a broader app, we might also save name, location, skills to the backend User model here
      router.push('/dashboard');
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white/40 text-sm font-medium">Step {step} of 3</span>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-violet-500 transition-all duration-300" 
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Let's set up your profile</h1>
          <p className="text-white/40 mt-1 pb-4 border-b border-white/5">Welcome, {user?.username}. We need just a few details.</p>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-violet-500/60"
                placeholder="e.g. Jane Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Location / Timezone</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-violet-500/60"
                placeholder="e.g. New York (EST)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">How do you plan to use Helplytics?</label>
              <div className="grid grid-cols-3 gap-3">
                {['Need Help', 'Can Help', 'Both'].map(role => (
                  <button
                    key={role}
                    onClick={() => setFormData({ ...formData, role })}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                      formData.role === role ? 'bg-violet-500/20 border-violet-500 text-violet-300' : 'bg-white/[0.04] border-white/10 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!formData.name}
              className="w-full py-4 rounded-xl bg-white text-black font-semibold mt-4 disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Your Skills (Comma separated)</label>
              <textarea
                rows={2}
                value={formData.skills}
                onChange={e => setFormData({ ...formData, skills: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-violet-500/60"
                placeholder="e.g. React, Python, UI Design..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Your Interests / Wants to Learn</label>
              <textarea
                rows={2}
                value={formData.interests}
                onChange={e => setFormData({ ...formData, interests: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-violet-500/60"
                placeholder="e.g. System Architecture, Rust, Machine Learning..."
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-4 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10"
              >
                Back
              </button>
              <button
                onClick={() => {
                  handleAISuggest();
                  setStep(3);
                }}
                disabled={!formData.skills && !formData.interests}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold disabled:opacity-50"
              >
                Let AI Analyze Profile →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-2xl p-6 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <span>✦</span> AI Profile Insights
              </h3>
              
              <div className="mb-5">
                <p className="text-sm font-medium text-white/60 mb-2">You can help others with:</p>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions?.helpWith.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-white/60 mb-2">We suggest you learn:</p>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions?.learnNext.map(topic => (
                    <span key={topic} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-cyan-200">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 py-4 rounded-xl bg-white/5 text-white font-semibold">Back</button>
              <button 
                onClick={finishOnboarding}
                disabled={submitting}
                className="flex-1 py-4 rounded-xl bg-white text-black font-semibold flex justify-center items-center gap-2"
              >
                {submitting ? 'Saving...' : 'Go to Dashboard'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
