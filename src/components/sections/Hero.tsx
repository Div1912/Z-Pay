"use client";

import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: e.pageX,
      y: e.pageY,
    });
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        pin: contentRef.current,
        pinSpacing: false,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(contentRef.current, {
            opacity: 1 - progress * 1.5,
            scale: 1 - progress * 0.05,
            y: progress * -100,
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative h-[200vh] w-full bg-black/[0.96] overflow-x-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Interactive Mouse Orb */}
      {isMounted && (
        <motion.div
          className="pointer-events-none absolute w-[600px] h-[600px] rounded-full blur-[100px] z-0 mix-blend-screen"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%)"
          }}
          animate={{
            x: mousePosition.x - 300,
            y: mousePosition.y - 300,
          }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.4 }}
        />
      )}

      {/* Vengeance UI Spotlight */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div 
        ref={contentRef}
        className="flex flex-col lg:flex-row h-screen w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 items-center pt-20"
      >
        
        {/* Left content: Typography and Call to Action */}
        <div className="flex-1 w-full flex flex-col justify-center py-12 lg:py-0 relative z-20">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl w-fit mb-8 shadow-2xl">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse" />
            <span 
              className="text-white/80 text-[11px] font-bold tracking-widest uppercase"

            >
              Live on Stellar Mainnet
            </span>
          </div>

          <h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[1.05] tracking-widest bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 pb-2"
          >
            Agentic <br />
            Payment <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-white to-zinc-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Router</span>
          </h1>
          
          <p 
            className="mt-6 text-neutral-400 text-lg sm:text-xl max-w-lg leading-relaxed font-medium"

          >
            Empower AI agents to transact autonomously on your behalf. <br className="hidden md:block" />
            Zero friction. Infinite scale. The intelligent financial protocol.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Link 
              href="/auth/signup" 
              className="group relative h-14 rounded-full bg-[#D4AF37] text-black font-bold text-sm flex items-center justify-center px-8 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(212,175,55,0.3)] overflow-hidden"

            >
              <span className="relative z-10 flex items-center gap-2">
                GET STARTED
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link 
              href="/features"
              className="h-14 rounded-full border border-white/10 bg-white/5 text-white font-medium text-sm flex items-center justify-center px-8 hover:bg-white/10 transition-all backdrop-blur-md"
            >
              Explore Features
            </Link>
          </div>
        </div>

        {/* Right content: Vengeance UI Spline 3D Scene */}
        <div className="flex-1 w-full h-[60vh] lg:h-[90vh] relative lg:ml-10 mt-10 lg:mt-0 overflow-visible pointer-events-auto flex items-center justify-center">
          <div className="w-[120%] lg:w-[140%] h-[120%] lg:h-[140%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full relative z-10"
            />
          </div>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
    </section>
  );
};

export default Hero;
