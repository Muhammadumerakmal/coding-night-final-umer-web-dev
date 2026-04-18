'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: number;
  from: string;
  preview: string;
  time: string;
  unread: boolean;
  avatar: string;
}

const mockConversations: Message[] = [
  { id: 1, from: 'sarah_dev', preview: 'Hey! I saw your request about Next.js auth, I think I can help.', time: '2m ago', unread: true, avatar: '👩‍💻' },
  { id: 2, from: 'mike_entrepreneur', preview: 'Thanks for reviewing my business plan!', time: '1h ago', unread: true, avatar: '👨‍💼' },
  { id: 3, from: 'alex_founder', preview: 'The Figma prototype is ready, check your notifications.', time: '3h ago', unread: false, avatar: '🎨' },
];

const mockMessages = [
  { id: 1, sender: 'sarah_dev', text: 'Hey! I saw your request about the Next.js auth flow issue.', time: '10:01 AM', mine: false },
  { id: 2, sender: 'me', text: 'Oh great! Yes, I\'ve been struggling with the 401 on refresh.', time: '10:03 AM', mine: true },
  { id: 3, sender: 'sarah_dev', text: 'I think the issue is your Axios interceptor isn\'t queuing requests during refresh. Here\'s the pattern I use:', time: '10:05 AM', mine: false },
  { id: 4, sender: 'sarah_dev', text: 'Set a `isRefreshing` flag and push all 401 responses to a retry queue. Once the token refreshes, flush the queue.', time: '10:05 AM', mine: false },
  { id: 5, sender: 'me', text: 'That makes sense! Let me try implementing that.', time: '10:08 AM', mine: true },
];

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState<number | null>(1);
  const [input, setInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/auth');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <div className="flex-1 flex max-w-5xl mx-auto w-full">
        {/* Conversation List */}
        <div className="w-full sm:w-72 border-r border-white/5 flex flex-col">
          <div className="px-5 py-5 border-b border-white/5">
            <a href="/dashboard" className="text-white/30 text-xs hover:text-white transition-colors">← Dashboard</a>
            <h1 className="text-lg font-bold text-white mt-1">Messages</h1>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockConversations.map(conv => (
              <button
                key={conv.id}
                id={`conv-${conv.id}`}
                onClick={() => setActiveConv(conv.id)}
                className={`w-full text-left px-5 py-4 border-b border-white/5 flex items-start gap-3 transition-all ${activeConv === conv.id ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'}`}
              >
                <span className="text-2xl">{conv.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white truncate">@{conv.from}</span>
                    <span className="text-xs text-white/25 shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-xs text-white/40 truncate mt-0.5">{conv.preview}</p>
                </div>
                {conv.unread && <div className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="hidden sm:flex flex-1 flex-col">
          {activeConv ? (
            <>
              <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                <span className="text-2xl">{mockConversations.find(c => c.id === activeConv)?.avatar}</span>
                <div>
                  <p className="text-sm font-semibold text-white">@{mockConversations.find(c => c.id === activeConv)?.from}</p>
                  <p className="text-xs text-emerald-400">Online</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {mockMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.mine ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-br-sm' : 'bg-white/[0.06] text-white/80 rounded-bl-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-white/5 flex gap-3">
                <input
                  id="message-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-violet-500/50 transition-colors"
                  onKeyDown={e => { if (e.key === 'Enter') setInput(''); }}
                />
                <button
                  id="send-message-btn"
                  onClick={() => setInput('')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
