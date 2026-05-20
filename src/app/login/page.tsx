"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

      if (!res.ok) {
        setLoginError(data.message || "Login failed");
        return;
      }

      router.push("/sos");
    } catch (err: any) {
      setLoginError(err.message || "Something went wrong");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),transparent_55%)] from-slate-900 via-slate-950 to-[#100b1b] px-4 py-8">
      <Card className="w-full max-w-md border border-white/10 bg-slate-950/80 shadow-2xl shadow-fuchsia-700/10">
        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-300">Welcome back</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Sign in to your dashboard</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Phone Number</label>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {loginError && <p className="text-sm text-red-400">{loginError}</p>}

            <Button className="w-full py-3" type="submit">
              {loginLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-pink-300 hover:text-pink-200">
              Create one now.
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
