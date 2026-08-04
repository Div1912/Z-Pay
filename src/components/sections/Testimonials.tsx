"use client";

import React, { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Spotlight } from "@/components/ui/spotlight";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Indie Developer",
    company: "Bangalore, India",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    content: "Sent 45000 rupees to my contractor in 3 seconds flat. No bank transfer delays and no excessive processing fees. ZPAY on Stellar is genuinely what modern payments should feel like.",
  },
  {
    name: "Priya Krishnan",
    role: "Startup Founder",
    company: "Chennai, India",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    content: "Used the escrow feature to pay a freelancer across three milestones. The smart contract released funds automatically on verified delivery. Zero disputes and total peace of mind.",
  },
  {
    name: "Vikram Patel",
    role: "CFO",
    company: "Mumbai, India",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    content: "Our finance team settled vendor payments across multiple countries. ZPAY handled currency conversion and routing automatically, saving us substantial exchange fees.",
  },
  {
    name: "Sneha Reddy",
    role: "Product Manager",
    company: "Hyderabad, India",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    content: "The autonomous agent paid our recurring cloud subscriptions right on schedule this month. I funded the balance once and it took care of everything seamlessly.",
  },
  {
    name: "Aryan Singh",
    role: "Web3 Builder",
    company: "Delhi, India",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    content: "Integrated the x402 payment endpoint into my web application in under an hour. The first transaction confirmed in seconds with effortless developer tools.",
  },
];

const floatingAvatars = [
  { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", x: -220, y: -100, size: 50, delay: 0 },
  { src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", x: 240, y: -80, size: 56, delay: 0.1 },
  { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", x: -260, y: 50, size: 44, delay: 0.2 },
  { src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80", x: 280, y: 70, size: 48, delay: 0.3 },
  { src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80", x: -160, y: 120, size: 40, delay: 0.4 },
  { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", x: 180, y: 130, size: 36, delay: 0.5 },
];

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, cardsRef.current], {
        opacity: 0,
        y: 60,
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
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
          }, "-=0.6");
        },
        once: true,
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-black py-20 sm:py-28 md:py-40 overflow-hidden"
    >
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[900px] aspect-square rounded-full bg-gradient-to-br from-white/10 to-transparent blur-[150px] md:blur-[200px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1400px]">
        <div ref={titleRef} className="relative mb-16 sm:mb-20 md:mb-24 lg:mb-28">
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            {floatingAvatars.map((avatar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: avatar.delay, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="absolute rounded-full overflow-hidden border-2 border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
                style={{
                  left: `calc(50% + ${avatar.x}px)`,
                  top: `calc(50% + ${avatar.y}px)`,
                  width: avatar.size,
                  height: avatar.size,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3.5, delay: avatar.delay, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-full"
                >
                  <Image
                    src={avatar.src}
                    alt="User"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-5 sm:mb-6 md:mb-8">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-zinc-300 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/60">Community</span>
            </div>
            
            <h2 className="font-black leading-[0.9] tracking-tight mb-4 sm:mb-6">
              <span className="block text-white text-[10vw] sm:text-[8vw] md:text-[7vw] lg:text-[5vw] xl:text-[4rem]">Trusted by</span>
              <span className="block text-zinc-400 text-[10vw] sm:text-[8vw] md:text-[7vw] lg:text-[5vw] xl:text-[4rem]">50+ Beta</span>
              <span className="block text-white text-[10vw] sm:text-[8vw] md:text-[7vw] lg:text-[5vw] xl:text-[4rem]">Users</span>
            </h2>
            
            <p className="text-white/50 text-sm sm:text-base md:text-lg lg:text-xl max-w-lg mx-auto">
              Join the growing community trusted for reliability and security.
            </p>
          </div>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="testimonial-card group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative bg-[#0d0d0d] border border-white/[0.06] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 h-full hover:border-white/[0.12] transition-all duration-500 hover:transform hover:translate-y-[-4px] flex flex-col">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                  <div className="relative w-11 sm:w-12 md:w-14 aspect-square rounded-full overflow-hidden border-2 border-white/10 shadow-[0_15px_30px_rgba(255,255,255,0.1)] flex-shrink-0">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm sm:text-base md:text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-white/40 text-xs sm:text-sm">
                      {testimonial.role}
                    </p>
                    {/* Company badge */}
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[9px] sm:text-[10px] font-semibold text-white/40 tracking-wide">
                      {testimonial.company}
                    </span>
                  </div>
                </div>
                
                <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-4 sm:mb-5 md:mb-6 flex-1">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                
                <div className="flex gap-0.5 sm:gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#a3a3a3" className="w-3.5 sm:w-4 md:w-[18px]">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
