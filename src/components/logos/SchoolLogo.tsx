import React, { useState, useEffect } from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  src?: string;
  alt?: string;
  showLineLuar?: boolean;
}

export const SchoolLogo: React.FC<LogoProps> = ({
  className = 'w-16 h-16',
  size,
  src,
  alt = 'Logo Rasmi SK St Patrick Mukah (SPS)',
  showLineLuar = true,
}) => {
  // Check local storage for user-uploaded custom logo file (e.g. LOGO SPS 2024 (line luar).png)
  const [persistedSrc, setPersistedSrc] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sk_st_patrick_logo_sps');
      if (stored) {
        setPersistedSrc(stored);
      }
    } catch {
      // Ignore storage errors in sandboxed environments
    }

    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('sk_st_patrick_logo_sps');
        setPersistedSrc(stored || null);
      } catch {
        // Ignore
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sps_logo_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sps_logo_updated', handleStorageChange);
    };
  }, []);

  const activeSrc = src || persistedSrc;

  if (activeSrc) {
    return (
      <img
        src={activeSrc}
        alt={alt}
        className={`${className} object-contain`}
        style={size ? { width: size, height: size } : undefined}
      />
    );
  }

  // Exact vector reproduction of LOGO SPS 2024 (line luar).png
  return (
    <svg
      viewBox="0 0 280 330"
      className={`${className} object-contain`}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Subtle drop shadow for realism */}
        <filter id="sps-shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.25" />
        </filter>
        
        {/* Linear gradient for royal blue shield */}
        <linearGradient id="shield-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="50%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>

        {/* Gold gradients for torch & accents */}
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>

        {/* Torch flame gradient */}
        <radialGradient id="flame-grad" cx="50%" cy="70%" r="60%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </radialGradient>
      </defs>

      {/* 1. OUTERMOST CUTTING LINE ("LINE LUAR" 2024 SPECIFICATION) */}
      {showLineLuar && (
        <path
          d="M 32 45 
             C 32 24 50 12 140 12 
             C 230 12 248 24 248 45 
             L 248 70 
             C 268 70 274 80 274 95 
             C 274 150 258 230 140 318 
             C 22 230 6 150 6 95 
             C 6 80 12 70 32 70 
             Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      )}

      {/* 2. MAIN SHIELD BODY (ROYAL NAVY BLUE) */}
      <path
        d="M 38 48 
           C 38 32 55 20 140 20 
           C 225 20 242 32 242 48 
           L 242 165 
           C 242 225 180 268 140 286 
           C 100 268 38 225 38 165 
           Z"
        fill="url(#shield-blue)"
        stroke="#000000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* 3. TOP RIBBON / BANNER: SEKOLAH KEBANGSAAN ST. PATRICK */}
      <g>
        {/* Ribbon banner background */}
        <path
          d="M 28 42 
             C 28 30 45 22 140 22 
             C 235 22 252 30 252 42 
             L 246 64 
             C 225 56 185 52 140 52 
             C 95 52 55 56 34 64 
             Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Ribbon Left Fold Tail */}
        <path
          d="M 28 42 L 18 52 L 34 64 L 28 54 Z"
          fill="#e2e8f0"
          stroke="#000000"
          strokeWidth="1.5"
        />
        {/* Ribbon Right Fold Tail */}
        <path
          d="M 252 42 L 262 52 L 246 64 L 252 54 Z"
          fill="#e2e8f0"
          stroke="#000000"
          strokeWidth="1.5"
        />
        {/* Curved Path for Top Banner Text */}
        <path
          id="sps-top-banner-path"
          d="M 36 53 C 75 42 205 42 244 53"
          fill="none"
        />
        <text
          x="140"
          y="50"
          textAnchor="middle"
          fill="#000000"
          fontSize="9.5"
          fontWeight="900"
          letterSpacing="0.8"
          style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        >
          SEKOLAH KEBANGSAAN ST. PATRICK
        </text>
      </g>

      {/* 4. CENTRAL HERALDIC INNER SHIELD (DIVIDED INTO 4 QUADRANTS) */}
      <g filter="url(#sps-shadow)">
        {/* Inner Shield Container Outline */}
        <path
          d="M 70 78 
             H 210 
             V 152 
             C 210 196 170 226 140 238 
             C 110 226 70 196 70 152 
             Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="3"
        />

        {/* --- QUADRANT 1: TOP-LEFT (WHITE FIELD - SHAMROCK / TREFOIL) --- */}
        <rect x="71" y="79" width="68" height="65" fill="#ffffff" />
        
        {/* St. Patrick's Shamrock (3-leaf green clover with stem) */}
        <g transform="translate(105, 111) scale(0.95)">
          {/* Stem */}
          <path
            d="M 0 10 C 2 18 7 22 10 24"
            fill="none"
            stroke="#15803d"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Top Leaf */}
          <path
            d="M 0 -2 C -7 -14 -16 -4 0 5 C 16 -4 7 -14 0 -2 Z"
            fill="#16a34a"
            stroke="#14532d"
            strokeWidth="1"
          />
          {/* Left Leaf */}
          <path
            d="M -2 0 C -14 -7 -14 -16 -5 0 C -14 16 -4 7 -2 0 Z"
            fill="#15803d"
            stroke="#14532d"
            strokeWidth="1"
            transform="rotate(-55, -2, 0)"
          />
          {/* Right Leaf */}
          <path
            d="M 2 0 C 14 -7 14 -16 5 0 C 14 16 4 7 2 0 Z"
            fill="#16a34a"
            stroke="#14532d"
            strokeWidth="1"
            transform="rotate(55, 2, 0)"
          />
          {/* Leaf center highlight */}
          <circle cx="0" cy="2" r="2.5" fill="#22c55e" />
        </g>

        {/* --- QUADRANT 2: TOP-RIGHT (RED FIELD - TORCH OF KNOWLEDGE) --- */}
        <rect x="140" y="79" width="69" height="65" fill="#dc2626" />
        
        {/* Golden Flaming Torch (Obor) */}
        <g transform="translate(174.5, 111) scale(0.95)">
          {/* Torch Handle */}
          <path
            d="M -3 10 L 3 10 L 2 24 L -2 24 Z"
            fill="url(#gold-grad)"
            stroke="#78350f"
            strokeWidth="1"
          />
          <line x1="-3" y1="16" x2="3" y2="16" stroke="#78350f" strokeWidth="1" />
          {/* Torch Cup / Bowl */}
          <path
            d="M -8 10 L 8 10 L 5 4 L -5 4 Z"
            fill="url(#gold-grad)"
            stroke="#78350f"
            strokeWidth="1.2"
          />
          <ellipse cx="0" cy="4" rx="6" ry="2" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
          {/* Torch Flame */}
          <path
            d="M 0 -16 
               C 6 -8 9 -4 6 2 
               C 4 6 -4 6 -6 2 
               C -9 -4 -6 -8 0 -16 Z"
            fill="url(#flame-grad)"
          />
          {/* Inner Flame Spark */}
          <path
            d="M 0 -8 C 3 -3 4 0 2 3 C 1 4 -1 4 -2 3 C -4 0 -3 -3 0 -8 Z"
            fill="#fef08a"
          />
        </g>

        {/* --- QUADRANT 3: BOTTOM-LEFT (YELLOW FIELD - OPEN BOOK OF WISDOM) --- */}
        <path
          d="M 71 144 H 140 V 212 C 122 205 92 186 71 152 Z"
          fill="#facc15"
        />
        
        {/* Open Book (Buku Terbuka) */}
        <g transform="translate(105, 172) scale(0.95)">
          {/* Left Page */}
          <path
            d="M 0 4 C -8 1 -18 3 -20 7 L -20 -6 C -18 -10 -8 -8 0 -6 Z"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="1.2"
          />
          {/* Right Page */}
          <path
            d="M 0 4 C 8 1 18 3 20 7 L 20 -6 C 18 -10 8 -8 0 -6 Z"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="1.2"
          />
          {/* Center Spine */}
          <line x1="0" y1="-6" x2="0" y2="4" stroke="#000000" strokeWidth="1.5" />
          {/* Left Page Text Lines */}
          <line x1="-16" y1="-3" x2="-4" y2="-2" stroke="#475569" strokeWidth="1" />
          <line x1="-16" y1="0" x2="-4" y2="1" stroke="#475569" strokeWidth="1" />
          <line x1="-16" y1="3" x2="-4" y2="4" stroke="#475569" strokeWidth="1" />
          {/* Right Page Text Lines */}
          <line x1="4" y1="-2" x2="16" y2="-3" stroke="#475569" strokeWidth="1" />
          <line x1="4" y1="1" x2="16" y2="0" stroke="#475569" strokeWidth="1" />
          <line x1="4" y1="4" x2="16" y2="3" stroke="#475569" strokeWidth="1" />
        </g>

        {/* --- QUADRANT 4: BOTTOM-RIGHT (GREEN FIELD - LATIN CROSS) --- */}
        <path
          d="M 140 144 H 209 V 152 C 188 186 158 205 140 212 Z"
          fill="#16a34a"
        />
        
        {/* White Latin Cross (Salib Warisan St. Patrick) */}
        <g transform="translate(174.5, 172) scale(0.95)">
          <path
            d="M -3 -16 H 3 V -5 H 12 V 1 H 3 V 18 H -3 V 1 H -12 V -5 H -3 Z"
            fill="#ffffff"
            stroke="#0f172a"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Subtle inner highlight */}
          <line x1="0" y1="-14" x2="0" y2="16" stroke="#e2e8f0" strokeWidth="1" />
        </g>

        {/* Central Cross Dividing Lines (Black) */}
        <line x1="70" y1="144" x2="210" y2="144" stroke="#000000" strokeWidth="3" />
        <line x1="140" y1="78" x2="140" y2="238" stroke="#000000" strokeWidth="3" />

        {/* Outer Border of 4 Quadrants */}
        <path
          d="M 70 78 
             H 210 
             V 152 
             C 210 196 170 226 140 238 
             C 110 226 70 196 70 152 
             Z"
          fill="none"
          stroke="#000000"
          strokeWidth="3"
        />
      </g>

      {/* 5. HISTORICAL ESTABLISHMENT TEXT (AS. 1903 MUKAH) */}
      <g>
        {/* Shield lower center label backing */}
        <rect
          x="95"
          y="244"
          width="90"
          height="28"
          rx="4"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="1.5"
        />
        <text
          x="140"
          y="256"
          textAnchor="middle"
          fill="#000000"
          fontSize="9.5"
          fontWeight="900"
          letterSpacing="0.8"
        >
          AS. 1903
        </text>
        <text
          x="140"
          y="268"
          textAnchor="middle"
          fill="#000000"
          fontSize="9.5"
          fontWeight="900"
          letterSpacing="1"
        >
          MUKAH
        </text>
      </g>

      {/* 6. BOTTOM BANNER RIBBON: MOTTO "ILMU PEDOMAN HIDUP" */}
      <g>
        {/* Left Ribbon Tail */}
        <path
          d="M 32 292 L 14 280 L 32 268 L 22 280 Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M 32 268 L 52 276 L 32 292 Z"
          fill="#cbd5e1"
          stroke="#000000"
          strokeWidth="1.5"
        />

        {/* Right Ribbon Tail */}
        <path
          d="M 248 292 L 266 280 L 248 268 L 258 280 Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M 248 268 L 228 276 L 248 292 Z"
          fill="#cbd5e1"
          stroke="#000000"
          strokeWidth="1.5"
        />

        {/* Main Ribbon Center Section */}
        <path
          d="M 30 274 
             C 65 264 215 264 250 274 
             L 242 300 
             C 210 288 70 288 38 300 
             Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Curved Path for Bottom Motto */}
        <path
          id="sps-bottom-motto-path"
          d="M 38 291 C 75 280 205 280 242 291"
          fill="none"
        />
        <text
          x="140"
          y="288"
          textAnchor="middle"
          fill="#000000"
          fontSize="11"
          fontWeight="900"
          letterSpacing="1.5"
          style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        >
          ILMU PEDOMAN HIDUP
        </text>
      </g>
    </svg>
  );
};
