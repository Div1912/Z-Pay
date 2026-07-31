"use client";

import React, { useRef, useLayoutEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import { Spotlight } from "@/components/ui/spotlight";
import { Logo } from "@/components/ui/Logo";

gsap.registerPlugin(ScrollTrigger);

// ─── Social Icons ─────────────────────────────────────────────────────────────

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.49.5.09.682-.218.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.455-1.157-1.11-1.465-1.11-1.465-.909-.62.069-.608.069-.608 1.004.071 1.532 1.032 1.532 1.032.891 1.53 2.341 1.088 2.91.833.091-.647.349-1.086.635-1.337-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.944.359.309.678.92.678 1.852 0 1.335-.012 2.415-.012 2.741 0 .267.18.577.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const DiscordIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// ─── Footer columns data ──────────────────────────────────────────────────────

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
      { label: 'Press', href: '/press' },
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

const socialLinks = [
  { label: 'X (Twitter)', href: 'https://x.com/zpay', Icon: XIcon },
  { label: 'GitHub', href: 'https://github.com/zpay', Icon: GitHubIcon },
  { label: 'Discord', href: 'https://discord.gg/zpay', Icon: DiscordIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/zpay', Icon: LinkedInIcon },
];

// ─── Component ────────────────────────────────────────────────────────────────

const FooterCTA = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(titleRef.current, {
        opacity: 0,
        y: 60,
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
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
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120vw] max-w-[1400px] h-[500px] sm:h-[600px] md:h-[700px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(ellipse, rgba(198, 148, 249, 0.6) 0%, rgba(148, 161, 249, 0.3) 40%, transparent 70%)',
            filter: 'blur(80px)',
            transform: 'translateX(-50%) translateY(40%)',
          }}
        />
      </div>

      {/* ── CTA Block ── */}
      <div className="py-20 sm:py-28 md:py-36 lg:py-48">
        <div ref={titleRef} className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1400px] flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <h2 className="font-black leading-[0.85] tracking-tight mb-5 sm:mb-6 md:mb-8">
              <span className="block bg-gradient-to-r from-zinc-100 via-neutral-300 to-neutral-600 bg-clip-text text-transparent text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[8vw] xl:text-[7rem]">
                Get
              </span>
              <span className="block text-white text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[8vw] xl:text-[7rem]">
                Started.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-white/50 text-sm sm:text-base md:text-lg lg:text-xl max-w-lg mb-8 sm:mb-10 md:mb-14"
          >
            Fast, secure, and borderless payments—powered by ZPAY on Stellar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Link
              href="/auth/signup"
              className="group relative flex h-12 sm:h-14 md:h-16 items-center justify-center rounded-full bg-gold px-6 sm:px-8 md:px-12 transition-all duration-300 hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-sm sm:text-base font-black text-black flex items-center gap-2 sm:gap-3 uppercase tracking-wide sm:tracking-wider">
                Create Account
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="w-4 sm:w-5 group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </span>
            </Link>
            <Link
              href="/auth/login"
              className="flex h-12 sm:h-14 md:h-16 items-center justify-center rounded-full border border-white/15 px-6 sm:px-8 md:px-12 text-white font-black text-sm sm:text-base uppercase tracking-wide sm:tracking-wider hover:bg-white/5 hover:border-white/25 transition-all duration-300 active:scale-[0.98]"
            >
              Sign In
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Marquee Ticker ── */}
      <div className="relative py-6 sm:py-8 border-y border-white/[0.05] overflow-hidden">
        <Marquee speed={40} gradient={false}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 sm:gap-8 md:gap-12 mx-6 sm:mx-8 md:mx-12">
              <span className="text-[5rem] sm:text-[7rem] md:text-[10rem] lg:text-[12rem] font-black text-white/[0.12] uppercase tracking-tighter whitespace-nowrap">
                ZPAY
              </span>
              <span className="text-white/[0.2] text-2xl sm:text-3xl md:text-4xl">•</span>
              <span className="text-[5rem] sm:text-[7rem] md:text-[10rem] lg:text-[12rem] font-black text-white/[0.12] uppercase tracking-tighter whitespace-nowrap">
                PAYMENTS
              </span>
              <span className="text-white/[0.2] text-2xl sm:text-3xl md:text-4xl">•</span>
              <span className="text-[5rem] sm:text-[7rem] md:text-[10rem] lg:text-[12rem] font-black text-white/[0.12] uppercase tracking-tighter whitespace-nowrap">
                STELLAR
              </span>
              <span className="text-white/[0.2] text-2xl sm:text-3xl md:text-4xl">•</span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* ── Full 4-column Footer ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
        className="pt-16 sm:pt-20 md:pt-24 pb-10 sm:pb-12"
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1400px]">
          {/* Top row: Logo + columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 md:gap-8 lg:gap-12 mb-14 sm:mb-16 md:mb-20">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <Logo className="w-8 h-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                <span className="text-white font-black text-xl sm:text-2xl tracking-tighter">ZPAY</span>
              </div>
              <p className="text-white/35 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 max-w-[240px]">
                The agentic payment router built on Stellar. Instant, borderless, and programmable by AI.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 hover:bg-white/[0.07] transition-all duration-200"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-bold text-xs sm:text-sm uppercase tracking-[0.12em] mb-4 sm:mb-5">
                  {col.title}
                </h4>
                <ul className="space-y-2.5 sm:space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-white/40 text-xs sm:text-sm hover:text-white/80 transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-6 sm:pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/25 text-xs sm:text-sm order-2 sm:order-1">
              © {new Date().getFullYear()} ZPAY. All rights reserved.
            </p>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500/60 shadow-[0_0_6px_#22c55e]" />
              <span className="text-white/25 text-xs sm:text-sm tracking-wide">Built on Stellar Network</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};

export default FooterCTA;
