"use client";

import { useState, FormEvent } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import axios from "axios";
import Link from "next/link";

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
    <div className="min-h-screen flex flex-col">
      {/* Navbar Minimal */}
      <nav className="w-full z-10 px-6 py-6 max-w-[1400px] mx-auto flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-teal-600 flex flex-col items-center justify-center text-white font-bold text-lg">
            H
          </div>
          <span className="font-bold text-[#18181b] text-lg">HelpHub AI</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-neutral-600 text-sm font-medium pointer-events-auto">Home</Link>
          <Link href="/explore" className="text-neutral-600 text-sm font-medium pointer-events-auto">Explore</Link>
          <Link href="/leaderboard" className="text-neutral-600 text-sm font-medium pointer-events-auto">Leaderboard</Link>
        </div>
      </nav>

      {/* Auth Content block */}
      <div className="flex-1 flex items-center justify-center p-6 -mt-16">
        <div className="flex flex-col lg:flex-row w-full max-w-5xl items-stretch gap-6 lg:gap-0">
          
          {/* Left Block */}
          <div className="lg:w-1/2 bg-[#1A2421] p-12 lg:p-14 lg:rounded-l-[2.5rem] lg:rounded-r-none rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col justify-center">
            <div className="text-teal-400 text-[11px] font-bold tracking-widest uppercase mb-6">
              COMMUNITY ACCESS
            </div>
            
            <h1 className="text-[3rem] font-bold text-white leading-[1.1] tracking-tight mb-6">
              Enter the support network.
            </h1>
            
            <p className="text-neutral-300 text-[15px] leading-relaxed mb-8 pr-4">
              Create an account or login below. Jump into a multi-page product flow designed for asking, offering, and tracking help with a premium interface.
            </p>
            
            <ul className="space-y-4 text-neutral-300 text-[14px]">
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
                <span>Role-based entry for Need Help, Can Help, or Both</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
                <span>Direct path into dashboard, requests, AI Center, and community feed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
                <span>Persistent session powered by secure tokens.</span>
              </li>
            </ul>
          </div>

          {/* Right Block */}
          <div className="lg:w-1/2 bg-white p-12 lg:p-14 lg:rounded-r-[2.5rem] lg:rounded-l-none rounded-[2rem] shadow-xl border border-black/5 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-teal-700 text-[11px] font-bold tracking-widest uppercase">
                {isLogin ? "LOGIN / SIGNUP" : "SIGNUP / LOGIN"}
              </span>
            </div>
            
            <h2 className="text-[2.25rem] font-bold text-[#18181b] leading-tight tracking-tight mb-8">
              Authenticate your community profile
            </h2>

            {/* Toggle tabs */}
            <div className="flex bg-neutral-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => { setIsLogin(true); setError(""); }}
                className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${isLogin ? 'bg-white text-[#18181b] shadow-sm' : 'text-neutral-500'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(""); }}
                 className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${!isLogin ? 'bg-white text-[#18181b] shadow-sm' : 'text-neutral-500'}`}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-[#18181b] text-[13px] font-semibold mb-2">
                    Select Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-[#18181b] outline-none focus:border-teal-500 transition-colors"
                    required
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex-1">
                  <label className="block text-[#18181b] text-[13px] font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-[#18181b] outline-none focus:border-teal-500 transition-colors"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[#18181b] text-[13px] font-semibold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-[#18181b] outline-none focus:border-teal-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3.5 rounded-full bg-teal-600 text-white text-[15px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-700 transition-colors flex items-center justify-center shadow-sm"
              >
                {loading ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  "Continue to dashboard"
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
