"use client";

import { Bell, Camera, MapPin, Mic, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <Bell size={28} className="text-pink-400" />,
    title: "Instant SOS",
    desc: "Create an emergency alert in a single tap and notify your trusted contacts immediately.",
  },
  {
    icon: <MapPin size={28} className="text-pink-400" />,
    title: "Live Location",
    desc: "Share real-time location updates with emergency contacts during an alert.",
  },
  {
    icon: <Camera size={28} className="text-pink-400" />,
    title: "Media Capture",
    desc: "Automatically attach photos and audio from the SOS incident to preserve evidence.",
  },
  {
    icon: <Mic size={28} className="text-pink-400" />,
    title: "Voice Trigger",
    desc: "Trigger an alert using a secret code word when you cannot tap the screen.",
  },
  {
    icon: <ShieldCheck size={28} className="text-pink-400" />,
    title: "Trusted Contacts",
    desc: "Add emergency contacts and keep them informed whenever an alert is raised.",
  },
  {
    icon: <Sparkles size={28} className="text-pink-400" />,
    title: "Safe History",
    desc: "Review your alert history in one secure place with quick access to details.",
  },
];

export default function RakshakHomepage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3a0a4f] via-[#1a0623] to-black text-white">

      {/* Hero */}
      <section className="relative overflow-hidden px-4 lg:px-16 py-16  lg:py-32">
        <div className="relative mx-auto max-w-6xl">

          {/* Headline */}
          <h1 className="mb-5 sm:mb-6 max-w-4xl text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-white">
           Your <span className="text-red-400 ">Safety, </span> Our{" "}
            <span className="text-pink-400">Priority</span>
          </h1>

          {/* Subtext */}
          <p className="mb-8 sm:mb-10 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-300">
            Instant SOS, automated media capture, and an emergency history hub —
            all built to help you stay protected every day.
          </p>

          {/* CTAs */}
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-pink-500 px-6 sm:px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-600/30 transition-all duration-200 hover:bg-pink-400 hover:shadow-pink-500/40 active:scale-95"
            >
              View SOS History
            </Link>
            <Link
              href="/documentation"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 sm:px-8 py-3 text-sm font-semibold text-white/90 transition-all duration-200 hover:border-pink-500/50 hover:bg-white/10 active:scale-95"
            >
              Explore API Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-8 lg:px-16 pb-16 sm:pb-24">
        <div className="mx-auto max-w-6xl">

          <div className="mb-10 sm:mb-14">
            <p className="mb-2 text-xs sm:text-sm uppercase tracking-[0.3em] text-pink-400/70 font-medium">
              Everything you need
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Built for real emergencies
            </h2>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl sm:rounded-3xl border border-white/8 bg-white/4 p-5 sm:p-6 shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:bg-white/8 hover:border-pink-500/20 hover:shadow-pink-500/10"
              >
                <div className="mb-4 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-pink-500/10 flex items-center justify-center ring-1 ring-pink-500/20 group-hover:bg-pink-500/15 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-base sm:text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-white/8 bg-black/50 px-4 sm:px-8 lg:px-16 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 sm:mb-12">
            <p className="mb-2 text-xs sm:text-sm uppercase tracking-[0.3em] text-pink-400/70 font-medium">
              By the numbers
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Trusted by those who matter
            </h2>
          </div>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
            <StatCard label="Alerts Managed" value="100+" description="Fast access to every emergency alert." />
            <StatCard label="Trusted Contacts" value="Save once" description="Keep contacts ready for urgent help." />
            <StatCard label="Response Time" value="< 30s" description="Your SOS reaches helpers instantly." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 bg-black px-4 sm:px-8 lg:px-16 py-6 sm:py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-slate-500">
            © 2026 Rakshak. Designed for safer journeys and smarter alerts.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-pink-400/60">
            <ShieldCheck size={13} />
            <span>Built for safety</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-white/8 bg-white/4 p-5 sm:p-6 shadow-lg shadow-black/20">
      <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-slate-500 font-medium">
        {label}
      </p>
      <p className="mt-3 sm:mt-4 text-3xl sm:text-4xl font-bold text-white tracking-tight">
        {value}
      </p>
      <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-slate-400">
        {description}
      </p>
    </div>
  );
}