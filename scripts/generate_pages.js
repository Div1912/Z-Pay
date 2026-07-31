const fs = require('fs');
const path = require('path');

const pages = [
  { path: 'integrations', title: 'Integrations', desc: 'Connect ZPAY with your favorite tools and protocols.' },
  { path: 'changelog', title: 'Changelog', desc: 'New updates, improvements, and fixes for the ZPAY protocol.' },
  { path: 'about', title: 'About ZPAY', desc: 'We are building the autonomous financial layer for the internet.' },
  { path: 'blog', title: 'ZPAY Blog', desc: 'Insights, engineering deep dives, and company news.' },
  { path: 'careers', title: 'Careers', desc: 'Join us in decentralizing and automating global payments.' },
  { path: 'press', title: 'Press & Media', desc: 'Brand assets, press releases, and media inquiries.' },
  { path: 'privacy', title: 'Privacy Policy', desc: 'How we handle and protect your data.' },
  { path: 'terms', title: 'Terms of Service', desc: 'The rules and guidelines for using the ZPAY platform.' },
  { path: 'security', title: 'Security', desc: 'Enterprise-grade security architecture built on Stellar.' },
  { path: 'compliance', title: 'Compliance', desc: 'Global regulatory compliance and KYC/AML standards.' },
];

const template = (title, desc) => `"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      <div className="pt-40 pb-32 px-4 sm:px-6 relative z-10 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle 800px at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 100%)',
        }} />
        
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">${title}</h1>
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto font-medium mb-12">
          ${desc}
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Coming Soon</span>
        </div>
      </div>
      
      <FooterCTA />
    </main>
  );
}
`;

pages.forEach(p => {
  const dir = path.join(__dirname, '..', 'src', 'app', p.path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, 'page.tsx'), template(p.title, p.desc));
  console.log(`Created ${p.path}/page.tsx`);
});
