
import Image from 'next/image';
import React, { useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowUpRight, Plus, PiggyBank, Users, Repeat, CreditCard, TrendingUp } from 'lucide-react';
import { Spotlight } from "@/components/ui/spotlight";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: ArrowUpRight,
    title: "Transfer",
    description: "Send money instantly to anyone, anywhere in the world.",
    color: "#d4d4d8",
  },
  {
    icon: Plus,
    title: "Request",
    description: "Request payments with a simple shareable link.",
    color: "#e5e5e5",
  },
  {
    icon: PiggyBank,
    title: "Savings",
    description: "Grow your wealth with high-yield DeFi savings.",
    color: "#a3a3a3",
  },
  {
    icon: Users,
    title: "Split",
    description: "Split bills effortlessly with your group.",
    color: "#d4d4d8",
  },
];

export default function QuickActions() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, cardsRef.current, phoneRef.current], {
        opacity: 0,
        y: 80,
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            force3D: true,
          })
          .to(cardsRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            force3D: true,
          }, "-=0.7")
          .to(phoneRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            force3D: true,
          }, "-=0.8");
        },
        once: true,
      });

      const cards = cardsRef.current?.querySelectorAll('.feature-card');
      if (cards) {
        cards.forEach((card, index) => {
          gsap.fromTo(card,
            { opacity: 0, x: -30 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              delay: index * 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              }
            }
          );
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative bg-black overflow-hidden py-20 sm:py-28 md:py-36 lg:py-40"
    >
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[40vw] max-w-[500px] aspect-square rounded-full bg-purple-600/8 blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-[35vw] max-w-[400px] aspect-square rounded-full bg-blue-600/8 blur-[70px]" />
      </div>

      <div ref={contentRef} className="relative">
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-20 xl:gap-24">
            
            <div className="w-full lg:w-1/2 lg:sticky lg:top-28">
              <div ref={titleRef} className="mb-8 sm:mb-10 md:mb-12">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4 sm:mb-6">
                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-zinc-300 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/60">Features</span>
                </div>
                <h2 
                  className="font-black leading-[0.9] tracking-tight mb-4 sm:mb-6 uppercase"
                >
                  <span className="block text-white text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[5vw] xl:text-[4.5rem]">Quick</span>
                  <span className="block text-zinc-400 text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[5vw] xl:text-[4.5rem]">Actions</span>
                </h2>
                <p className="text-white/50 text-sm sm:text-base md:text-lg lg:text-xl font-medium max-w-md leading-relaxed">
                  All major actions are just a tap away. Frictionless payments for the modern age.
                </p>
              </div>

                <div ref={cardsRef} className="space-y-3 sm:space-y-4">
                  {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={feature.title}
                        onClick={() => router.push('/waitlist')}
                        className="feature-card group relative p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-500 cursor-pointer overflow-hidden"
                      >
                      <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-0 left-0 w-1 h-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative flex items-center gap-4 sm:gap-5">
                        <div 
                          className="w-11 sm:w-12 md:w-14 aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/10 bg-white/[0.03] group-hover:scale-110 group-hover:border-white/20 transition-all duration-500 flex-shrink-0"
                          style={{ boxShadow: `0 0 25px ${feature.color}15` }}
                        >
                          <Icon className="w-5 sm:w-6 h-5 sm:h-6" style={{ color: feature.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-black text-base sm:text-lg mb-0.5 sm:mb-1 uppercase tracking-tight">
                            {feature.title}
                          </h3>
                          <p className="text-white/40 text-xs sm:text-sm font-medium leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 flex-shrink-0">
                          <ArrowUpRight className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0">
              <div 
                ref={phoneRef}
                className="relative w-[240px] sm:w-[280px] md:w-[320px] lg:w-[340px]"
                style={{ perspective: '1000px' }}
              >
                <div className="absolute -inset-12 sm:-inset-16 md:-inset-20 bg-gradient-to-b from-white/10 via-white/5 to-transparent rounded-[80px] sm:rounded-[100px] blur-[80px] sm:blur-[100px] opacity-60" />
                
                <div className="relative w-full aspect-[9/19.5] rounded-[36px] sm:rounded-[42px] md:rounded-[48px] overflow-hidden bg-[#050505] border-[5px] sm:border-[6px] md:border-[7px] border-[#151515] shadow-[0_40px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.05)] flex flex-col">
                  
                  {/* Status Bar Header */}
                  <div className="relative w-full bg-[#000000] pt-3.5 sm:pt-4 md:pt-4 pb-2.5 sm:pb-3 px-5 sm:px-6 md:px-7 flex justify-between items-center z-20 shrink-0">
                    {/* The Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] sm:w-[90px] md:w-[100px] h-[22px] sm:h-[25px] md:h-[28px] bg-black rounded-b-[18px] sm:rounded-b-[20px] md:rounded-b-[24px] z-50 shadow-[0_2px_10px_rgba(0,0,0,0.5)]" />
                    
                    {/* Time */}
                    <span className="text-[11px] sm:text-[12px] md:text-[13px] font-bold text-white tracking-wide z-10 relative mt-0.5">9:41</span>
                    
                    {/* Wifi & Battery */}
                    <div className="flex gap-1.5 items-center z-10 relative mt-0.5">
                      <svg width="16" height="11" viewBox="0 0 17 12" fill="none" className="w-[14px] sm:w-[15px]">
                        <path d="M1 4.5C2.5 2.5 5 1 8.5 1C12 1 14.5 2.5 16 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M3 7C4 5.5 6 4.5 8.5 4.5C11 4.5 13 5.5 14 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        <circle cx="8.5" cy="10" r="1.5" fill="white"/>
                      </svg>
                      <div className="w-[20px] sm:w-[22px] h-[9px] sm:h-[10px] border-[1.5px] border-white/80 rounded-[3px] relative flex items-center justify-start p-[1px]">
                        <div className="h-full w-[80%] bg-white rounded-[1px]" />
                        <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-[4px] bg-white/80 rounded-r-[1px]" />
                      </div>
                    </div>
                  </div>

                  {/* Phone Content (Live Interactive Dashboard Mockup) */}
                  <div className="relative flex-1 w-full z-0 bg-[#070707] p-4 flex flex-col justify-between overflow-hidden font-[family-name:var(--font-jakarta)]">
                    
                    {/* App Header */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-[10px] font-black text-gold">ZP</div>
                          <span className="text-xs font-bold text-white tracking-tight">alice@zpay</span>
                        </div>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold">Stellar Mainnet</span>
                      </div>

                      {/* Main Balance Card */}
                      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] p-4 mb-4">
                        <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block mb-1">Total Balance</span>
                        <div className="text-2xl font-black text-white tracking-tight mb-2">$142,850.00 <span className="text-xs font-normal text-white/40">USDC</span></div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">↑ +14.2% <span className="text-white/40">this week</span></span>
                          <span className="text-white/40 font-mono">0.00001 XLM fee</span>
                        </div>
                      </div>

                      {/* Agent Active Pill */}
                      <div className="rounded-xl border border-gold/30 bg-gold/5 p-2.5 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                        <div className="text-[10px] text-white/80 font-medium leading-tight flex-1">
                          <span className="font-bold text-gold">Agent Alpha:</span> Auto-routing via Stellar DEX
                        </div>
                      </div>

                      {/* Action Grid */}
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {[
                          { label: 'Send', color: 'bg-gold text-black font-bold' },
                          { label: 'Receive', color: 'bg-white/10 text-white' },
                          { label: 'Split', color: 'bg-white/10 text-white' },
                          { label: 'Escrow', color: 'bg-white/10 text-white' },
                        ].map((act) => (
                          <div key={act.label} className={`py-2 rounded-xl text-[10px] text-center font-semibold ${act.color}`}>
                            {act.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Transactions List */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest block">Recent Activity</span>
                      
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] font-bold text-white">Sent to bob@zpay</div>
                          <div className="text-[9px] text-white/40">Stellar Path • 1.8s finality</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] font-bold text-white">-$50.00</div>
                          <div className="text-[9px] text-emerald-400 font-mono">Settled</div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] font-bold text-white">x402 Micro-API Call</div>
                          <div className="text-[9px] text-white/40">Pay-per-query • Auto</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] font-bold text-gold">-$0.001</div>
                          <div className="text-[9px] text-emerald-400 font-mono">Unlocked</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
