
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
            duration: 1,
            ease: "power3.out",
          })
          .to(cardsRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          }, "-=0.7")
          .to(phoneRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
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
        <div className="absolute top-1/4 right-0 w-[50vw] max-w-[600px] aspect-square rounded-full bg-purple-600/10 blur-[150px] md:blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[45vw] max-w-[500px] aspect-square rounded-full bg-blue-600/10 blur-[130px] md:blur-[180px]" />
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
                  <span className="block bg-gradient-to-r from-zinc-100 via-neutral-300 to-neutral-600 bg-clip-text text-transparent text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[5vw] xl:text-[4.5rem]">Actions</span>
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
                        onClick={() => router.push('/auth/signup')}
                        className="feature-card group relative p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-500 cursor-pointer overflow-hidden"
                      >
                      <div className="absolute inset-0 bg-gradient-to-r from-zinc-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-zinc-100 to-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
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
                
                <div className="relative w-full aspect-[9/19.5] rounded-[36px] sm:rounded-[42px] md:rounded-[48px] overflow-hidden bg-[#050505] border-[5px] sm:border-[6px] md:border-[7px] border-[#151515] shadow-[0_40px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.05)]">
                  <Image 
                    src="/images/quick_action_phone.jpg" 
                    alt="Quick Action UI" 
                    fill 
                    className="object-cover object-center z-0 opacity-100"
                  />
                  
                  <div className="absolute top-2.5 sm:top-3 md:top-3.5 left-1/2 -translate-x-1/2 w-[80px] sm:w-[90px] md:w-[100px] h-[22px] sm:h-[25px] md:h-[28px] bg-black rounded-full z-50 shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                  
                  <div className="absolute top-3 sm:top-3.5 md:top-4 left-6 sm:left-7 md:left-8 z-10">
                    <span className="text-[11px] sm:text-[12px] md:text-[13px] font-bold text-white tracking-wide drop-shadow-md">9:41</span>
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
