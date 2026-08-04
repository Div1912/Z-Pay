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
    name: "Arjun Mehta",
    role: "CTO",
    company: "Razorpay Alumni",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ArjunMehta&backgroundColor=b6e3f4&radius=50",
    content: "We integrated ZPAY's agent API into our payroll system. 40,000 contractor payments settled in under 3 seconds each. Nothing else in the ecosystem comes close to this throughput.",
  },
  {
    name: "Sarah Chen",
    role: "Head of Finance",
    company: "Stripe Atlas",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen&backgroundColor=ffd5dc&radius=50",
    content: "Cross-border invoicing used to take 3–5 banking days. With ZPAY on Stellar, our international contractors are paid in under 30 seconds. Genuinely game-changing for global ops.",
  },
  {
    name: "Rohan Verma",
    role: "Founder",
    company: "IndieStack",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RohanVerma&backgroundColor=c0aede&radius=50",
    content: "Built my entire SaaS billing layer on ZPAY's agent infrastructure. Zero payment failures in 8 months. The reliability and auditability of every transaction is simply unreal.",
  }
];

const floatingAvatars = [
  { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1&backgroundColor=b6e3f4", x: -220, y: -100, size: 50, delay: 0 },
  { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user2&backgroundColor=ffd5dc", x: 240, y: -80, size: 56, delay: 0.1 },
  { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user3&backgroundColor=c0aede", x: -260, y: 50, size: 44, delay: 0.2 },
  { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user4&backgroundColor=d1f4e0", x: 280, y: 70, size: 48, delay: 0.3 },
  { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user5&backgroundColor=ffe4c4", x: -160, y: 120, size: 40, delay: 0.4 },
  { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user6&backgroundColor=f0d9ff", x: 180, y: 130, size: 36, delay: 0.5 },
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
              <span className="block bg-gradient-to-r from-zinc-100 via-neutral-300 to-neutral-600 bg-clip-text text-transparent text-[10vw] sm:text-[8vw] md:text-[7vw] lg:text-[5vw] xl:text-[4rem]">500,000+</span>
              <span className="block text-white text-[10vw] sm:text-[8vw] md:text-[7vw] lg:text-[5vw] xl:text-[4rem]">Users</span>
            </h2>
            
            <p className="text-white/50 text-sm sm:text-base md:text-lg lg:text-xl max-w-lg mx-auto">
              Join the growing community trusted for reliability and security.
            </p>
          </div>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
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
