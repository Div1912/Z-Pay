"use client";

import React, { useRef, useState, useEffect } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';
import { Spotlight } from "@/components/ui/spotlight";
import { Mail, Loader2, CheckCircle2, ArrowRight, Sparkles, Users, Zap, ShieldCheck } from 'lucide-react';

const perks = [
  { icon: Zap, label: '~3s settlements on Stellar' },
  { icon: ShieldCheck, label: 'Soroban escrow contracts' },
  { icon: Users, label: 'Split bills & group payments' },
  { icon: Sparkles, label: 'AI agents via X-402 protocol' },
];

const WaitlistHero = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number>(0);

  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlready, setIsAlready] = useState(false);
  const [error, setError] = useState('');

  // Three.js Background Effect
  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    canvasRef.current.appendChild(renderer.domElement);

    const curve = new QuadraticBezierCurve3(
      new Vector3(-15, -4, 0),
      new Vector3(2, 3, 0),
      new Vector3(18, 0.8, 0)
    );

    const vertexShader = `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `;
    const fragmentShader = `
      uniform float time; varying vec2 vUv;
      void main() {
        vec3 col = mix(vec3(0.8,0.8,0.8), vec3(1.0,1.0,1.0), vUv.x * 0.7);
        float glow = pow(1.0 - abs(vUv.y - 0.5) * 2.0, 2.0);
        float fade = vUv.x > 0.85 ? 1.0 - smoothstep(0.85, 1.0, vUv.x) : 1.0;
        float pulse = sin(time * 2.0) * 0.1 + 0.9;
        gl_FragColor = vec4(col * glow * pulse * fade, glow * fade * 0.4);
      }
    `;

    const mat = new ShaderMaterial({ vertexShader, fragmentShader, uniforms: { time: { value: 0 } }, transparent: true, blending: AdditiveBlending, side: DoubleSide });
    const mesh = new Mesh(new TubeGeometry(curve, 200, 0.8, 32, false), mat);
    scene.add(mesh);

    camera.position.z = 7;
    camera.position.y = -0.8;

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      mat.uniforms.time.value = Date.now() * 0.001;
      mesh.rotation.z = Math.sin(Date.now() * 0.0002) * 0.02;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationIdRef.current);
      if (canvasRef.current && renderer.domElement.parentNode === canvasRef.current) {
        canvasRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Something went wrong. Please try again.');
      } else {
        setIsAlready(Boolean(data.already));
        setStep('success');
        setEmail('');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center pt-28 pb-20">
      {/* Three.js Background */}
      <div ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      {/* Gold ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.6) 0%, transparent 70%)', filter: 'blur(80px)', transform: 'translateX(-50%) translateY(40%)' }} />
      </div>

      <div className="flex flex-col w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 items-center text-center gap-16">

        {/* Main card */}
        <div className="relative backdrop-blur-sm bg-black/30 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 w-full max-w-3xl border border-white/[0.07] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

          {/* Private beta badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold/5 backdrop-blur-xl w-fit mb-8 mx-auto">
            <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)] animate-pulse" />
            <span className="text-gold text-[10px] lg:text-[11px] font-bold tracking-widest uppercase">Private Beta · Invite Only</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-white pb-4 mb-2">
            The Future of<br />Payments is<br />
            <span className="text-zinc-400">Agentic</span>
          </h1>

          <p className="mt-4 text-neutral-400 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed font-medium mx-auto">
            ZPAY is currently in <strong className="text-white">private beta</strong>. Submit your request below. If you are selected, you will receive an access code by email to activate your account.
          </p>

          {/* Form / Success state */}
          <div className="mt-10 w-full max-w-lg mx-auto">
            <AnimatePresence mode="wait">
              {step === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center gap-4 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {isAlready ? 'Application Already on File!' : 'Request Received!'}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                      {isAlready
                        ? "Your email is already registered on our private beta waitlist. We review applications in batches — if selected, your access code will be emailed to you."
                        : "Thanks for your interest. We review applications in batches. If you are selected, you will receive an access code via email to activate your account."}
                    </p>
                  </div>
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/15 bg-white/5 text-white font-medium text-sm hover:bg-white/10 transition-all mt-2"
                  >
                    Return to Home
                  </a>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3"
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        disabled={isSubmitting}
                        className="w-full h-14 rounded-full border border-white/10 bg-white/[0.04] pl-11 pr-5 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40 focus:bg-white/[0.07] transition-all backdrop-blur-md text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative h-14 rounded-full bg-gold text-black font-bold text-sm flex items-center justify-center px-8 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] disabled:opacity-70 disabled:hover:scale-100 whitespace-nowrap"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <span className="flex items-center gap-2">
                          Request Access
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      )}
                    </button>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs text-center px-4"
                    >
                      {error}
                    </motion.p>
                  )}

                  <p className="text-white/25 text-xs text-center mt-1">
                    We'll email you a unique code · No spam, ever
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Already have a code? */}
          {step === 'form' && (
            <p className="mt-6 text-white/30 text-sm">
              Already have an access code?{' '}
              <a href="/auth/signup" className="text-white/60 hover:text-white underline underline-offset-4 transition-colors font-medium">
                Sign up now
              </a>
            </p>
          )}
        </div>

        {/* Perks row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl">
          {perks.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.12] hover:bg-white/[0.04] transition-all">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                <Icon className="w-5 h-5 text-white/60" />
              </div>
              <span className="text-white/50 text-xs font-medium text-center leading-snug">{label}</span>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {['seed=u1', 'seed=u2', 'seed=u3', 'seed=u4'].map((s) => (
              <div key={s} className="w-8 h-8 rounded-full border-2 border-black overflow-hidden bg-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?${s}&backgroundColor=b6e3f4,ffd5dc,c0aede`} alt="beta user" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-white/40 text-sm font-medium">
            <span className="text-white font-bold">50+</span> users already on Stellar Mainnet
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
    </section>
  );
};

export default WaitlistHero;
