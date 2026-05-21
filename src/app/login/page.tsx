"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { AlertCircle, LogIn, Phone, Lock } from "lucide-react";

export default function Login() {
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ phoneNumber: "", password: "" });
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.message || "Login failed"); return; }
      router.push("/sos");
    } catch (err: any) {
      setLoginError(err.message || "Something went wrong");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-b from-[#1a0623] via-slate-950 to-black px-4 py-10">

      <div className="relative w-full max-w-sm sm:max-w-md">

        {/* Card */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-2xl shadow-black/50">

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-pink-400 font-medium">
              Welcome back
            </p>
            <h1 className="mt-1.5 text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Sign in to Rakshak
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-[11px] sm:text-xs font-medium uppercase tracking-wider text-slate-400">
                Phone number
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                  className="pl-9 rounded-xl border-slate-700/80 bg-slate-950/80 text-sm text-white placeholder-slate-600 focus:border-pink-500/60 focus:ring-pink-500/15"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-[11px] sm:text-xs font-medium uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <Input
                  type="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="pl-9 rounded-xl border-slate-700/80 bg-slate-950/80 text-sm text-white placeholder-slate-600 focus:border-pink-500/60 focus:ring-pink-500/15"
                />
              </div>
            </div>

            {/* Error */}
            {loginError && (
              <div className="flex items-start gap-2 rounded-xl bg-rose-500/10 px-3.5 py-3 text-xs sm:text-sm text-rose-300 ring-1 ring-rose-500/20">
                <AlertCircle size={14} className="mt-0.5 shrink-0 text-rose-400" />
                {loginError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loginLoading}
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-600/25 transition hover:bg-pink-400 active:scale-[0.98] disabled:opacity-60"
            >
              <LogIn size={15} />
              {loginLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>




        </div>
      </div>
    </div>
  );
}