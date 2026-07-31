"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showSpline, setShowSpline] = useState(false);

  // RAF-based mouse tracking — zero framer-motion overhead, pure GPU transforms
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const rafId = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    targetX.current = e.clientX - 300;
    targetY.current = e.clientY - 300;
  }, []);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setShowSpline(true), 600);

    // Smooth lerp loop — much faster than framer-motion springs
    const loop = () => {
      currentX.current += (targetX.current - currentX.current) * 0.06;
      currentY.current += (targetY.current - currentY.current) * 0.06;
      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${currentX.current}px, ${currentY.current}px)`;
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    const el = sectionRef.current;
    el?.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId.current);
      el?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  useEffect(() => {
    if (!isMounted) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        pin: contentRef.current,
        pinSpacing: false,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          if (contentRef.current) {
            contentRef.current.style.opacity = String(Math.max(0, 1 - p * 1.5));
            contentRef.current.style.transform = `scale(${1 - p * 0.05}) translateY(${p * -80}px) translateZ(0)`;
          }
        }
      });
    });

    return () => mm.revert();
  }, [isMounted]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-[100dvh] w-full bg-black overflow-x-hidden"
    >
      {/* Subtle grain texture — premium depth, no performance cost */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] mix-blend-overlay select-none"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Mouse orb — direct DOM, no React state */}
      {isMounted && (
        <div
          ref={orbRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 w-[500px] h-[500px] rounded-full hidden lg:block"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 70%)',
            filter: 'blur(60px)',
            willChange: 'transform',
          }}
        />
      )}

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      
      <div 
        ref={contentRef}
        className="flex flex-row min-h-[100dvh] lg:h-screen w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 items-center pt-24 lg:pt-20 pb-20 lg:pb-0"
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Left: Typography + CTA */}
        <div className="w-[55%] sm:w-[60%] lg:flex-1 flex flex-col justify-center py-4 lg:py-0 relative z-20">
          
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl w-fit mb-6 lg:mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span className="text-white/70 text-[10px] lg:text-[11px] font-bold tracking-widest uppercase">
              Live on Stellar Mainnet
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[1.05] tracking-widest bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 pb-2">
            Agentic <br />
            Payment <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-white to-zinc-500">Router</span>
          </h1>
          
          <p className="mt-4 lg:mt-6 text-neutral-400 text-sm sm:text-base lg:text-xl max-w-lg leading-relaxed font-medium">
            Send money to anyone, anywhere — instantly. Your AI agents transact{' '}
            <span className="text-neutral-200 font-semibold">24/7</span> on your behalf, with{' '}
            <span className="text-neutral-200 font-semibold">sub-cent fees</span> and zero friction.
          </p>

          <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Link 
              href="/auth/signup" 
              className="group relative h-12 lg:h-14 rounded-full bg-gold text-black font-bold text-sm flex items-center justify-center px-8 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_40px_rgba(212,175,55,0.3)] overflow-hidden w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center gap-2">
                GET STARTED
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </Link>
            
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
              { emoji: '🔒', label: 'Bank-Grade Security' },
              { emoji: '⚡', label: 'Stellar Network' },
              { emoji: '🌍', label: '140+ Countries' },
            ].map((b) => (
              <div
                key={b.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.03]"
              >
                <span className="text-[11px]">{b.emoji}</span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-white/40 tracking-wide">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Spline 3D */}
        <div className="w-[45%] sm:w-[40%] h-[40vh] min-h-[300px] sm:min-h-[500px] lg:flex-1 lg:h-[90vh] relative lg:ml-10 overflow-visible pointer-events-auto flex items-center justify-center">
          {showSpline && (
            <div className="w-[200%] sm:w-[140%] lg:w-[140%] h-[200%] sm:h-[140%] lg:h-[140%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <SplineScene 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full relative z-10"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
    </section>
  );
};

export default Hero;
