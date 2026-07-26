"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';

const WaitlistNavbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className={`flex items-center justify-between rounded-full px-6 py-2.5 transition-all duration-500 ${
          scrolled ? 'bg-black/40 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]' : 'bg-transparent'
        }`}>
          <Link href="/waitlist" className="flex items-center gap-3 group">
            <Logo className="w-10 h-10 group-hover:scale-105 transition-transform duration-300" />
            <span 
              className="text-white font-black text-2xl tracking-tighter group-hover:text-iridescent transition-colors duration-300"
            >
              ZPAY
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
             <span className="text-white/60 font-medium text-sm tracking-wide hidden sm:block">
                Early Access
             </span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default WaitlistNavbar;
