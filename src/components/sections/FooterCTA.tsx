"use client";

import React, { useRef, useLayoutEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import { Spotlight } from "@/components/ui/spotlight";
import { Logo } from "@/components/ui/Logo";
import { Twitter, Github, MessageCircle, Linkedin, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ─── Footer data ──────────────────────────────────────────────────────────────

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Integrations', href: '/integrations' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Security', href: '/security' },
      { label: 'Compliance', href: '/compliance' },
    ],
  },
];

const connectLinks = [
  { label: 'Twitter / X', href: 'https://x.com/Zpayroute', Icon: Twitter },
  { label: 'GitHub', href: 'https://github.com/Div1912/Z-Pay', Icon: Github },
];

// ─── Component ────────────────────────────────────────────────────────────────

const FooterCTA = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(titleRef.current, { opacity: 0, y: 60 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            force3D: true,
          });
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-black overflow-hidden"
    >
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      
      {/* ── CTA Block ── */}
      <div className="py-20 sm:py-28 md:py-36 lg:py-44">
        <div ref={titleRef} className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1400px] flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <h2 className="font-black leading-[0.85] tracking-tight mb-5 sm:mb-6 md:mb-8">
              <span className="block text-zinc-400 text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[8vw] xl:text-[7rem]">Get</span>
              <span className="block text-white text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[8vw] xl:text-[7rem]">Started.</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-white/50 text-sm sm:text-base md:text-lg lg:text-xl max-w-lg mb-8 sm:mb-10 md:mb-14"
          >
            Fast, secure, and borderless payments — powered by ZPAY on Stellar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Link
              href="/waitlist"
              className="group flex h-12 sm:h-14 md:h-16 items-center justify-center rounded-full bg-gold px-8 sm:px-10 md:px-12 transition-all duration-300 hover:shadow-[0_0_50px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-sm sm:text-base font-black text-black flex items-center gap-2 uppercase tracking-wider">
                Request Access
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </span>
            </Link>
            <Link
              href="/auth/login"
              className="flex h-12 sm:h-14 md:h-16 items-center justify-center rounded-full border border-white/15 px-8 sm:px-10 md:px-12 text-white font-black text-sm sm:text-base uppercase tracking-wider hover:bg-white/5 hover:border-white/25 transition-all duration-300 active:scale-[0.98]"
            >
              Sign In
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Marquee ── */}
      <div className="relative py-5 sm:py-6 border-y border-white/[0.05] overflow-hidden">
        <Marquee speed={38} gradient={false}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 md:gap-14 mx-8 md:mx-14">
              <span className="text-[5rem] sm:text-[7rem] md:text-[10rem] lg:text-[11rem] font-black text-white/[0.1] uppercase tracking-tighter whitespace-nowrap">ZPAY</span>
              <span className="text-white/[0.18] text-2xl sm:text-3xl md:text-4xl">•</span>
              <span className="text-[5rem] sm:text-[7rem] md:text-[10rem] lg:text-[11rem] font-black text-white/[0.1] uppercase tracking-tighter whitespace-nowrap">PAYMENTS</span>
              <span className="text-white/[0.18] text-2xl sm:text-3xl md:text-4xl">•</span>
              <span className="text-[5rem] sm:text-[7rem] md:text-[10rem] lg:text-[11rem] font-black text-white/[0.1] uppercase tracking-tighter whitespace-nowrap">STELLAR</span>
              <span className="text-white/[0.18] text-2xl sm:text-3xl md:text-4xl">•</span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* ── Full 4-column Footer ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.15 }}
        viewport={{ once: true }}
        className="pt-14 sm:pt-18 md:pt-20 pb-10 sm:pb-12"
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1400px]">
          {/* Grid: Brand + 4 columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 sm:gap-12 md:gap-6 lg:gap-8 mb-12 sm:mb-14 md:mb-16">
            
            {/* Brand — spans 2 cols on mobile, 1 col on lg */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <Logo className="w-8 h-8" />
                <span className="text-white font-black text-xl tracking-tighter">ZPAY</span>
              </div>
              <p className="text-white/35 text-xs sm:text-sm leading-relaxed mb-5 max-w-[240px]">
                The agentic payment router built on Stellar. Instant, borderless, and programmable by AI.
              </p>
              {/* Social icon pills */}
              <div className="flex items-center gap-2.5">
                {connectLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 min-h-0 rounded-xl border border-white/[0.07] bg-white/[0.03] flex items-center justify-center text-white/35 hover:text-white/80 hover:border-white/18 hover:bg-white/[0.06] transition-all duration-200"
                  >
                    <Icon size={15} strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>

            {/* Product column */}
            <div>
              <h4 className="text-white font-bold text-[11px] uppercase tracking-[0.14em] mb-4 sm:mb-5">Product</h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {footerColumns[0].links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/38 text-xs sm:text-[0.8rem] hover:text-white/75 transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company column */}
            <div>
              <h4 className="text-white font-bold text-[11px] uppercase tracking-[0.14em] mb-4 sm:mb-5">Company</h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {footerColumns[1].links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/38 text-xs sm:text-[0.8rem] hover:text-white/75 transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal column */}
            <div>
              <h4 className="text-white font-bold text-[11px] uppercase tracking-[0.14em] mb-4 sm:mb-5">Legal</h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {footerColumns[2].links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/38 text-xs sm:text-[0.8rem] hover:text-white/75 transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect column — links with icons + text */}
            <div>
              <h4 className="text-white font-bold text-[11px] uppercase tracking-[0.14em] mb-4 sm:mb-5">Connect</h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {connectLinks.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-white/38 text-xs sm:text-[0.8rem] hover:text-white/75 transition-colors duration-200 group"
                    >
                      <Icon size={13} strokeWidth={1.5} className="text-white/25 group-hover:text-white/55 transition-colors" />
                      {label}
                      <ExternalLink size={10} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-white/22 text-[11px] sm:text-xs order-2 sm:order-1">
              © {new Date().getFullYear()} ZPAY Technologies. All rights reserved.
            </p>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 shadow-[0_0_6px_#10b981]" />
              <span className="text-white/22 text-[11px] sm:text-xs tracking-wide">All systems operational · Built on Stellar</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </section>
  );
};

export default FooterCTA;
