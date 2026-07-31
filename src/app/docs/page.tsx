"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Terminal, Zap, Shield, Search, ChevronRight, Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const sidebarLinks = [
  {
    category: 'Getting Started',
    icon: Zap,
    items: ['Quick Start', 'Authentication', 'Your First Payment', 'ZPAY ID Guide'],
  },
  {
    category: 'API Reference',
    icon: Terminal,
    items: ['API Overview', 'Payments API', 'Webhooks', 'Rate Limits'],
  },
  {
    category: 'AI Agent SDK',
    icon: BookOpen,
    items: ['Agent SDK Intro', 'Deploying Agents', 'Agent Permissions', 'Receipts'],
  },
  {
    category: 'Security & Auth',
    icon: Shield,
    items: ['Security Model', 'Key Management', 'Audit Logs', 'Compliance'],
  },
];

export default function DocsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Getting Started');
  const [activeItem, setActiveItem] = useState('Quick Start');

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)] flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-black sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Logo className="w-6 h-6" />
          <span className="font-bold tracking-tight">ZPAY Docs</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white/70">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-[61px] md:top-0 h-[calc(100vh-61px)] md:h-screen w-full md:w-72 lg:w-80 bg-[#050505] border-r border-white/5 flex flex-col z-40 transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="hidden md:flex items-center gap-3 p-6 border-b border-white/5">
          <Logo className="w-7 h-7" />
          <span className="font-bold text-lg tracking-tight">ZPAY Docs</span>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 mb-8 text-white/40">
            <Search size={16} />
            <span className="text-sm">Search docs...</span>
            <span className="ml-auto text-[10px] border border-white/10 rounded px-1.5 py-0.5">⌘K</span>
          </div>

          <div className="space-y-8">
            {sidebarLinks.map((section) => {
              const { icon: Icon } = section;
              return (
                <div key={section.category}>
                  <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white/50 mb-3">
                    <Icon size={12} />
                    {section.category}
                  </h4>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item}>
                        <button 
                          onClick={() => {
                            setActiveCategory(section.category);
                            setActiveItem(item);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          item === activeItem && section.category === activeCategory
                            ? 'bg-white/10 text-white font-medium'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}>
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-white/5 mt-auto">
          <Link href="/" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            Back to main site
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-black min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-12 md:py-20">
          
          <div className="flex items-center gap-2 text-sm text-white/40 mb-8 font-medium">
            <span>Docs</span>
            <ChevronRight size={14} />
            <span>{activeCategory}</span>
            <ChevronRight size={14} />
            <span className="text-white">{activeItem}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">{activeItem}</h1>
          
          {activeItem === 'Quick Start' ? (
            <>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                Welcome to ZPAY. This guide will walk you through setting up your first autonomous payment agent on the Stellar network. You'll be ready to route transactions in less than 5 minutes.
              </p>
              
              <div className="space-y-12">
                {/* Step 1 */}
            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm font-bold">1</span>
                Create your API Key
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-6">
                Before you can instantiate the ZPAY client, you need a secret key. Go to your dashboard and generate a new key with `Payment` permissions.
              </p>
              <div className="rounded-xl border border-white/10 bg-[#0d0d0d] overflow-hidden">
                <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                  <span className="text-xs text-white/40 font-mono">Terminal</span>
                </div>
                <div className="p-4 sm:p-6 overflow-x-auto">
                  <code className="text-sm font-mono text-emerald-400">
                    export ZPAY_SECRET_KEY="sk_test_123456789"
                  </code>
                </div>
              </div>
            </section>

            {/* Step 2 */}
            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm font-bold">2</span>
                Initialize the Client
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-6">
                Install the SDK via npm and initialize it with your secret key. The SDK automatically resolves Stellar network requirements in the background.
              </p>
              <div className="rounded-xl border border-white/10 bg-[#0d0d0d] overflow-hidden">
                <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                  <span className="text-xs text-white/40 font-mono">index.ts</span>
                </div>
                <div className="p-4 sm:p-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-white/80 leading-relaxed">
                    <span className="text-blue-400">import</span> {'{ ZPay }'} <span className="text-blue-400">from</span> <span className="text-green-400">'@zpay/sdk'</span>;<br/><br/>
                    <span className="text-blue-400">const</span> client = <span className="text-blue-400">new</span> ZPay({'{'}<br/>
                    {'  '}apiKey: process.env.ZPAY_SECRET_KEY,<br/>
                    {'  '}network: <span className="text-green-400">'testnet'</span><br/>
                    {'}'});
                  </pre>
                </div>
              </div>
            </section>

            {/* Step 3 */}
            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm font-bold">3</span>
                Send a Payment
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-6">
                You can route payments using simple ZPAY IDs (like an email address) instead of complex wallet hashes.
              </p>
              <div className="rounded-xl border border-white/10 bg-[#0d0d0d] overflow-hidden">
                <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                  <span className="text-xs text-white/40 font-mono">payment.ts</span>
                </div>
                <div className="p-4 sm:p-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-white/80 leading-relaxed">
                    <span className="text-blue-400">const</span> tx = <span className="text-blue-400">await</span> client.payments.create({'{'}<br/>
                    {'  '}to: <span className="text-green-400">'alice@zpay'</span>,<br/>
                    {'  '}amount: <span className="text-orange-400">50.00</span>,<br/>
                    {'  '}currency: <span className="text-green-400">'USDC'</span>,<br/>
                    {'  '}agent_memo: <span className="text-green-400">'Invoice #1024 settlement'</span><br/>
                    {'}'});<br/><br/>
                    console.log(`Success! Tx Hash: ${'{'}tx.hash{'}'}`);
                  </pre>
                </div>
              </div>
            </section>
          </div>
          </>
          ) : (
            <div className="py-20 text-center border border-white/5 bg-white/[0.02] rounded-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Coming Soon</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Content under construction</h3>
              <p className="text-white/50">The documentation for {activeItem} is currently being written.</p>
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
            <button className="text-white/40 hover:text-white text-sm font-medium transition-colors">
              Authentication
            </button>
            <button className="flex items-center gap-2 text-white hover:text-gold text-sm font-medium transition-colors">
              Your First Payment <ChevronRight size={16} />
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
