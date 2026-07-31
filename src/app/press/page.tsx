"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { Download, FileText, Mail, Image as ImageIcon } from 'lucide-react';

export default function PressPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />
      
      <section className="pt-40 pb-16 px-4 sm:px-6 text-center max-w-[1000px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <FileText className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Press &amp; Brand</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
          Brand Assets &amp; Media Kit
        </h1>
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto font-medium">
          Official ZPAY brand guidelines, logos, screenshots, and press contact information.
        </p>
      </section>

      <section className="pb-32 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <ImageIcon className="w-10 h-10 text-gold mb-6" />
              <h3 className="text-2xl font-bold mb-3">Official Logo &amp; Vector Package</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-8">
                Download SVG, PNG, and EPS formats of the ZPAY logo in light, dark, and monochrome variants.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors w-fit">
              <Download className="w-4 h-4" /> Download Logo Kit (.ZIP)
            </button>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <Mail className="w-10 h-10 text-gold mb-6" />
              <h3 className="text-2xl font-bold mb-3">Media &amp; Press Contact</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-8">
                For interview requests, executive quotes, or press inquiries, reach out directly to our communications team.
              </p>
            </div>
            <a href="mailto:press@zpay.route" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold text-black font-bold text-sm hover:scale-105 transition-all w-fit">
              Contact Press Team
            </a>
          </div>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
