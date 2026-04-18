"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

interface HelpRequest {
  _id: string;
  title: string;
  description: string;
  category: string;
  urgencyLevel: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Completed" | "Closed";
  aiMetadata?: { tags: string[] };
}

const urgencyColors: Record<string, string> = {
  Low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  High: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Critical: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statusColors: Record<string, string> = {
  Open: "bg-cyan-500/20 text-cyan-400",
  "In Progress": "bg-violet-500/20 text-violet-400",
  Completed: "bg-emerald-500/20 text-emerald-400",
  Closed: "bg-white/10 text-white/40",
};

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/explore", label: "Explore", icon: "🔍" },
  { href: "/requests/create", label: "Post Request", icon: "➕" },
  { href: "/messages", label: "Messages", icon: "💬" },
  { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
  { href: "/ai-center", label: "AI Center", icon: "✦" },
  { href: "/notifications", label: "Notifications", icon: "🔔" },
];

export default function Dashboard() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const { user, loading: authLoading, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      const { data } = await api.get("items");
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user, fetchRequests]);

  const handleLogout = () => {
    logout();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  const role = user?.supportRole || "Both";

  const roleGreeting: Record<string, string> = {
    "Need Help": "🙋 Your requests, matched by AI",
    "Can Help": "🤝 People who need your expertise",
    Both: "⚡ Your personalized activity hub",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-white/5 bg-[#0d0d14] px-4 py-6">
        <div className="mb-8 px-2">
          <span className="text-xl font-extrabold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Helplytics AI
          </span>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="pt-4 border-t border-white/5">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-white/30 uppercase tracking-wider mb-0.5">
              Signed in as
            </p>
            <p className="text-sm font-medium text-white/80 truncate">
              {user?.username || "…"}
            </p>
            <span className="text-xs text-white/40">{role}</span>
          </div>
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            ⏻ Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {user?.username || "there"} 👋
              </h1>
              <p className="mt-1 text-white/40 text-sm">{roleGreeting[role]}</p>
            </div>
            <a
              href="/requests/create"
              id="create-request-btn"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              + Post a Request
            </a>
          </div>

          {/* Engagement Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Contributions",
                value: user?.engagementMetrics?.contributions ?? 0,
                icon: "🤝",
              },
              {
                label: "Trust Score",
                value: user?.engagementMetrics?.trustScore ?? 0,
                icon: "⭐",
              },
              {
                label: "Badges",
                value: user?.engagementMetrics?.badges?.length ?? 0,
                icon: "🏅",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/[0.03] border border-white/5 p-5"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-white/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Requests Feed */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {role === "Can Help"
                ? "Open Requests — Help Needed"
                : "My Recent Requests"}
            </h2>
            <a
              href="/explore"
              className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              View all →
            </a>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 rounded-2xl bg-white/[0.03] animate-pulse"
                />
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
              <p className="text-3xl mb-3">🌱</p>
              <p className="text-white/50 text-sm">No requests yet.</p>
              <a
                href="/requests/create"
                className="mt-4 inline-block text-sm text-violet-400 hover:underline"
              >
                Post the first one →
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.slice(0, 5).map((req) => (
                <a
                  key={req._id}
                  href={`/requests/${req._id}`}
                  className="block rounded-2xl bg-white/[0.03] border border-white/5 p-5 hover:border-white/15 hover:bg-white/[0.055] transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors truncate">
                        {req.title}
                      </h3>
                      <p className="text-white/40 text-sm mt-1 line-clamp-1">
                        {req.description}
                      </p>
                      {req.aiMetadata?.tags?.length ? (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {req.aiMetadata.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${urgencyColors[req.urgencyLevel] || urgencyColors.Medium}`}
                      >
                        {req.urgencyLevel}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${statusColors[req.status] || statusColors.Open}`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
