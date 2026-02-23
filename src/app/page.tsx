'use client';

import { Book, History } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function RakshakHomepage() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const features = [
    { icon: '🚨', title: 'Instant SOS', desc: 'Send emergency alert with one tap.' },
    { icon: '📸', title: 'Photo & Audio', desc: 'Automatically capture images and record audio.' },
    { icon: '📍', title: 'Live Location', desc: 'Share your live location with trusted contacts.' },
    { icon: '🗣️', title: 'Voice SOS', desc: 'Activate SOS using your secret code word.' },
    { icon: '📜', title: 'SOS History', desc: 'View all your past SOS alerts.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2b0f3a] via-[#1f082a] to-black text-white">

      {/* Navbar */}
      <nav className="w-full border-b border-pink-500/30 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
              <Image
                src="/rakshak.png"
                alt="Rakshak Logo"
                fill
                className="object-cover rounded"
                loading="lazy"
              />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-pink-500">
              Rakshak
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm md:text-base">

            <Link
              href="/sos"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 hover:text-pink-500 transition"
            >
              <History size={18} />
              <span>SOS History</span>
            </Link>

            <Link
              href="/documentation"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 hover:text-pink-500 transition"
            >
              <Book size={18} />
              <span>Documentation</span>
            </Link>

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center px-6 py-20">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
          Your Safety,
          <span className="text-pink-500"> Our Priority</span>
        </h2>
        <p className="text-purple-200 max-w-2xl mx-auto mb-10">
          RakshakApp is a women safety SOS application. One tap or voice command
          can alert your trusted contacts, share your live location, and record
          evidence automatically.
        </p>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h3 className="text-4xl font-bold text-center mb-12">
          App <span className="text-pink-500">Features</span>
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => setActiveFeature(index)}
              className={`p-6 rounded-xl cursor-pointer transition-all border
                ${activeFeature === index
                  ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/20'
                  : 'border-purple-800 bg-purple-950/70 hover:border-pink-500/50'
                }`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
              <p className="text-purple-300 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-pink-500/5 px-6 py-20">
        <h3 className="text-4xl font-bold text-center mb-12">
          How It <span className="text-pink-500">Works</span>
        </h3>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <Step number="1" title="Trigger SOS" desc="Tap button or say code word" />
          <Step number="2" title="Auto Capture" desc="Photos & audio start recording" />
          <Step number="3" title="Alert Contacts" desc="Live location sent instantly" />
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 py-24">
        <h3 className="text-5xl font-extrabold mb-6">
          Stay <span className="text-pink-500">Protected</span>
        </h3>
        <p className="text-purple-300 max-w-xl mx-auto mb-8">
          RakshakApp is always with you — ready to protect when you need it most.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-pink-500/20 px-6 py-6 text-center text-purple-400 text-sm">
        © 2026 RakshakApp. Built for women safety.
      </footer>
    </div>
  );
}

function Step({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-6 bg-purple-950/70 rounded-xl border border-purple-800">
      <div className="text-3xl font-bold text-pink-500 mb-2">{number}</div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-purple-300 text-sm">{desc}</p>
    </div>
  );
}
