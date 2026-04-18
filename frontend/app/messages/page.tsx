'use client';

import Link from 'next/link';

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-10 flex justify-center">
      <div className="w-full max-w-4xl h-[80vh] flex flex-col relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5">
        
        {/* Header */}
        <div className="h-16 border-b border-white/5 bg-[#0d0d14] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-white/40 hover:text-white mr-2">←</Link>
            <div className="font-semibold text-white">Messages</div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
           {/* Sidebar */}
          <div className="w-1/3 border-r border-white/5 bg-[#0d0d14]/50 overflow-y-auto">
             {[
               { name: "sarah_dev", active: true, msg: "Sure, I can map out the auth flow!" },
               { name: "mike_entrepreneur", active: false, msg: "Thank you for the review." },
               { name: "alex_founder", active: false, msg: "When are you free?" }
             ].map((chat, i) => (
                <div key={i} className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors ${chat.active ? 'bg-violet-500/10 border-l-2 border-l-violet-500' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-medium shrink-0">
                      {chat.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{chat.name}</h4>
                      <p className="text-xs text-white/50 truncate">{chat.msg}</p>
                    </div>
                  </div>
                </div>
             ))}
          </div>

          {/* Chat pane */}
          <div className="flex-1 flex flex-col bg-[#0a0a0f] relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
            
            <div className="p-6 border-b border-white/5 flex items-center justify-between z-10 bg-[#0a0a0f]">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-600 flex items-center justify-center text-white font-medium">S</div>
                 <div>
                   <div className="text-sm font-bold text-white">sarah_dev</div>
                   <div className="text-xs text-emerald-400">Online</div>
                 </div>
               </div>
               <button className="text-white/40 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs">View Request</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 z-10">
               <div className="flex justify-start">
                 <div className="bg-white/10 text-white rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[70%] text-sm">
                   Hey! I saw your request about Next.js Auth. I've built something similar recently.
                 </div>
               </div>
               <div className="flex justify-end">
                 <div className="bg-violet-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[70%] text-sm">
                   That would be awesome! I'm stuck on the JWT refresh token piece. It keeps logging me out.
                 </div>
               </div>
               <div className="flex justify-start">
                 <div className="bg-white/10 text-white rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[70%] text-sm">
                   Sure, I can map out the auth flow! Are you using Axios interceptors?
                 </div>
               </div>
            </div>

            <div className="p-4 bg-[#0d0d14] border-t border-white/5 z-10">
              <div className="relative">
                <input type="text" placeholder="Type a message..." className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/50" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors">
                  ↑
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
