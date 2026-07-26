"use client";

import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { 
  Scene, 
  PerspectiveCamera, 
  WebGLRenderer, 
  QuadraticBezierCurve3, 
  Vector3, 
  TubeGeometry, 
  ShaderMaterial, 
  Mesh, 
  AdditiveBlending, 
  DoubleSide 
} from "three";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Spotlight } from "@/components/ui/spotlight";

gsap.registerPlugin(ScrollTrigger);

const WaitlistHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number>(0);
  
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 45,
    hours: 12,
    minutes: 30,
    seconds: 0,
  });

  // Three.js Background Effect
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new Scene();
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    canvasRef.current.appendChild(renderer.domElement);

    const curve = new QuadraticBezierCurve3(
      new Vector3(-15, -4, 0), 
      new Vector3(2, 3, 0), 
      new Vector3(18, 0.8, 0)
    );

    const tubeGeometry = new TubeGeometry(curve, 200, 0.8, 32, false);

    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vec3 color1 = vec3(0.8, 0.8, 0.8); // Silver
        vec3 color2 = vec3(0.3, 0.3, 0.3); // Dark Gray
        vec3 color3 = vec3(1.0, 1.0, 1.0); // White
        
        vec3 finalColor = mix(color1, color2, vUv.x);
        finalColor = mix(finalColor, color3, vUv.x * 0.7);
        
        float glow = 1.0 - abs(vUv.y - 0.5) * 2.0;
        glow = pow(glow, 2.0);
        
        float fade = 1.0;
        if (vUv.x > 0.85) {
          fade = 1.0 - smoothstep(0.85, 1.0, vUv.x);
        }
        
        float pulse = sin(time * 2.0) * 0.1 + 0.9;
        gl_FragColor = vec4(finalColor * glow * pulse * fade, glow * fade * 0.4);
      }
    `;

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { time: { value: 0 } },
      transparent: true,
      blending: AdditiveBlending,
      side: DoubleSide,
    });

    const lightStreak = new Mesh(tubeGeometry, material);
    scene.add(lightStreak);

    const glowGeometry = new TubeGeometry(curve, 200, 2.0, 32, false);
    const glowMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vec3 color1 = vec3(0.4, 0.4, 0.4);
          vec3 color2 = vec3(0.1, 0.1, 0.1);
          vec3 finalColor = mix(color1, color2, vUv.x);
          
          float glow = 1.0 - abs(vUv.y - 0.5) * 2.0;
          glow = pow(glow, 4.0);
          
          float fade = 1.0;
          if (vUv.x > 0.85) {
            fade = 1.0 - smoothstep(0.85, 1.0, vUv.x);
          }
          float pulse = sin(time * 1.5) * 0.05 + 0.95;
          gl_FragColor = vec4(finalColor * glow * pulse * fade, glow * fade * 0.15);
        }
      `,
      uniforms: { time: { value: 0 } },
      transparent: true,
      blending: AdditiveBlending,
      side: DoubleSide,
    });

    const glowLayer = new Mesh(glowGeometry, glowMaterial);
    scene.add(glowLayer);

    camera.position.z = 7;
    camera.position.y = -0.8;

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      material.uniforms.time.value = time;
      glowMaterial.uniforms.time.value = time;

      lightStreak.rotation.z = Math.sin(time * 0.2) * 0.02;
      glowLayer.rotation.z = Math.sin(time * 0.2) * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      if (canvasRef.current && renderer.domElement) {
        canvasRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      tubeGeometry.dispose();
      glowGeometry.dispose();
      material.dispose();
      glowMaterial.dispose();
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        else if (days > 0) { days--; hours = 23; minutes = 59; seconds = 59; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // GSAP Scroll Parallax
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
      className="relative h-[150vh] w-full bg-black overflow-x-hidden flex justify-center"
    >
      {/* Three.js Background */}
      <div ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      
      <div 
        ref={contentRef}
        className="flex flex-col min-h-[100dvh] w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 items-center justify-center pt-20 pb-20 text-center"
      >
        <div className="relative backdrop-blur-[2px] bg-black/10 rounded-[3rem] p-8 md:p-16 w-full max-w-4xl shadow-2xl border border-white/5 overflow-hidden">
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl w-fit mb-8 shadow-2xl mx-auto">
            <div className="w-2 h-2 rounded-full bg-zinc-300 shadow-[0_0_8px_#d4d4d8] animate-pulse" />
            <span className="text-white/80 text-[10px] lg:text-[11px] font-bold tracking-widest uppercase">
              Early Access
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[6rem] font-extrabold leading-[1.05] tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-500 pb-4">
            The Future of <br />
            Payments is <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-white to-zinc-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Agentic</span>
          </h1>
          
          <p className="mt-6 text-neutral-400 text-sm sm:text-base lg:text-xl max-w-2xl leading-relaxed font-medium mx-auto">
            Be the first to experience zero friction, autonomous transactions. Join the waitlist for exclusive early access to Z-Pay.
          </p>

          <div className="mt-12 w-full max-w-lg mx-auto">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col items-center justify-center gap-4 shadow-2xl"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">You're on the list.</h3>
                  <p className="text-white/60 font-medium text-sm">
                    We'll be in touch very soon.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center sm:items-stretch justify-center relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  required
                  disabled={isSubmitting}
                  className="flex-1 h-14 rounded-full border border-white/10 bg-white/[0.03] px-6 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all backdrop-blur-md w-full disabled:opacity-50 text-base"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative h-14 rounded-full bg-white text-black font-bold text-sm flex items-center justify-center px-8 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] overflow-hidden w-full sm:w-auto shrink-0 disabled:opacity-75 disabled:hover:scale-100"
                >
                  <span className="relative z-10 flex items-center gap-2 tracking-wide">
                    {isSubmitting ? 'JOINING...' : 'GET ACCESS'}
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

          <div className="mt-12 flex flex-col items-center justify-center gap-4">
            <span className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">Launching In</span>
            <div className="flex items-center justify-center gap-4 sm:gap-8 text-center bg-white/[0.02] border border-white/5 rounded-2xl px-8 py-4 backdrop-blur-md">
              <div>
                <div className="text-3xl sm:text-4xl font-light text-white font-mono">{timeLeft.days.toString().padStart(2, '0')}</div>
                <div className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Days</div>
              </div>
              <div className="text-white/20 text-3xl font-light mb-4">:</div>
              <div>
                <div className="text-3xl sm:text-4xl font-light text-white font-mono">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Hours</div>
              </div>
              <div className="text-white/20 text-3xl font-light mb-4">:</div>
              <div>
                <div className="text-3xl sm:text-4xl font-light text-white font-mono">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Mins</div>
              </div>
              <div className="text-white/20 text-3xl font-light mb-4">:</div>
              <div>
                <div className="text-3xl sm:text-4xl font-light text-white font-mono">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Secs</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />
    </section>
  );
};

export default WaitlistHero;
