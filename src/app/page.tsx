"use client";

import { Bell, Camera, MapPin, Mic, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <Bell size={32} className="text-pink-500" />,
    title: "Instant SOS",
    desc: "Create an emergency alert in a single tap and notify your trusted contacts immediately.",
  },
  {
    icon: <MapPin size={32} className="text-pink-500" />,
    title: "Live Location",
    desc: "Share real-time location updates with emergency contacts during an alert.",
  },
  {
    icon: <Camera size={32} className="text-pink-500" />,
    title: "Media Capture",
    desc: "Automatically attach photos and audio from the SOS incident to preserve evidence.",
  },
  {
    icon: <Mic size={32} className="text-pink-500" />,
    title: "Voice Trigger",
    desc: "Trigger an alert using a secret code word when you cannot tap the screen.",
  },
  {
    icon: <ShieldCheck size={32} className="text-pink-500" />,
    title: "Trusted Contacts",
    desc: "Add emergency contacts and keep them informed whenever an alert is raised.",
  },
  {
    icon: <Sparkles size={32} className="text-pink-500" />,
    title: "Safe History",
    desc: "Review your alert history in one secure place with quick access to details.",
  },
];

export default function RakshakHomepage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#490b5b] via-[#1f082a] to-black text-white">
      <section className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16">
        <div className="absolute inset-x-0 top-0 h-40 bg-white/5 blur-3xl" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-12">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-500/15 px-4 py-2 text-sm shadow-sm ring-1 ring-pink-500/20">
              <Bell size={18} /> Women safety reimagined
            </span>
            <h1 className="text-5xl font-extrabold leading-tight sm:text-6xl">
              Rakshak keeps you safe with fast alerts, trusted contacts, and live location.
            </h1>
            <p className="max-w-2xl text-lg text-slate-200 sm:text-xl">
              Instant SOS, automated media capture, and an emergency history hub — all built to help you stay protected every day.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="inline-flex items-center justify-center rounded-full bg-pink-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:bg-pink-400">
                View SOS History
              </Link>
              <Link href="/documentation" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition hover:border-pink-500 hover:bg-white/10">
                Explore API Docs
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-pink-500/5 transition hover:-translate-y-1 hover:bg-white/10">
                <div className="mb-4">{feature.icon}</div>
                <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black/40 px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-3">
          <StatCard label="Alerts Managed" value="100+" description="Fast access to every emergency alert." />
          <StatCard label="Trusted Contacts" value="Save them once" description="Keep contacts ready for urgent help." />
          <StatCard label="Quick Response" value="< 30s" description="Your SOS reaches helpers instantly." />
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/90 px-6 py-8 text-center text-sm text-slate-400 sm:px-10 lg:px-16">
        © 2026 Rakshak. Designed for safer journeys, smarter alerts, and clearer emergency history.
      </footer>
    </div>
  );
}

function StatCard({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-lg shadow-slate-900/10">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
    </div>
  );
}
