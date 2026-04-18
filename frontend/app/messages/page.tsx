'use client';

import Link from 'next/link';
import { useState } from 'react';

const conversations = [
  {
    from: 'Ayesha Khan',
    to: 'Sara Noor',
    message: 'I checked your portfolio request. Share the breakpoint screenshots and I can suggest fixes.',
    time: '09:45 AM',
    unread: true,
  },
  {
    from: 'Hassan Ali',
    to: 'Ayesha Khan',
    message: 'Your event poster concept is solid. I would tighten the CTA and reduce the background texture.',
    time: '11:10 AM',
    unread: false,
  },
];

const users = ['Ayesha Khan', 'Hassan Ali', 'Sara Noor', 'Bilal Ahmed'];

export default function MessagesPage() {
  const [to, setTo] = useState('Ayesha Khan');
  const [message, setMessage] = useState('');

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
            <Link href="/messages" className="text-sm font-semibold px-4 py-1.5 rounded-full border border-neutral-300 bg-white text-[#18181b] hover:bg-neutral-50 transition-colors">Messages</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-[1300px] mx-auto px-6 py-10 pb-24">
        {/* Hero Dark Banner */}
        <div className="rounded-[1.5rem] p-10 mb-10" style={{ background: '#1c2b27' }}>
          <p className="text-teal-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">INTERACTION / MESSAGING</p>
          <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight mb-4 max-w-3xl">
            Keep support moving through direct communication.
          </h1>
          <p className="text-neutral-400 text-sm max-w-xl">
            Basic messaging gives helpers and requesters a clear follow-up path once a match happens.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
          {/* Conversation Stream */}
          <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5">
            <p className="text-teal-600 text-[10px] font-bold tracking-[0.18em] uppercase mb-2">CONVERSATION STREAM</p>
            <h2 className="text-[#18181b] text-2xl font-bold mb-6">Recent messages</h2>

            <div className="space-y-1">
              {conversations.map((conv, i) => (
                <div key={i} className="py-5 border-b border-neutral-100 last:border-0 flex items-start justify-between gap-4 cursor-pointer hover:bg-neutral-50 -mx-2 px-2 rounded-xl transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-[#18181b] text-sm font-semibold mb-1">
                      {conv.from} <span className="text-neutral-400 font-normal">→</span> {conv.to}
                    </p>
                    <p className="text-neutral-500 text-sm leading-relaxed">{conv.message}</p>
                  </div>
                  <div
                    className="shrink-0 w-14 h-14 rounded-full flex flex-col items-center justify-center text-[11px] font-semibold text-teal-700"
                    style={{ background: '#e6f4f1', border: '1px solid #c4e2da' }}
                  >
                    <span className="leading-none">{conv.time.split(' ')[0]}</span>
                    <span className="leading-none text-[10px] mt-0.5">{conv.time.split(' ')[1]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Send Message */}
          <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5">
            <p className="text-teal-600 text-[10px] font-bold tracking-[0.18em] uppercase mb-2">SEND MESSAGE</p>
            <h2 className="text-[#18181b] text-3xl font-bold leading-tight mb-6">Start a<br />conversation</h2>

            <div className="mb-4">
              <label className="block text-neutral-600 text-sm mb-2">To</label>
              <div className="relative">
                <select
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[#18181b] text-sm appearance-none outline-none focus:border-teal-500 transition-colors bg-white"
                >
                  {users.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">▼</div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-neutral-600 text-sm mb-2">Message</label>
              <textarea
                rows={5}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Share support details, ask for files, or suggest next steps."
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-[#18181b] placeholder-neutral-400 outline-none focus:border-teal-500 transition-colors resize-none"
              />
            </div>

            <button className="w-full py-3.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors">
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
