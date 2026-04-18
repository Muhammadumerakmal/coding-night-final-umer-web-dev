import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="w-full z-10 px-6 py-6 max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-teal-600 flex flex-col items-center justify-center text-white font-bold text-lg">
            H
          </div>
          <span className="font-bold text-[#18181b] text-lg">HelpHub AI</span>
        </div>
        
        <div className="hidden md:flex items-center gap-1 bg-white/40 border border-black/5 rounded-full px-2 py-1">
          <Link href="/" className="px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-800 text-sm font-medium">Home</Link>
          <Link href="/explore" className="px-4 py-1.5 rounded-full text-neutral-600 hover:bg-black/5 text-sm font-medium transition-colors">Explore</Link>
          <Link href="/leaderboard" className="px-4 py-1.5 rounded-full text-neutral-600 hover:bg-black/5 text-sm font-medium transition-colors">Leaderboard</Link>
          <Link href="/ai-center" className="px-4 py-1.5 rounded-full text-neutral-600 hover:bg-black/5 text-sm font-medium transition-colors">AI Center</Link>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="hidden sm:block text-sm font-medium text-neutral-600 hover:text-neutral-900 drop-shadow-sm">
            Live community signals
          </a>
          <Link href="/auth" className="px-5 py-2.5 rounded-full bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm">
            Join the platform
          </Link>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 pt-12 pb-24">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-start justify-between mb-32">
          {/* Left Column */}
          <div className="lg:w-[55%]">
            <div className="text-teal-700 text-[11px] font-bold tracking-widest uppercase mb-6">
              SMIT GRAND CODING NIGHT 2026
            </div>
            
            <h1 className="text-[3.5rem] md:text-[4.5rem] leading-[1.05] font-extrabold text-[#18181b] tracking-tight mb-6">
              Find help faster.<br/>
              Become help that matters.
            </h1>
            
            <p className="text-neutral-600 text-lg leading-relaxed max-w-xl mb-10">
              HelpHub AI is a community-powered support network for students, mentors, creators, and builders. Ask for help, offer help, track impact, and let AI surface smarter matches across the platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
              <Link href="/auth" className="w-full sm:w-auto px-6 py-3 rounded-full bg-teal-600 text-white text-[15px] font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                Open product demo
              </Link>
              <Link href="/requests/create" className="w-full sm:w-auto px-6 py-3 rounded-[2rem] bg-white border border-neutral-200 text-[#18181b] text-[15px] font-semibold hover:bg-neutral-50 transition-colors flex items-center justify-center shadow-sm">
                Post a request
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-black/5">
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Members</div>
                <div className="text-[2.5rem] leading-none font-extrabold text-[#18181b] mb-4">384+</div>
                <p className="text-neutral-500 text-sm leading-snug">Students, mentors, and helpers in the loop.</p>
              </div>
              <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-black/5">
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Requests</div>
                <div className="text-[2.5rem] leading-none font-extrabold text-[#18181b] mb-4">72+</div>
                <p className="text-neutral-500 text-sm leading-snug">Support posts shared across learning journeys.</p>
              </div>
              <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-black/5">
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Solved</div>
                <div className="text-[2.5rem] leading-none font-extrabold text-[#18181b] mb-4">69+</div>
                <p className="text-neutral-500 text-sm leading-snug">Problems resolved through fast community action.</p>
              </div>
            </div>
          </div>

          {/* Right Column (Dark Hero Block) */}
          <div className="lg:w-[42%] w-full bg-[#1A2421] rounded-[2.5rem] p-10 relative overflow-hidden shadow-xl">
            <div className="flex justify-between items-start mb-10">
              <div className="text-teal-400 text-[11px] font-bold tracking-widest uppercase">Live Product Feel</div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-amber-600 shadow-[0_0_40px_rgba(251,191,36,0.3)]"></div>
            </div>

            <h2 className="text-[2.75rem] font-bold text-white leading-tight mb-6">
              More than a form.<br/>
              More like an ecosystem.
            </h2>

            <p className="text-neutral-400 text-[15px] leading-relaxed mb-10 pr-4">
              A polished multi-page experience inspired by product platforms, with AI summaries, trust scores, contribution signals, notifications, and leaderboard momentum built directly in HTML, CSS, JavaScript, and LocalStorage.
            </p>

            <div className="space-y-4">
              <div className="bg-[#FCFBF7] rounded-[1.5rem] p-6 shadow-sm">
                <h3 className="text-[#18181b] font-bold text-[17px] mb-2">AI request intelligence</h3>
                <p className="text-neutral-600 text-[15px] leading-snug">Auto-categorization, urgency detection, tags, rewrite suggestions, and trend snapshots.</p>
              </div>
              <div className="bg-[#FCFBF7] rounded-[1.5rem] p-6 shadow-sm">
                <h3 className="text-[#18181b] font-bold text-[17px] mb-2">Community trust graph</h3>
                <p className="text-neutral-600 text-[15px] leading-snug">Badges, helper rankings, trust score boosts, and visible contribution history.</p>
              </div>
              <div className="bg-[#FCFBF7] rounded-[1.5rem] p-6 shadow-sm">
                <h3 className="text-[#18181b] font-bold text-[17px] mb-2">100%</h3>
                <p className="text-neutral-600 text-[15px] leading-snug">Top trust score currently active across the sample mentor network.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Flow */}
        <section className="mb-32">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8">
            <div>
              <div className="text-teal-700 text-[11px] font-bold tracking-widest uppercase mb-3">Core Flow</div>
              <h2 className="text-[2.25rem] font-bold text-[#18181b]">From struggling alone to solving together</h2>
            </div>
            <button className="hidden sm:block px-6 py-2.5 rounded-full border border-neutral-200 text-[#18181b] text-sm font-semibold hover:bg-white transition-colors bg-[#FCFBF7] shadow-sm">
              Try onboarding AI
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5">
              <h3 className="text-[1.15rem] font-bold text-[#18181b] mb-3">Ask for help clearly</h3>
              <p className="text-neutral-500 text-[15px] leading-relaxed mb-4">Create structured requests with category, urgency, AI suggestions, and tags that attract the right people.</p>
            </div>
            <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5">
              <h3 className="text-[1.15rem] font-bold text-[#18181b] mb-3">Discover the right people</h3>
              <p className="text-neutral-500 text-[15px] leading-relaxed mb-4">Use the explore feed, helper lists, notifications, and messaging to move quickly once a match happens.</p>
            </div>
            <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5">
              <h3 className="text-[1.15rem] font-bold text-[#18181b] mb-3">Track real contribution</h3>
              <p className="text-neutral-500 text-[15px] leading-relaxed mb-4">Trust scores, badges, solved requests, and rankings help the community recognize meaningful support.</p>
            </div>
          </div>
        </section>

        {/* Featured Requests */}
        <section className="mb-24">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8">
            <div>
              <div className="text-teal-700 text-[11px] font-bold tracking-widest uppercase mb-3">Featured Requests</div>
              <h2 className="text-[2.25rem] font-bold text-[#18181b]">Community problems currently in motion</h2>
            </div>
            <Link href="/explore" className="hidden sm:block px-6 py-2.5 rounded-full border border-neutral-200 text-[#18181b] text-sm font-semibold hover:bg-white transition-colors bg-[#FCFBF7] shadow-sm">
              View full feed
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5 flex flex-col h-full">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold tracking-wide uppercase border border-teal-100">Web Development</span>
                <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-bold tracking-wide uppercase border border-red-100">High</span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold tracking-wide uppercase border border-emerald-100">Solved</span>
              </div>
              <h3 className="text-xl font-bold text-[#18181b] mb-3 leading-tight">Need help</h3>
              <p className="text-neutral-500 text-[15px] leading-relaxed mb-8 line-clamp-3">helpn needed</p>
              <div className="mt-auto pt-6 flex items-end justify-between">
                <div>
                  <div className="font-bold text-[#18181b] text-[15px] mb-1">Ayesha Khan</div>
                  <div className="text-neutral-500 text-[13px] text-nowrap">Karachi • 1 helper interested</div>
                </div>
                <button className="px-5 py-2.5 rounded-full border border-neutral-200 text-[#18181b] text-[13px] font-semibold hover:bg-neutral-50 transition-colors whitespace-nowrap ml-2 shadow-sm">
                  Open details
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5 flex flex-col h-full">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold tracking-wide uppercase border border-teal-100">Web Development</span>
                <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-bold tracking-wide uppercase border border-red-100">High</span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold tracking-wide uppercase border border-emerald-100">Solved</span>
              </div>
              <h3 className="text-xl font-bold text-[#18181b] mb-3 leading-tight">Need help making my portfolio responsive before demo day</h3>
              <p className="text-neutral-500 text-[15px] leading-relaxed mb-6 line-clamp-2">My HTML/CSS portfolio breaks on tablets and I need layout guidance before tomorrow evening.</p>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[12px] font-medium border border-black/5">HTML/CSS</span>
                <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[12px] font-medium border border-black/5">Responsive</span>
                <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[12px] font-medium border border-black/5">Portfolio</span>
              </div>
              <div className="mt-auto pt-6 flex items-end justify-between">
                <div>
                  <div className="font-bold text-[#18181b] text-[15px] mb-1">Sara Noor</div>
                  <div className="text-neutral-500 text-[13px] text-nowrap">Karachi • 1 helper interested</div>
                </div>
                <button className="px-5 py-2.5 rounded-full border border-neutral-200 text-[#18181b] text-[13px] font-semibold hover:bg-neutral-50 transition-colors whitespace-nowrap ml-2 shadow-sm">
                  Open details
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/5 flex flex-col h-full">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold tracking-wide uppercase border border-teal-100">Design</span>
                <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold tracking-wide uppercase border border-teal-100">Medium</span>
                <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold tracking-wide uppercase border border-teal-100">Open</span>
              </div>
              <h3 className="text-xl font-bold text-[#18181b] mb-3 leading-tight">Looking for Figma feedback on a volunteer event poster</h3>
              <p className="text-neutral-500 text-[15px] leading-relaxed mb-6 line-clamp-2">I have a draft poster for a campus community event and want sharper hierarchy, spacing, and CTA copy.</p>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[12px] font-medium border border-black/5">Figma</span>
                <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[12px] font-medium border border-black/5">Poster</span>
                <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[12px] font-medium border border-black/5">Design Review</span>
              </div>
              <div className="mt-auto pt-6 flex items-end justify-between">
                <div>
                  <div className="font-bold text-[#18181b] text-[15px] mb-1">Ayesha Khan</div>
                  <div className="text-neutral-500 text-[13px] text-nowrap">Lahore • 1 helper interested</div>
                </div>
                <button className="px-5 py-2.5 rounded-full border border-neutral-200 text-[#18181b] text-[13px] font-semibold hover:bg-neutral-50 transition-colors whitespace-nowrap ml-2 shadow-sm">
                  Open details
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="text-center py-8">
        <p className="text-neutral-400 text-[13px]">HelpHub AI is built as a premium-feel, multi-page community support product using HTML, CSS, JavaScript, and LocalStorage.</p>
      </footer>
    </div>
  );
}
