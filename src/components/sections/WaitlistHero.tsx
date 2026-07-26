"use client";

import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Spotlight } from "@/components/ui/spotlight";
import { motion, useMotionValue, useSpring } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const WaitlistHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Performance Optimization: Use Framer Motion values instead of React state
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smX = useSpring(mouseX, springConfig);
  const smY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.pageX - 300);
    mouseY.set(e.pageY - 300);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubmitted(true);
        setEmail('');
      } else {
        console.error('Waitlist submission failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative h-[200vh] w-full bg-black/[0.96] overflow-x-hidden flex justify-center"
      onMouseMove={handleMouseMove}
    >
      {/* Interactive Mouse Orb */}
      {isMounted && (
        <motion.div
          className="pointer-events-none absolute w-[600px] h-[600px] rounded-full blur-[100px] z-0 mix-blend-screen hidden lg:block"
          style={{
            x: smX,
            y: smY,
            background: "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%)"
          }}
        />
      )}

      {/* Vengeance UI Spotlight */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div 
        ref={contentRef}
        className="flex flex-col min-h-[100dvh] lg:h-screen w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 items-center justify-center pt-24 pb-20 text-center"
      >
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl w-fit mb-6 lg:mb-8 shadow-2xl mx-auto">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse" />
          <span className="text-white/80 text-[10px] lg:text-[11px] font-bold tracking-widest uppercase">
            Early Access Registration
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[1.05] tracking-widest bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 pb-2">
          The Future of <br />
          Payments is <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-white to-zinc-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Agentic</span>
        </h1>
        
        <p className="mt-4 lg:mt-6 text-neutral-400 text-sm sm:text-base lg:text-xl max-w-lg leading-relaxed font-medium mx-auto">
          Be the first to experience zero friction, autonomous transactions. Join the waitlist for exclusive early access.
        </p>

        <div className="mt-8 lg:mt-10 w-full max-w-md mx-auto">
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl border border-green-500/30 bg-green-500/10 backdrop-blur-md flex items-center justify-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <p className="text-green-400 font-medium text-sm">
                You're on the list! We'll be in touch soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center sm:items-stretch justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={isSubmitting}
                className="flex-1 h-12 lg:h-14 rounded-full border border-white/20 bg-white/5 px-6 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all backdrop-blur-md w-full disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="group relative h-12 lg:h-14 rounded-full bg-white text-black font-bold text-sm flex items-center justify-center px-8 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] overflow-hidden w-full sm:w-auto shrink-0 disabled:opacity-75 disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? 'JOINING...' : 'JOIN WAITLIST'}
                  {!isSubmitting && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </form>
          )}
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
    </section>
  );
};

export default WaitlistHero;
