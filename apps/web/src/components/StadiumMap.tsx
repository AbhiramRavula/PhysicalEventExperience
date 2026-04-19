"use client";

import React from "react";

interface ZoneDensity {
  id: string;
  density: number;
}

interface StadiumMapProps {
  /** If provided, renders density overlays for the operator view */
  densities?: ZoneDensity[];
  /** If true, shows the player's current location pin */
  showPlayerPin?: boolean;
  /** Compact mode for the fan app */
  compact?: boolean;
}

const densityFill = (d: number) => {
  if (d > 80) return "rgba(239,68,68,0.45)";
  if (d > 55) return "rgba(245,158,11,0.38)";
  return "rgba(16,185,129,0.28)";
};

const densityStroke = (d: number) => {
  if (d > 80) return "rgba(239,68,68,0.9)";
  if (d > 55) return "rgba(245,158,11,0.9)";
  return "rgba(16,185,129,0.9)";
};

export default function StadiumMap({ densities = [], showPlayerPin = false, compact = false }: StadiumMapProps) {
  const getDensity = (id: string) => densities.find((z) => z.id === id)?.density ?? 0;

  const vb = compact ? "0 0 400 360" : "0 0 600 540";
  const cx = compact ? 200 : 300;
  const cy = compact ? 175 : 265;
  // Stadium oval radii
  const rx = compact ? 160 : 240;
  const ry = compact ? 130 : 200;
  // Pitch dimensions
  const pitchW = compact ? 18 : 26;
  const pitchH = compact ? 70 : 110;
  // Boundary circle
  const bRx = compact ? 112 : 168;
  const bRy = compact ? 88 : 136;
  // Inner circle (30-yard)
  const iRx = compact ? 70 : 100;
  const iRy = compact ? 55 : 80;

  return (
    <svg
      viewBox={vb}
      className="w-full h-full"
      style={{ fontFamily: "inherit" }}
    >
      <defs>
        {/* Grass gradient */}
        <radialGradient id="grass" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a3a1a" />
          <stop offset="100%" stopColor="#0d2010" />
        </radialGradient>
        {/* Glow filters */}
        <filter id="glow-red" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-blue" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Stand gradients */}
        <linearGradient id="standN" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#1e2d4d" />
          <stop offset="100%" stopColor="#0f1929" />
        </linearGradient>
        <linearGradient id="standS" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e2d4d" />
          <stop offset="100%" stopColor="#0f1929" />
        </linearGradient>
        <linearGradient id="standE" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e2d4d" />
          <stop offset="100%" stopColor="#0f1929" />
        </linearGradient>
        <linearGradient id="standW" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#1e2d4d" />
          <stop offset="100%" stopColor="#0f1929" />
        </linearGradient>
      </defs>

      {/* ── OUTER STADIUM SHELL ── */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#07111e" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />

      {/* ── STAND SEATING TIERS (concentric bands) ── */}
      {[0.96, 0.88, 0.80, 0.73].map((scale, i) => (
        <ellipse
          key={i}
          cx={cx} cy={cy}
          rx={rx * scale} ry={ry * scale}
          fill="none"
          stroke={`rgba(255,255,255,${0.03 + i * 0.015})`}
          strokeWidth={compact ? 4 : 7}
          strokeDasharray={compact ? "2 3" : "3 4"}
        />
      ))}

      {/* ── STAND ZONE OVERLAYS (operator density) ── */}
      {densities.length > 0 && (
        <>
          {/* North Stand */}
          <path
            d={`M ${cx - rx * 0.72} ${cy - ry * 0.72} A ${rx * 0.72} ${ry * 0.72} 0 0 1 ${cx + rx * 0.72} ${cy - ry * 0.72} A ${rx} ${ry} 0 0 0 ${cx - rx} ${cy - 5} Z`}
            fill={densityFill(getDensity("zone-stand-n"))}
            stroke={densityStroke(getDensity("zone-stand-n"))}
            strokeWidth="1"
            opacity="0.85"
          />
          {/* South Stand */}
          <path
            d={`M ${cx - rx * 0.72} ${cy + ry * 0.72} A ${rx * 0.72} ${ry * 0.72} 0 0 0 ${cx + rx * 0.72} ${cy + ry * 0.72} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy + 5} Z`}
            fill={densityFill(getDensity("zone-stand-s"))}
            stroke={densityStroke(getDensity("zone-stand-s"))}
            strokeWidth="1"
            opacity="0.85"
          />
          {/* East Stand */}
          <path
            d={`M ${cx + rx * 0.72} ${cy - ry * 0.72} A ${rx * 0.72} ${ry * 0.72} 0 0 1 ${cx + rx * 0.72} ${cy + ry * 0.72} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy} Z`}
            fill={densityFill(getDensity("zone-stand-e"))}
            stroke={densityStroke(getDensity("zone-stand-e"))}
            strokeWidth="1"
            opacity="0.85"
          />
          {/* West Stand */}
          <path
            d={`M ${cx - rx * 0.72} ${cy - ry * 0.72} A ${rx * 0.72} ${ry * 0.72} 0 0 0 ${cx - rx * 0.72} ${cy + ry * 0.72} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy} Z`}
            fill={densityFill(getDensity("zone-stand-w"))}
            stroke={densityStroke(getDensity("zone-stand-w"))}
            strokeWidth="1"
            opacity="0.85"
          />
        </>
      )}

      {/* ── OUTFIELD (grass) ── */}
      <ellipse cx={cx} cy={cy} rx={bRx} ry={bRy} fill="url(#grass)" />

      {/* ── BOUNDARY ROPE ── */}
      <ellipse
        cx={cx} cy={cy}
        rx={bRx - (compact ? 4 : 6)} ry={bRy - (compact ? 3 : 5)}
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth={compact ? 0.8 : 1.2}
        strokeDasharray="6 4"
      />

      {/* ── 30-YARD CIRCLE ── */}
      <ellipse
        cx={cx} cy={cy}
        rx={iRx} ry={iRy}
        fill="none"
        stroke="rgba(255,255,255,0.20)"
        strokeWidth={compact ? 0.6 : 0.9}
        strokeDasharray="4 3"
      />

      {/* ── MOWING PATTERN (light/dark strips) ── */}
      {Array.from({ length: compact ? 8 : 12 }).map((_, i) => {
        const stripW = (bRx * 2) / (compact ? 8 : 12);
        const x = (cx - bRx) + i * stripW;
        return (
          <clipPath key={i} id={`strip${i}`}>
            <rect x={x} y={cy - bRy} width={stripW} height={bRy * 2} />
          </clipPath>
        );
      })}
      {Array.from({ length: compact ? 8 : 12 }).map((_, i) => (
        i % 2 === 0 ? (
          <ellipse
            key={i}
            cx={cx} cy={cy}
            rx={bRx - (compact ? 4 : 6)} ry={bRy - (compact ? 3 : 5)}
            fill="rgba(255,255,255,0.025)"
            clipPath={`url(#strip${i})`}
          />
        ) : null
      ))}

      {/* ── PITCH STRIP ── */}
      <rect
        x={cx - pitchW / 2}
        y={cy - pitchH / 2}
        width={pitchW}
        height={pitchH}
        rx={compact ? 2 : 3}
        fill="rgba(210,185,140,0.55)"
        stroke="rgba(210,185,140,0.8)"
        strokeWidth="0.7"
      />

      {/* ── CREASE LINES ── */}
      {/* Popping creases */}
      <line x1={cx - pitchW / 2 - (compact ? 3 : 5)} y1={cy - pitchH / 2 + (compact ? 8 : 14)} x2={cx + pitchW / 2 + (compact ? 3 : 5)} y2={cy - pitchH / 2 + (compact ? 8 : 14)} stroke="white" strokeWidth="0.8" opacity="0.8" />
      <line x1={cx - pitchW / 2 - (compact ? 3 : 5)} y1={cy + pitchH / 2 - (compact ? 8 : 14)} x2={cx + pitchW / 2 + (compact ? 3 : 5)} y2={cy + pitchH / 2 - (compact ? 8 : 14)} stroke="white" strokeWidth="0.8" opacity="0.8" />
      {/* Return creases */}
      <line x1={cx - pitchW / 2 - (compact ? 3 : 5)} y1={cy - pitchH / 2 + (compact ? 8 : 14)} x2={cx - pitchW / 2 - (compact ? 3 : 5)} y2={cy - pitchH / 2 + (compact ? 14 : 22)} stroke="white" strokeWidth="0.6" opacity="0.7" />
      <line x1={cx + pitchW / 2 + (compact ? 3 : 5)} y1={cy - pitchH / 2 + (compact ? 8 : 14)} x2={cx + pitchW / 2 + (compact ? 3 : 5)} y2={cy - pitchH / 2 + (compact ? 14 : 22)} stroke="white" strokeWidth="0.6" opacity="0.7" />
      <line x1={cx - pitchW / 2 - (compact ? 3 : 5)} y1={cy + pitchH / 2 - (compact ? 8 : 14)} x2={cx - pitchW / 2 - (compact ? 3 : 5)} y2={cy + pitchH / 2 - (compact ? 14 : 22)} stroke="white" strokeWidth="0.6" opacity="0.7" />
      <line x1={cx + pitchW / 2 + (compact ? 3 : 5)} y1={cy + pitchH / 2 - (compact ? 8 : 14)} x2={cx + pitchW / 2 + (compact ? 3 : 5)} y2={cy + pitchH / 2 - (compact ? 14 : 22)} stroke="white" strokeWidth="0.6" opacity="0.7" />
      {/* Bowling crease */}
      <line x1={cx - pitchW / 2} y1={cy - pitchH / 2 + (compact ? 8 : 14)} x2={cx + pitchW / 2} y2={cy - pitchH / 2 + (compact ? 8 : 14)} stroke="white" strokeWidth="0.5" opacity="0.6" />
      <line x1={cx - pitchW / 2} y1={cy + pitchH / 2 - (compact ? 8 : 14)} x2={cx + pitchW / 2} y2={cy + pitchH / 2 - (compact ? 8 : 14)} stroke="white" strokeWidth="0.5" opacity="0.6" />
      {/* Stumps */}
      {[-3, 0, 3].map((off) => (
        <React.Fragment key={off}>
          <rect x={cx + off * (compact ? 1 : 1.5) - 0.5} y={cy - pitchH / 2 + (compact ? 5 : 8)} width={1} height={compact ? 6 : 9} rx={0.5} fill="rgba(255,220,100,0.9)" />
          <rect x={cx + off * (compact ? 1 : 1.5) - 0.5} y={cy + pitchH / 2 - (compact ? 11 : 17)} width={1} height={compact ? 6 : 9} rx={0.5} fill="rgba(255,220,100,0.9)" />
        </React.Fragment>
      ))}

      {/* ── FIELDING POSITION DOTS ── (infield) */}
      {!compact && ([
        { x: cx, y: cy - iRy * 0.55, label: "MID-ON" },
        { x: cx, y: cy + iRy * 0.55, label: "MID-OFF" },
        { x: cx - iRx * 0.75, y: cy - iRy * 0.3, label: "SQ LEG" },
        { x: cx + iRx * 0.75, y: cy - iRy * 0.3, label: "POINT" },
        { x: cx - iRx * 0.6, y: cy + iRy * 0.55, label: "MID-WKT" },
        { x: cx + iRx * 0.6, y: cy + iRy * 0.55, label: "COVER" },
        { x: cx, y: cy - pitchH / 2 - 18, label: "BOWLER" },
      ].map(({ x, y, label }, i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3" fill="rgba(255,255,255,0.35)" />
          <text x={x} y={y - 6} textAnchor="middle" fontSize="5.5" fill="rgba(255,255,255,0.3)" fontWeight="700" letterSpacing="0.5">{label}</text>
        </g>
      )))}

      {/* ── OUTFIELD FIELDERS ── */}
      {!compact && ([
        { x: cx, y: cy - bRy * 0.68 },
        { x: cx + bRx * 0.65, y: cy - bRy * 0.45 },
        { x: cx - bRx * 0.65, y: cy - bRy * 0.45 },
        { x: cx + bRx * 0.75, y: cy + bRy * 0.2 },
        { x: cx - bRx * 0.75, y: cy + bRy * 0.2 },
      ].map(({ x, y }, i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="rgba(100,200,255,0.55)" stroke="rgba(100,200,255,0.8)" strokeWidth="0.8" />
      )))}

      {/* ── DRESSING ROOMS / PAVILION LABELS ── */}
      {!compact && (
        <>
          <text x={cx} y={cy - ry * 0.88} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.35)" fontWeight="800" letterSpacing="2">NORTH PAVILION</text>
          <text x={cx} y={cy + ry * 0.88} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.35)" fontWeight="800" letterSpacing="2">SOUTH STAND</text>
          <text x={cx - rx * 0.82} y={cy + 3} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.28)" fontWeight="700" letterSpacing="1.5" transform={`rotate(-90, ${cx - rx * 0.82}, ${cy})`}>EAST STAND</text>
          <text x={cx + rx * 0.82} y={cy + 3} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.28)" fontWeight="700" letterSpacing="1.5" transform={`rotate(90, ${cx + rx * 0.82}, ${cy})`}>WEST STAND</text>
        </>
      )}

      {/* ── GATE MARKERS ── */}
      {!compact && ([
        { x: cx - 18, y: cy - ry * 0.98, label: "GATE A" },
        { x: cx - 18, y: cy + ry * 0.98 - 8, label: "GATE C" },
        { x: cx + rx * 0.98, y: cy - 4, label: "GATE B" },
        { x: cx - rx * 0.98 - 32, y: cy - 4, label: "GATE D" },
      ].map(({ x, y, label }, i) => (
        <g key={i}>
          <rect x={x} y={y} width={36} height={10} rx={3} fill="rgba(59,130,246,0.3)" stroke="rgba(59,130,246,0.7)" strokeWidth="0.7" />
          <text x={x + 18} y={y + 7.2} textAnchor="middle" fontSize="5.5" fill="rgba(147,197,253,0.9)" fontWeight="800" letterSpacing="1">{label}</text>
        </g>
      )))}

      {/* ── SCOREBOARD ── */}
      {!compact && (
        <g>
          <rect x={cx + rx * 0.7} y={cy - ry * 0.18} width={compact ? 28 : 52} height={compact ? 16 : 28} rx={4} fill="rgba(0,0,0,0.7)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
          <text x={cx + rx * 0.7 + 26} y={cy - ry * 0.18 + 10} textAnchor="middle" fontSize="6" fill="rgba(255,220,50,0.9)" fontWeight="800">156/4</text>
          <text x={cx + rx * 0.7 + 26} y={cy - ry * 0.18 + 18} textAnchor="middle" fontSize="5" fill="rgba(255,255,255,0.5)">15.3 OVERS</text>
          <text x={cx + rx * 0.7 + 26} y={cy - ry * 0.18 + 25} textAnchor="middle" fontSize="4.5" fill="rgba(100,200,100,0.8)">HYD vs BLR</text>
        </g>
      )}

      {/* ── PLAYER / USER PIN ── */}
      {showPlayerPin && (
        <g filter="url(#glow-blue)">
          <circle cx={cx + bRx * 0.3} cy={cy - bRy * 0.5} r={compact ? 5 : 7} fill="#3b82f6" opacity="0.3">
            <animate attributeName="r" values={`${compact ? 5 : 7};${compact ? 12 : 16};${compact ? 5 : 7}`} dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx + bRx * 0.3} cy={cy - bRy * 0.5} r={compact ? 4 : 5.5} fill="#3b82f6" stroke="white" strokeWidth={compact ? 1 : 1.5} />
          <text x={cx + bRx * 0.3} y={cy - bRy * 0.5 + 2} textAnchor="middle" fontSize={compact ? "4" : "5"} fill="white" fontWeight="800">YOU</text>
        </g>
      )}

      {/* ── FOOD STALLS (compact fan view) ── */}
      {compact && (
        <>
          <g>
            <circle cx={cx - bRx * 0.7} cy={cy - 10} r="5" fill="rgba(245,158,11,0.8)" stroke="rgba(245,158,11,1)" strokeWidth="0.8" />
            <text x={cx - bRx * 0.7} y={cy - 16} textAnchor="middle" fontSize="5" fill="rgba(245,158,11,0.9)" fontWeight="700">FOOD</text>
          </g>
          <g>
            <circle cx={cx + bRx * 0.7} cy={cy + 10} r="5" fill="rgba(245,158,11,0.8)" stroke="rgba(245,158,11,1)" strokeWidth="0.8" />
            <text x={cx + bRx * 0.7} y={cy + 4} textAnchor="middle" fontSize="5" fill="rgba(245,158,11,0.9)" fontWeight="700">FOOD</text>
          </g>
          <g>
            <circle cx={cx} cy={cy + bRy * 0.85} r="5" fill="rgba(139,92,246,0.8)" stroke="rgba(139,92,246,1)" strokeWidth="0.8" />
            <text x={cx} y={cy + bRy * 0.85 - 7} textAnchor="middle" fontSize="5" fill="rgba(139,92,246,0.9)" fontWeight="700">WC</text>
          </g>
        </>
      )}
    </svg>
  );
}
