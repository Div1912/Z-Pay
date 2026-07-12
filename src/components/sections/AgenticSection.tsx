"use client";

import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Terminal, Code2, Bot, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Spotlight } from "@/components/ui/spotlight";

gsap.registerPlugin(ScrollTrigger);

const terminalLines = [
  { text: "{", type: "log", delay: 0 },
  { text: "  \"mcpServers\": {", type: "log", delay: 0.2 },
  { text: "    \"zpay-agent\": {", type: "action", delay: 0.4 },
  { text: "      \"command\": \"node\",", type: "log", delay: 0.6 },
  { text: "      \"args\": [\"mcp-server/stdio.js\"],", type: "log", delay: 0.8 },
  { text: "      \"env\": {", type: "log", delay: 1.0 },
  { text: "        \"ZPAY_EMAIL\": \"agent@domain.com\",", type: "cmd", delay: 1.2 },
  { text: "        \"ZPAY_PASSWORD\": \"********\"", type: "cmd", delay: 1.4 },
  { text: "      }", type: "log", delay: 1.6 },
  { text: "    }", type: "action", delay: 1.8 },
  { text: "  }", type: "log", delay: 2.0 },
  { text: "}", type: "log", delay: 2.2 },
  { text: " ", type: "log", delay: 2.4 },
  { text: "[ZPAY MCP] Connected via stdio.", type: "success", delay: 3.0 },
  { text: "[ZPAY MCP] 6 tools registered (x402, split_contract, escrow...)", type: "success", delay: 3.5 }
];

export default function AgenticSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(terminalRef, { once: true, margin: "-100px" });
  const [visibleLines, setVisibleLines] = useState<number>(0);

  // Terminal Typing effect
  useEffect(() => {
    if (!isInView) return;

    const timeouts: NodeJS.Timeout[] = [];
    terminalLines.forEach((line, index) => {
      const timeout = setTimeout(() => {
        setVisibleLines(prev => Math.max(prev, index + 1));
      }, line.delay * 1000);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [isInView]);

  // GSAP Scroll effect
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom", // Start when top of section hits bottom of viewport
        end: "center center", // End when center of section hits center of viewport
        scrub: 1,
        animation: gsap.fromTo(contentRef.current, 
          { opacity: 0, y: 100, scale: 0.95 }, 
          { opacity: 1, y: 0, scale: 1, ease: "power2.out" }
        )
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 bg-black overflow-hidden border-t border-white/5"
    >
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[50vw] max-w-[600px] aspect-square rounded-full bg-purple-600/10 blur-[150px] md:blur-[200px]" />
        <div className="absolute bottom-0 right-0 w-[45vw] max-w-[500px] aspect-square rounded-full bg-blue-600/10 blur-[130px] md:blur-[180px]" />
      </div>

      <div 
        ref={contentRef}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col justify-center py-4 lg:py-0 relative z-20">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4 sm:mb-6 shadow-2xl w-fit">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-zinc-300 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/60">
                Model Context Protocol
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[1.05] tracking-widest bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 pb-2">
              Agentic <br />
              AI Protocol
            </h2>

            <p className="mt-4 lg:mt-6 text-neutral-400 text-base lg:text-xl max-w-lg leading-relaxed font-medium">
              Z-Pay exposes a standard Model Context Protocol (MCP) server. Fuse it with any AI terminal like Claude Desktop or Cursor to give your AI agents the power to execute split contracts, bypass X402 paywalls, and audit on-chain history.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div className="group relative p-4 sm:p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex flex-col gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Terminal className="w-5 h-5 text-white/80" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Universal Standard</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    Connect via stdio to any MCP-compatible client. No complicated setup—just add our config file to your AI agent's environment.
                  </p>
                </div>
              </div>

              <div className="group relative p-4 sm:p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex flex-col gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white/80" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Advanced Contracts</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    Empower your agents to natively build atomic split-revenue transactions and time-locked escrow contracts on Stellar.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="mt-8 lg:mt-12 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Link 
                href="/docs/mcp" 
                className="group relative h-12 lg:h-14 rounded-full bg-[#D4AF37] text-black font-bold text-sm flex items-center justify-center px-8 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(212,175,55,0.3)] overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center gap-2">
                  EXPLORE MCP DOCS
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>

          {/* Right Content: Mac Terminal Mockup */}
          <div ref={terminalRef} className="w-full relative pt-10 lg:pt-0">
            {/* Terminal Window */}
            <div className="relative w-full rounded-2xl border border-white/10 bg-[#0c0c0c] shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Terminal Header */}
              <div className="h-12 border-b border-white/10 bg-white/[0.02] flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.4)]" />
                <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                <div className="flex-1 flex justify-center items-center gap-2 text-neutral-500 text-xs font-medium pr-10">
                  <Code2 className="w-3 h-3" />
                  <span>zpay-mcp-server — bash</span>
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-6 font-mono text-sm leading-relaxed min-h-[340px]">
                {terminalLines.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={index < visibleLines ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-2 ${
                      line.type === 'cmd' ? 'text-white font-semibold' :
                      line.type === 'success' ? 'text-emerald-400' :
                      line.type === 'action' ? 'text-cyan-400' :
                      line.type === 'cursor' ? 'text-neutral-500 animate-pulse' :
                      'text-neutral-400'
                    }`}
                  >
                    {line.text}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
