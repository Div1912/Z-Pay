"use client";

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
        
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">Terms of Service</h1>
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto font-medium mb-12">
          The rules and guidelines for using the ZPAY platform.
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
