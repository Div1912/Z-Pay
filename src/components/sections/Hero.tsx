"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
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


      {/* Mouse Orb - GPU accelerated */}
      {isMounted && (
        <div
          ref={orbRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 w-[500px] h-[500px] rounded-full hidden lg:block opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(255,255,255,0) 70%)',
            filter: 'blur(50px)',
            willChange: 'transform',
            transform: 'translate3d(0,0,0)',
          }}
        />
      )}

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      
      <div 
        ref={contentRef}
        className="flex flex-col lg:flex-row min-h-[100dvh] w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 items-center justify-between pt-28 lg:pt-20 pb-16 lg:pb-0"
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Left: Typography + CTA */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-4 lg:py-0 relative z-20">
          
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
            <span className="text-gold">Router</span>
          </h1>
          
          <p className="mt-4 lg:mt-6 text-neutral-400 text-sm sm:text-base lg:text-xl max-w-lg leading-relaxed font-medium">
            Send money to anyone, anywhere — instantly. Your AI agents transact{' '}
            <span className="text-neutral-200 font-semibold">24/7</span> on your behalf, with{' '}
            <span className="text-neutral-200 font-semibold">sub-cent fees</span> and zero friction.
          </p>

          <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Link 
              href="/waitlist" 
              className="group relative h-12 lg:h-14 rounded-full bg-gold text-black font-bold text-sm flex items-center justify-center px-8 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_40px_rgba(212,175,55,0.3)] overflow-hidden w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center gap-2 uppercase tracking-wider">
                REQUEST ACCESS
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
              { Icon: ShieldCheck, label: 'Bank-Grade Security' },
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

        {/* Right: Spline 3D Scene with CSS fallback visual */}
        <div className="w-full lg:w-1/2 h-[45vh] min-h-[350px] lg:h-[80vh] relative lg:ml-6 flex items-center justify-center">
          {/* Fallback visual — always visible behind Spline */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Animated rings */}
            <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] lg:w-[380px] lg:h-[380px]">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-full border border-white/[0.08]"
                  style={{
                    margin: `${i * 40}px`,
                    animation: `spin ${18 + i * 6}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
                  }}
                />
              ))}
              {/* Center Z glyph */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-white/20 bg-zinc-900 p-0.5 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                  <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center">
                    <span className="text-white font-black text-4xl sm:text-5xl tracking-tighter">Z</span>
                  </div>
                </div>
              </div>
              {/* Floating payment badges */}
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md"
                style={{ animation: 'float1 4s ease-in-out infinite' }}>
                <span className="text-emerald-400 text-xs font-bold">⚡ ~3s Settlement</span>
              </div>
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-md"
                style={{ animation: 'float2 5s ease-in-out infinite' }}>
                <span className="text-gold text-xs font-bold">$0.00001 Fee</span>
              </div>
              <div className="absolute top-1/2 -right-8 sm:-right-14 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md -translate-y-1/2"
                style={{ animation: 'float3 6s ease-in-out infinite' }}>
                <span className="text-white/60 text-xs font-bold">🌐 140+ Countries</span>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes float1 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
            @keyframes float2 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(10px); } }
            @keyframes float3 { 0%,100% { transform: translateY(-50%) translateX(0px); } 50% { transform: translateY(-50%) translateX(6px); } }
          `}</style>
          {/* Spline loads on top — overlays fallback when ready */}
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full relative z-10"
          />
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-black z-20 pointer-events-none" />
    </section>
  );
};

export default Hero;
