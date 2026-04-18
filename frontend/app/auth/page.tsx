"use client";

import { useState, FormEvent } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import axios from "axios";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isLogin ? "auth/login" : "auth/register";
      const { data } = await api.post(endpoint, formData);

      login(data.token, data.user);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Something went wrong";
        if (err.response?.status === 409) {
          setError("This email is already registered. Please login instead.");
        } else if (err.response?.status === 400) {
          setError(errorMessage);
        } else if (err.response?.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(errorMessage);
        }
      } else {
        setError("An unexpected error occurred. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[20%] w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-extrabold bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Helplytics AI
          </span>
          <p className="mt-1.5 text-white/40 text-sm">
            AI-Powered Community Support Platform
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-8">
          {/* Tab Toggle */}
          <div className="flex rounded-xl bg-white/[0.04] border border-white/8 p-1 mb-7">
            <button
              id="tab-login"
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isLogin ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}
            >
              Sign In
            </button>
            <button
              id="tab-signup"
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isLogin ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}
            >
              Create Account
            </button>
          </div>

          <div className="mb-5">
            <h2 className="text-lg font-bold text-white">
              {isLogin ? "Welcome back 👋" : "Join the community ✦"}
            </h2>
            <p className="text-white/40 text-sm mt-0.5">
              {isLogin
                ? "Sign in to your Helplytics account."
                : "Create your free account and start helping or getting help."}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs text-white/50 mb-1.5">
                  Username
                </label>
                <input
                  id="input-username"
                  type="text"
                  placeholder="e.g. devguru_sam"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/60 transition-colors"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Email address
              </label>
              <input
                id="input-email"
                type="email"
                placeholder="you@example.com"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/60 transition-colors"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Password
              </label>
              <input
                id="input-password"
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/60 transition-colors"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  {isLogin ? "Signing in…" : "Creating account…"}
                </>
              ) : isLogin ? (
                "Sign In →"
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          {!isLogin && (
            <p className="text-center text-xs text-white/30 mt-4">
              By creating an account you agree to our Terms of Service and
              Privacy Policy.
            </p>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-white/20 mt-6">
          Helplytics AI · Community Support, reimagined.
        </p>
      </div>
    </div>
  );
}
