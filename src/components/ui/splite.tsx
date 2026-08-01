'use client'

import { Suspense, lazy, useState, useEffect } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

function CyberAgentGlobeFallback() {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      {/* Outer Rotating Glowing Halo */}
      <div className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[420px] lg:h-[420px] rounded-full border border-gold/30 bg-gradient-to-tr from-gold/10 via-amber-500/5 to-transparent animate-[spin_20s_linear_infinite] shadow-[0_0_80px_rgba(212,175,55,0.15)]" />
      
      {/* Reverse Counter-Rotating Ring */}
      <div className="absolute w-[220px] h-[220px] sm:w-[290px] sm:h-[290px] lg:w-[340px] lg:h-[340px] rounded-full border border-white/10 border-dashed animate-[spin_15s_linear_infinite_reverse]" />
      
      {/* Inner Glowing Agent Core */}
      <div className="relative w-36 h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full bg-gradient-to-b from-gold/30 via-amber-400/10 to-black border border-gold/40 flex items-center justify-center shadow-[0_0_60px_rgba(212,175,55,0.3)]">
        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center animate-pulse">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gold shadow-[0_0_30px_#d4af37]" />
        </div>
      </div>

      {/* Floating Orbital Node Badges */}
      <div className="absolute top-10 left-10 sm:top-12 sm:left-12 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-black/80 text-emerald-400 text-[10px] font-mono font-bold shadow-lg flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        Stellar Node #512049
      </div>

      <div className="absolute bottom-12 right-8 sm:bottom-16 sm:right-12 px-3 py-1.5 rounded-full border border-gold/30 bg-black/80 text-gold text-[10px] font-mono font-bold shadow-lg flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
        Agent Routing Active
      </div>
    </div>
  )
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Timeout fallback if Spline CDN takes more than 4 seconds on slow connections
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setHasError(true)
      }
    }, 4000)

    return () => clearTimeout(timer)
  }, [isLoaded])

  if (hasError) {
    return <CyberAgentGlobeFallback />
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Immediate zero-latency fallback visible while Spline loads */}
      {!isLoaded && <CyberAgentGlobeFallback />}

      <Suspense fallback={null}>
        <Spline
          scene={scene}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
        />
      </Suspense>
    </div>
  )
}
