import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  src?: string;
}

export const TS25Logo: React.FC<LogoProps> = ({
  className = 'w-16 h-16',
  size,
  src,
}) => {
  if (src) {
    return (
      <img
        src={src}
        alt="Logo TS25"
        className={`${className} object-contain`}
        style={size ? { width: size, height: size } : undefined}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* TS25 Stylized Lettermark Background Shapes */}
      {/* "T" block */}
      <rect x="25" y="18" width="55" height="120" rx="8" fill="#1e3a8a" />
      <rect x="18" y="32" width="70" height="30" rx="6" fill="#1e3a8a" />

      {/* Decorative radar / rings in "T" */}
      <circle cx="52" cy="78" r="32" stroke="#eab308" strokeWidth="2.5" fill="none" opacity="0.8" />
      <circle cx="52" cy="78" r="22" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.9" />
      <circle cx="52" cy="78" r="12" fill="#0f172a" />

      {/* "S" block */}
      <path
        d="M92 18H165C170 18 175 22 175 28V68C175 74 170 78 165 78H125V92H165C170 92 175 96 175 102V132C175 138 170 142 165 142H88C83 142 78 138 78 132V98C78 92 83 88 88 88H132V68H92C87 68 82 64 82 58V28C82 22 87 18 92 18Z"
        fill="#1e3a8a"
        stroke="#ffffff"
        strokeWidth="3"
      />

      {/* Radar rings inside "S" top loop */}
      <circle cx="134" cy="48" r="24" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.9" />
      <circle cx="134" cy="48" r="14" stroke="#eab308" strokeWidth="2.5" fill="none" opacity="0.8" />

      {/* White '25' Badge */}
      <rect x="122" y="104" width="46" height="28" rx="4" fill="#ffffff" />
      <text
        x="145"
        y="125"
        textAnchor="middle"
        fill="#1e3a8a"
        fontSize="19"
        fontWeight="900"
        fontFamily="sans-serif"
      >
        25
      </text>

      {/* TS25 Subtitle: "PROGRAM TRANSFORMASI SEKOLAH 2025" */}
      <text
        x="100"
        y="160"
        textAnchor="middle"
        fill="#0f172a"
        fontSize="8.5"
        fontWeight="800"
        fontFamily="sans-serif"
        letterSpacing="0.2"
      >
        PROGRAM TRANSFORMASI SEKOLAH 2025
      </text>

      {/* Navy Bottom Banner: "Penggerak Pembelajaran Bermakna" */}
      <rect x="10" y="168" width="180" height="22" rx="3" fill="#1e3a8a" />
      <text
        x="100"
        y="183"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="8.5"
        fontWeight="700"
        fontFamily="sans-serif"
        letterSpacing="0.3"
      >
        Penggerak Pembelajaran Bermakna
      </text>
    </svg>
  );
};
