'use client';

import { AlarmMinus, AlarmSmoke, AlarmSmokeIcon, BellIcon, CameraIcon, FileTextIcon, MapPinIcon, MicIcon } from 'lucide-react';
import { useState } from 'react';

export default function RakshakHomepage() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const features = [
    { icon:<BellIcon  /> , title: 'Instant SOS', desc: 'Send emergency alert with one tap.' },
    { icon: <CameraIcon />, title: 'Photo & Audio', desc: 'Automatically capture images and record audio.' },
    { icon:<MapPinIcon  />, title: 'Live Location', desc: 'Share your live location with trusted contacts.' },
    { icon: <MicIcon />, title: 'Voice SOS', desc: 'Activate SOS using your secret code word.' },
    { icon: <FileTextIcon />, title: 'SOS History', desc: 'View all your past SOS alerts.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2b0f3a] via-[#1f082a] to-black text-white">

     

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
              className={`py-3 px-4  rounded-xl cursor-pointer transition-all border border-pink-600 flex flex-col items-center justify-center`}
            >
              <div className="text-4xl mb-4 flex justify-center md:justify-start *:text-pink-500 *:size-10">{feature.icon}</div>
              <div className="text-xl font-semibold mb-2 text-center">{feature.title}</div>
              <div className="text-purple-300 text-sm text-center">{feature.desc}</div>
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
