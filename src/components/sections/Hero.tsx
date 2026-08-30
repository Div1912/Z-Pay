"use client";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ShieldCheck, Zap, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // RAF-based mouse tracking with throttle
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const rafId = useRef<number>(0);
  const isHovering = useRef(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    isHovering.current = true;
    targetX.current = e.clientX - 250;
    targetY.current = e.clientY - 250;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
  }, []);

  useEffect(() => {
    setIsMounted(true);

    const loop = () => {
      if (isHovering.current && orbRef.current) {
        currentX.current += (targetX.current - currentX.current) * 0.08;
        currentY.current += (targetY.current - currentY.current) * 0.08;
        orbRef.current.style.transform = `translate3d(${currentX.current}px, ${currentY.current}px, 0)`;
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    const el = sectionRef.current;
    el?.addEventListener('mousemove', handleMouseMove, { passive: true });
    el?.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      cancelAnimationFrame(rafId.current);
      el?.removeEventListener('mousemove', handleMouseMove);
      el?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // Smooth GSAP timeline for scroll fade out
  useEffect(() => {
    if (!isMounted) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.to(contentRef.current, {
          opacity: 0.2,
          y: -40,
          scale: 0.98,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMounted]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-[100dvh] w-full bg-black overflow-hidden"
    >


      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
      />

      {/* Noise overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.7] mix-blend-overlay" />

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />
      
      <div 
        ref={contentRef}
        className="flex flex-col lg:flex-row min-h-[100dvh] w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 items-center justify-between pt-28 lg:pt-20 pb-16 lg:pb-0"
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Left: Typography + CTA */}
        <div className="w-full lg:w-2/3 xl:w-1/2 flex flex-col justify-center py-4 lg:py-0 relative z-20">
          
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md w-fit mb-6 lg:mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span className="text-white/70 text-[10px] lg:text-[11px] font-bold tracking-widest uppercase">
              Live on Stellar Mainnet
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[1.05] tracking-tight text-white pb-2">
            Agentic <br />
            Payment <br />
            <span className="text-zinc-400">Router</span>
          </h1>
          
          <p className="mt-4 lg:mt-6 text-neutral-400 text-sm sm:text-base lg:text-xl max-w-lg leading-relaxed font-medium">
            Send money to anyone worldwide in seconds. Your AI agents transact{' '}
            <span className="text-neutral-200 font-semibold">24/7</span> on your behalf, with{' '}
            <span className="text-neutral-200 font-semibold">sub cent fees</span> and zero friction.
          </p>

          <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <LiquidMetalButton label="REQUEST ACCESS" href="/waitlist" />
            
            <Link 
              href="/features"
              className="h-12 lg:h-14 rounded-full border border-white/10 bg-white/5 text-white font-medium text-sm flex items-center justify-center px-8 hover:bg-white/10 transition-colors backdrop-blur-md w-full sm:w-auto"
            >
              Explore Features
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-6 lg:mt-8 flex flex-wrap gap-2 sm:gap-3">
            {[
              { Icon: ShieldCheck, label: 'Bank Grade Security' },
              { Icon: Zap, label: 'Stellar Network' },
              { Icon: Globe, label: 'Global Settlement' },
            ].map(({ Icon, label }) => (
              <div 
                key={label}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-xs text-neutral-400 font-medium"
              >
                <Icon className="w-3.5 h-3.5 text-neutral-300" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-black z-20 pointer-events-none" />
    </section>
  );
};

export default Hero;
