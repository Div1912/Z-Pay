"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { ShieldCheck } from 'lucide-react';

const sections = [
  {
    title: '1. Information We Collect',
    content: `ZPAY operates on a privacy-first, non-custodial architecture. We do not collect, store, or have access to your private cryptographic keys, seed phrases, or wallet master passwords — ever.

When you use the ZPAY web dashboard or developer API, we may process minimal operational data necessary for service delivery, including:

• Public wallet addresses and transaction hashes (inherently public on Stellar)
• API request metadata (timestamps, endpoint paths, response codes)
• Basic telemetry for routing performance optimization
• Email address if provided during account creation

We do not collect payment card numbers, bank account details, or sensitive government-issued identity documents. KYC/AML identity exchange, where legally required, is handled directly by licensed Stellar anchor partners under their own privacy regimes.`
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the minimal data we collect exclusively for the following purposes:

• Operating, maintaining, and improving the ZPAY payment routing protocol
• Sending transactional notifications and critical security alerts
• Debugging and resolving API errors on behalf of developer accounts
• Fulfilling legal obligations under applicable financial regulations
• Fraud prevention and anomaly detection on transaction flows

We do not sell, rent, or share your personal data with third-party advertisers or data brokers under any circumstances.`
  },
  {
    title: '3. Blockchain Transparency',
    content: `Please be aware that transactions executed on the Stellar blockchain are inherently public. Your public wallet address and all associated transaction ledger entries are permanently, immutably recorded on-chain and accessible to anyone operating a Stellar node.

ZPAY has no ability to modify, delete, or obscure on-chain transaction records. This is a property of the underlying Stellar Consensus Protocol, not a ZPAY policy choice. Users should treat their public wallet addresses as pseudonymous, not anonymous.`
  },
  {
    title: '4. Data Security & Encryption',
    content: `All off-chain communication between your client application and ZPAY API endpoints is encrypted using TLS 1.3 standards with forward secrecy enabled. Our API infrastructure rejects connections on older, insecure TLS versions.

We employ zero-knowledge principles wherever architecturally feasible — meaning our systems are designed to process the minimum data needed without retaining it. API keys are one-way hashed in storage and are never logged in plaintext.

Multi-Party Computation (MPC) distributes cryptographic responsibilities across geographically separated infrastructure nodes, eliminating single points of compromise.`
  },
  {
    title: '5. Data Retention',
    content: `We retain operational metadata (API request logs, error traces) for a maximum of 90 days for debugging purposes, after which it is automatically purged.

Account information, if provided, is retained for the duration of your account's active status. Upon account deletion request, we purge all off-chain personal data within 30 days, subject to any retention obligations imposed by applicable financial regulations.

On-chain transaction data recorded to the Stellar ledger cannot be deleted — this is an immutable property of the blockchain.`
  },
  {
    title: '6. GDPR Rights for EU Residents',
    content: `If you are resident in the European Union, you have the following rights under GDPR:

• Right of Access: Request a copy of the data we hold about you
• Right to Rectification: Request correction of inaccurate data
• Right to Erasure: Request deletion of off-chain personal data ("right to be forgotten")
• Right to Portability: Receive your data in a structured, machine-readable format
• Right to Object: Object to processing of your data for specific purposes

To exercise any of these rights, contact privacy@zpay.route. We will respond within 30 days.`
  },
  {
    title: '7. Cookies & Tracking',
    content: `The ZPAY web dashboard uses strictly necessary session cookies for authentication. We do not deploy tracking cookies, advertising pixels, or third-party analytics scripts that profile user behavior.

No personal data is transmitted to advertising networks as a result of your use of the ZPAY platform.`
  },
  {
    title: '8. Contact & Complaints',
    content: `If you have questions, concerns, or complaints regarding this Privacy Policy or our data handling practices, please contact our privacy compliance team at privacy@zpay.route.

If you are an EU resident and believe we have not adequately addressed a GDPR complaint, you have the right to lodge a complaint with your local Data Protection Authority (DPA).`
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />

      <section className="pt-36 sm:pt-44 pb-16 px-4 sm:px-6 text-center max-w-[900px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Legal</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-white/40 text-sm font-medium">Last Updated: July 30, 2026 · Effective: August 1, 2026</p>
      </section>

      <section className="pb-32 px-4 sm:px-6 max-w-[800px] mx-auto">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0a0a0a] p-8 sm:p-12 space-y-10">
          <p className="text-white/60 text-base leading-relaxed font-medium border-l-2 border-amber-500/50 pl-4">
            This Privacy Policy describes how ZPAY Protocol (&ldquo;ZPAY&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) collects, uses, and protects information in connection with the ZPAY payment routing protocol, developer API, and web dashboard. By using ZPAY services, you agree to the practices described herein.
          </p>

          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-xl font-bold text-white">{section.title}</h2>
              <div className="text-white/60 text-sm leading-relaxed font-medium whitespace-pre-line">
                {section.content}
              </div>
              {idx < sections.length - 1 && (
                <div className="border-t border-white/[0.06] pt-2" />
              )}
            </div>
          ))}
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
