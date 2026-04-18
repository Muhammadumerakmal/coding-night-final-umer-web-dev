"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

const roles = [
  {
    id: "Need Help",
    icon: "🙋",
    title: "Need Help",
    desc: "Post requests and get matched with community experts who can solve your problems.",
    gradient: "from-violet-500 to-purple-600",
    border: "border-violet-500",
  },
  {
    id: "Can Help",
    icon: "🤝",
    title: "Can Help",
    desc: "Browse open requests, lend your expertise, and earn trust scores and badges.",
    gradient: "from-cyan-500 to-blue-600",
    border: "border-cyan-500",
  },
  {
    id: "Both",
    icon: "⚡",
    title: "Both",
    desc: "The full experience — request help when you need it and help others when you can.",
    gradient: "from-emerald-500 to-teal-600",
    border: "border-emerald-500",
  },
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { refreshUser, loading: authLoading } = useAuth();

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await api.put("auth/profile", { supportRole: selected });
      await refreshUser();
      // Redirect is handled by AuthContext after refreshUser updates state
    } catch (err) {
      console.error("Failed to update role", err);
      setLoading(false);
    }
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
      {/* Logo */}
      <div className="mb-10 text-center">
        <span className="text-4xl font-extrabold bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
          Helplytics <span className="text-white/80">AI</span>
        </span>
        <p className="mt-2 text-white/50 text-sm tracking-widest uppercase">
          Community Support Platform
        </p>
      </div>

      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            How do you want to participate?
          </h1>
          <p className="text-white/50">
            Choose your role — you can change this anytime in settings.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {roles.map((role) => (
            <button
              key={role.id}
              id={`role-${role.id.replace(/\s/g, "-").toLowerCase()}`}
              onClick={() => setSelected(role.id)}
              className={`group relative rounded-2xl border-2 p-6 text-left transition-all duration-300 ${
                selected === role.id
                  ? `${role.border} bg-white/5`
                  : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
              }`}
            >
              {selected === role.id && (
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${role.gradient} opacity-10`}
                />
              )}
              <div className="text-4xl mb-4">{role.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">
                {role.title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {role.desc}
              </p>
              {selected === role.id && (
                <div
                  className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${role.gradient} text-white`}
                >
                  ✓ Selected
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            id="onboarding-continue"
            onClick={handleContinue}
            disabled={!selected || loading}
            className="px-10 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                Setting up your dashboard…
              </>
            ) : (
              "Continue to Dashboard →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
