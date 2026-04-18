import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] selection:bg-violet-500/30">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[20%] w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-extrabold bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Helplytics AI
          </span>
          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/auth" className="text-sm font-medium px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            Community Support Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
            Connecting those who need help <br className="hidden md:block"/>
            with those who <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">can provide it.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10">
            Helplytics AI is a smart tracking and matchmaking platform for learning communities. Ask questions, offer guidance, and build your reputation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-base font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25">
              Join the Community
            </Link>
            <Link href="/explore" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-base font-semibold hover:bg-white/10 transition-colors">
              Explore Requests
            </Link>
          </div>
        </section>

        {/* Community Stats */}
        <section className="border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: 'Active Users', value: '4,200+' },
                { label: 'Requests Solved', value: '12,500+' },
                { label: 'Avg. Response Time', value: '< 10 mins' },
                { label: 'Community Rating', value: '4.9/5' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Overview */}
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-white/40">Powered by AI to make community support seamless.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Smart Categorization',
                desc: 'Our AI auto-tags your requests based on the content, ensuring it reaches the right experts instantly.'
              },
              {
                icon: '🤝',
                title: 'Skill Matchmaking',
                desc: 'We match your profile skills with urgent requests so you can jump in where you are needed most.'
              },
              {
                icon: '🏆',
                title: 'Trust & Reputation',
                desc: 'Earn points and badges for every request you help solve. Climb the leaderboard and build your portfolio.'
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-violet-500/20 transition-all" />
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-32">
          <div className="max-w-5xl mx-auto px-6">
            <div className="rounded-3xl bg-gradient-to-br from-violet-900/40 to-cyan-900/40 border border-white/10 p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">Stop struggling alone.</h2>
              <p className="text-lg text-white/60 max-w-xl mx-auto mb-10 relative z-10">
                Join thousands of developers, designers, and creators who are learning and building together.
              </p>
              <Link href="/auth" className="relative z-10 px-8 py-4 rounded-xl bg-white text-black text-base font-bold hover:bg-white/90 transition-colors inline-block">
                Create Free Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center">
        <p className="text-white/30 text-sm">© 2026 Helplytics AI. A product-building challenge.</p>
      </footer>
    </div>
  );
}
