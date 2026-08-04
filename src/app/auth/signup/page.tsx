"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  // Invite code gate
  const [inviteCode, setInviteCode] = useState("");
  const [codeStep, setCodeStep] = useState<'code' | 'signup'>('code');
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeError, setCodeError] = useState("");

  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  useEffect(() => {
    // Pre-fill code from URL param (email magic link)
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    if (codeParam) setInviteCode(codeParam.toUpperCase());
    try { localStorage.removeItem("expopay_last_activity"); } catch {}
  }, []);

  const handleValidateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setCodeError('');
    setCodeLoading(true);
    try {
      const res = await fetch('/api/waitlist/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inviteCode.trim() }),
      });
      const data = await res.json();
      if (data.valid) {
        if (data.email) setEmail(data.email);
        setCodeStep('signup');
      } else {
        setCodeError(data.error || 'Invalid access code. Please check and try again.');
      }
    } catch {
      setCodeError('Network error. Please try again.');
    } finally {
      setCodeLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (passwordStrength < 2) { setError("Please use a stronger password"); return; }

    setLoading(true);
    setError("");

    const { data, error: signupError } = await supabase.auth.signUp({ email, password });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
    } else if (data.user?.identities?.length === 0) {
      setError("This email is already registered. Please sign in instead.");
      setLoading(false);
    } else {
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-gold/30 overflow-hidden">

      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 bg-transparent">
        <Link href="/"><Logo /></Link>
        <Link
          href="/auth/login"
          className="flex items-center justify-center px-4 sm:px-6 h-10 sm:h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white text-xs sm:text-sm font-medium hover:bg-white/15 transition-all"
        >
          Sign In
        </Link>
      </nav>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8 sm:mb-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2rem,8vw,3.5rem)] font-black leading-[0.95] tracking-[-0.04em] mb-3 sm:mb-4"
            >
              <span className="block text-white whitespace-nowrap">
                {codeStep === 'code' ? 'Enter Your' : 'Join'}
              </span>
              <span className="block bg-gradient-to-r from-gold via-[#FBBF24] to-[#27272a] bg-clip-text text-transparent whitespace-nowrap">
                {codeStep === 'code' ? 'Access Code' : 'ZPAY'}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white/50 text-sm sm:text-base"
            >
              {codeStep === 'code'
                ? 'ZPAY is invite-only. Enter your access code to continue.'
                : 'Create your universal payment identity'}
            </motion.p>
          </div>

          {/* ── Step 1: Invite code gate ── */}
          {codeStep === 'code' && (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              onSubmit={handleValidateCode}
              className="space-y-4"
            >
              <div className="p-4 rounded-2xl border border-gold/15 bg-gold/5 flex items-start gap-3">
                <span className="text-gold text-lg mt-0.5">🔐</span>
                <p className="text-white/60 text-xs leading-relaxed">
                  ZPAY is currently in <strong className="text-white">private beta</strong>. You need an invite code to create an account.<br />
                  <a href="/waitlist" className="text-gold underline underline-offset-2 hover:text-gold/80 transition-colors">
                    Request access here →
                  </a>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs font-medium text-white/40 ml-1 uppercase tracking-wider">Access Code</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-white/30 group-focus-within:text-gold transition-colors" />
                  <Input
                    type="text"
                    placeholder="ZPAY-XXXX-XXXX"
                    className="w-full h-12 sm:h-14 bg-white/[0.03] border border-white/[0.08] rounded-xl sm:rounded-2xl pl-11 sm:pl-12 pr-4 text-white text-sm sm:text-base placeholder:text-white/25 focus:border-gold/40 focus:bg-white/[0.05] focus:ring-0 transition-all duration-300 font-mono tracking-widest uppercase"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    required
                    maxLength={14}
                  />
                </div>
              </div>

              {codeError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm font-medium"
                >
                  {codeError}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={codeLoading || inviteCode.length < 13}
                className="group w-full h-12 sm:h-14 mt-2 bg-gold hover:bg-gold/90 text-black font-semibold text-sm sm:text-base rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.25)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {codeLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Verify Code
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-center text-white/35 text-xs sm:text-sm">
                Already have an account?{" "}
                <a href="/auth/login" className="text-white font-medium hover:text-gold transition-colors">Sign In</a>
              </p>
            </motion.form>
          )}

          {/* ── Step 2: Signup form (after code verified) ── */}
          {codeStep === 'signup' && (
            <>
              <div className="mb-5 flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 w-fit mx-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 text-xs font-bold tracking-wider">Code verified ✓ — {inviteCode}</span>
              </div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onSubmit={handleSignup}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] sm:text-xs font-medium text-white/40 ml-1 uppercase tracking-wider">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-white/30 group-focus-within:text-gold transition-colors" />
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      className="w-full h-12 sm:h-14 bg-white/[0.03] border border-white/[0.08] rounded-xl sm:rounded-2xl pl-11 sm:pl-12 pr-4 text-white text-sm sm:text-base placeholder:text-white/25 focus:border-gold/40 focus:bg-white/[0.05] focus:ring-0 transition-all duration-300"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] sm:text-xs font-medium text-white/40 ml-1 uppercase tracking-wider">Secure Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-white/30 group-focus-within:text-gold transition-colors" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="w-full h-12 sm:h-14 bg-white/[0.03] border border-white/[0.08] rounded-xl sm:rounded-2xl pl-11 sm:pl-12 pr-4 text-white text-sm sm:text-base placeholder:text-white/25 focus:border-gold/40 focus:bg-white/[0.05] focus:ring-0 transition-all duration-300"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-1.5 h-1 px-1 mt-3">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-500 ${
                          i < passwordStrength
                            ? (passwordStrength <= 2 ? 'bg-[#FBBF24] shadow-[0_0_10px_rgba(245,167,196,0.5)]' : 'bg-gold shadow-[0_0_10px_rgba(198,148,249,0.5)]')
                            : 'bg-white/5'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] sm:text-xs font-medium text-white/40 ml-1 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-white/30 group-focus-within:text-gold transition-colors" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="w-full h-12 sm:h-14 bg-white/[0.03] border border-white/[0.08] rounded-xl sm:rounded-2xl pl-11 sm:pl-12 pr-4 text-white text-sm sm:text-base placeholder:text-white/25 focus:border-gold/40 focus:bg-white/[0.05] focus:ring-0 transition-all duration-300"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full h-12 sm:h-14 mt-2 bg-white hover:bg-white/95 text-black font-semibold text-sm sm:text-base rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </motion.form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="relative my-6 sm:my-8"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.06]"></div>
                </div>
                <div className="relative flex justify-center text-[10px] sm:text-xs font-medium uppercase tracking-widest">
                  <span className="bg-black px-4 text-white/25">Or</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="w-full flex justify-center"
              >
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "273981797365-ke6n33in7sr83gngo8h3fin80m529cqk.apps.googleusercontent.com"}>
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      const { credential } = credentialResponse;
                      if (!credential) return;
                      const { data, error: googleError } = await supabase.auth.signInWithIdToken({
                        provider: 'google',
                        token: credential,
                      });
                      if (googleError) {
                        setError(googleError.message);
                      } else if (data?.user) {
                        await supabase.from('profiles').upsert({
                          id: data.user.id,
                          email: data.user.email,
                        }, { onConflict: 'id', ignoreDuplicates: true });
                        const { data: profile } = await supabase
                          .from('profiles')
                          .select('universal_id, stellar_address')
                          .eq('id', data.user.id)
                          .single();
                        if (profile?.universal_id) {
                          router.push('/dashboard');
                        } else {
                          router.push('/onboarding');
                        }
                      }
                    }}
                    onError={() => { setError('Google Signup Failed'); }}
                    shape="pill"
                    theme="filled_black"
                    text="signup_with"
                    size="large"
                  />
                </GoogleOAuthProvider>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-8 sm:mt-10 text-center text-white/35 text-xs sm:text-sm"
              >
                Already have an ID?{" "}
                <Link href="/auth/login" className="text-white font-medium hover:text-gold transition-colors">Sign In</Link>
              </motion.p>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
