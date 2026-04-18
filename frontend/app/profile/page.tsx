'use client';

import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { useState } from 'react';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  const [name, setName] = useState(user?.username || 'Ayesha Khan');
  const [location, setLocation] = useState('Karachi');
  const [skills, setSkills] = useState('Figma, UI/UX, HTML/CSS, Career Guidance');
  const [interests, setInterests] = useState('Hackathons, UI/UX, Community Building');
  const [saved, setSaved] = useState(false);

  if (loading) return null;

  const displayName = user?.username || 'Ayesha Khan';
  const role = user?.supportRole || 'Both';

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const skillTags = skills.split(',').map(s => s.trim()).filter(Boolean);
  const badges = user?.engagementMetrics?.badges?.length
    ? user.engagementMetrics.badges
    : ['Design Ally', 'Fast Responder', 'Top Mentor'];
  const trustScore = user?.engagementMetrics?.trustScore ?? 100;
  const contributions = user?.engagementMetrics?.contributions ?? 35;

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
            <Link href="/onboarding" className="text-neutral-500 text-sm font-medium hover:text-neutral-800 transition-colors">Onboarding</Link>
            <Link href="/profile" className="text-sm font-semibold px-4 py-1.5 rounded-full border border-neutral-300 bg-white text-[#18181b] hover:bg-neutral-50 transition-colors">Profile</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-[1300px] mx-auto px-6 py-10 pb-24">
        {/* Hero Dark Banner */}
        <div className="rounded-[1.5rem] p-10 mb-10" style={{ background: '#1c2b27' }}>
          <p className="text-teal-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">PROFILE</p>
          <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight mb-2">{displayName}</h1>
          <p className="text-neutral-400 text-sm">{role} • {location}</p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Public Profile */}
          <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5">
            <p className="text-teal-600 text-[10px] font-bold tracking-[0.18em] uppercase mb-2">PUBLIC PROFILE</p>
            <h2 className="text-[#18181b] text-2xl font-bold mb-8">Skills and reputation</h2>

            <div className="space-y-5">
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <span className="text-neutral-600 text-sm">Trust score</span>
                <span className="text-[#18181b] text-sm font-semibold">{trustScore}%</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <span className="text-neutral-600 text-sm">Contributions</span>
                <span className="text-[#18181b] text-sm font-semibold">{contributions}</span>
              </div>

              <div className="py-3 border-b border-neutral-100">
                <p className="text-neutral-700 text-sm font-semibold mb-3">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {skillTags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-semibold text-teal-700 border border-teal-200 bg-teal-50">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="py-3">
                <p className="text-neutral-700 text-sm font-semibold mb-3">Badges</p>
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge: string) => (
                    <span key={badge} className="px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-600 border border-neutral-200 bg-neutral-50">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile */}
          <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5">
            <p className="text-teal-600 text-[10px] font-bold tracking-[0.18em] uppercase mb-2">EDIT PROFILE</p>
            <h2 className="text-[#18181b] text-3xl font-bold leading-tight mb-6">Update your<br />identity</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-neutral-600 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-[#18181b] outline-none focus:border-teal-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-neutral-600 text-sm mb-2">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-[#18181b] outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-neutral-600 text-sm mb-2">Skills</label>
              <input
                type="text"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-[#18181b] outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            <div className="mb-6">
              <label className="block text-neutral-600 text-sm mb-2">Interests</label>
              <input
                type="text"
                value={interests}
                onChange={e => setInterests(e.target.value)}
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-[#18181b] outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors"
            >
              {saved ? 'Saved!' : 'Save profile'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
